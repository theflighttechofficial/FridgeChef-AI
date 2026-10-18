/**
 * Trains the on-device recipe recommender and writes src/ml/model.json.
 *
 *   npm run train:model
 *
 * Two stages, both deterministic (seeded RNG) and dependency-free:
 *   1. Ingredient embeddings. Build an ingredient x context co-occurrence matrix from the recipe
 *      corpus (contexts = other ingredients + the ingredient's culinary group + cuisines), weight it
 *      with positive PMI, and factorise it with a truncated eigen-decomposition. Ingredients used in
 *      the same kinds of dishes end up close together, which gives the ranker substitute awareness.
 *   2. Ranking weights (stage 3's classifier supplies the region-fit feature). Simulate pantries (a recipe's ingredients with some dropped, some swapped for
 *      same-group substitutes, plus unrelated noise) and fit a linear listwise (softmax) ranker over
 *      the features in src/ml/features.ts so the source recipe ranks first.
 *   3. Cuisine classifier. Multinomial naive Bayes over ingredients (counts stored, Laplace-smoothed
 *      at run time) predicts the cuisine of any ingredient set. The in-app composer uses it to give
 *      improvised recipes the right flavour base. Scored with leave-one-out accuracy.
 * Held-out pantries measure top-1 / top-3 hit rate and MRR against a plain coverage baseline.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { INGREDIENTS } from '../src/ml/data/ingredients';
import { corpus } from '../src/ml/data/recipes';
import { REGION_OF } from '../src/ml/data/schema';
import { tokens } from '../src/ml/normalize';
import { BY_NAME } from '../src/ml/normalize';
import { FEATURE_NAMES, recipeFeatures, roleOf } from '../src/ml/features';

const DIM = 24;
const GROUP_SHARE = 0.3;
const RETROFIT_BETA = 1.5;
const RETROFIT_ITERATIONS = 10;
const SEED = 20261018;
const TRAIN_SESSIONS_PER_RECIPE = 40;
const TEST_SESSIONS_PER_RECIPE = 10;
const NEGATIVES = 24;
const HARD_NEGATIVES = 8;
const SAME_REGION_NOISE = 0.6;
const EPOCHS = 30;
const LR = 0.05;
const L2 = 1e-4;

// ---------- RNG ----------
let state = SEED;
const rand = () => {
  state |= 0;
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const shuffle = <T>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const recipes = corpus();
const vocab = INGREDIENTS.map((d) => d.name);
const index = new Map(vocab.map((n, i) => [n, i]));

// Validate corpus
for (const r of recipes) {
  for (const ing of r.ingredients) if (!index.has(ing)) throw new Error(`Unknown ingredient "${ing}" in "${r.title}"`);
}
const ids = new Set(recipes.map((r) => r.id));
if (ids.size !== recipes.length) throw new Error('Duplicate recipe titles in corpus');
for (const r of recipes) if (!REGION_OF[r.cuisine]) throw new Error(`Cuisine "${r.cuisine}" of "${r.title}" is missing from REGIONS`);
// One phrase must map to one ingredient, or pantry matching becomes order-dependent
const phraseOwner = new Map<string, string>();
for (const d of INGREDIENTS) {
  for (const phrase of [d.name, ...(d.aliases || [])]) {
    const key = tokens(phrase).join(' ');
    const owner = phraseOwner.get(key);
    if (owner && owner !== d.name) throw new Error(`"${phrase}" is listed under both "${owner}" and "${d.name}"`);
    phraseOwner.set(key, d.name);
  }
}

// ---------- Stage 1: embeddings ----------
const groups = [...new Set(INGREDIENTS.map((d) => d.group))];
const cuisines = [...new Set(recipes.map((r) => r.cuisine))];
const ctxCount = vocab.length + groups.length + cuisines.length;
const M = vocab.map(() => new Float64Array(ctxCount));

for (const r of recipes) {
  const ci = vocab.length + groups.length + cuisines.indexOf(r.cuisine);
  for (const a of r.ingredients) {
    const ia = index.get(a)!;
    M[ia][ci] += 1;
    for (const b of r.ingredients) if (a !== b) M[ia][index.get(b)!] += 1;
  }
}
// Group context, scaled to a share of each row so same-role ingredients (spinach and kale, paneer
// and feta) stay close even when one of them rarely appears in the corpus
INGREDIENTS.forEach((d, i) => {
  const mass = M[i].reduce((s, v) => s + v, 0);
  M[i][vocab.length + groups.indexOf(d.group)] += 3 + GROUP_SHARE * mass;
});

// PPMI
const rowSum = M.map((row) => row.reduce((s, v) => s + v, 0));
const colSum = new Float64Array(ctxCount);
M.forEach((row) => row.forEach((v, j) => (colSum[j] += v)));
const total = rowSum.reduce((s, v) => s + v, 0);
const P = M.map((row, i) =>
  Float64Array.from(row, (v, j) => (v > 0 ? Math.max(0, Math.log((v * total) / (rowSum[i] * colSum[j]))) : 0))
);

// Gram matrix G = P P^T, then top-DIM eigenvectors by power iteration with deflation
const n = vocab.length;
const G = Array.from({ length: n }, (_, i) => Float64Array.from({ length: n }, (_, j) => P[i].reduce((s, v, k) => s + v * P[j][k], 0)));
const eigVecs: Float64Array[] = [];
const eigVals: number[] = [];
for (let k = 0; k < DIM; k++) {
  let v = Float64Array.from({ length: n }, () => rand() - 0.5);
  let lambda = 0;
  for (let it = 0; it < 300; it++) {
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) w[i] += G[i][j] * v[j];
    for (let p = 0; p < eigVecs.length; p++) {
      const u = eigVecs[p];
      const dot = u.reduce((s, x, i) => s + x * w[i], 0);
      for (let i = 0; i < n; i++) w[i] -= dot * u[i];
    }
    const norm = Math.hypot(...w);
    if (!norm) break;
    lambda = norm;
    v = w.map((x) => x / norm);
  }
  eigVecs.push(v);
  eigVals.push(lambda);
}
const unit = (e: number[]) => {
  const norm = Math.hypot(...e) || 1;
  return e.map((x) => x / norm);
};
const distributional = vocab.map((_, i) => unit(eigVecs.map((u, k) => u[i] * Math.sqrt(Math.sqrt(eigVals[k]))))); // U * S^(1/2) of P

// Retrofitting (Faruqui et al., 2015): pull each vector toward its culinary-group neighbours while
// staying close to its distributional vector, so substitutes score high without losing context.
const groupMates = INGREDIENTS.map((d, i) => INGREDIENTS.map((o, j) => (j !== i && o.group === d.group ? j : -1)).filter((j) => j >= 0));
let embeddings = distributional.map((e) => [...e]);
for (let it = 0; it < RETROFIT_ITERATIONS; it++) {
  embeddings = embeddings.map((_, i) => {
    const mates = groupMates[i];
    if (!mates.length) return distributional[i];
    const beta = RETROFIT_BETA / mates.length;
    return unit(distributional[i].map((x, k) => (x + beta * mates.reduce((s, j) => s + embeddings[j][k], 0)) / (1 + RETROFIT_BETA)));
  });
}
const sim = (a: string, b: string) => {
  const ia = index.get(a);
  const ib = index.get(b);
  if (ia === undefined || ib === undefined) return 0;
  return embeddings[ia].reduce((s, x, k) => s + x * embeddings[ib][k], 0);
};

// ---------- Stage 3: cuisine classifier ----------
const cuisineList = [...new Set(recipes.map((r) => r.cuisine))].sort();
const docCount = cuisineList.map(() => 0);
const counts = cuisineList.map(() => new Map<number, number>());
recipes.forEach((r) => {
  const c = cuisineList.indexOf(r.cuisine);
  docCount[c]++;
  for (const ing of r.ingredients) counts[c].set(index.get(ing)!, (counts[c].get(index.get(ing)!) || 0) + 1);
});
const ALPHA = 0.5;
const classify = (ings: string[], exclude?: (typeof recipes)[number]) => {
  const self = exclude ? cuisineList.indexOf(exclude.cuisine) : -1;
  return cuisineList
    .map((_, c) => {
      const docs = docCount[c] - (c === self ? 1 : 0);
      if (docs <= 0) return -Infinity;
      let total = 0;
      counts[c].forEach((v) => (total += v));
      if (c === self) total -= exclude!.ingredients.length;
      let score = Math.log(docs);
      for (const ing of ings) {
        const i = index.get(ing)!;
        const n = (counts[c].get(i) || 0) - (c === self && exclude!.ingredients.includes(ing) ? 1 : 0);
        score += Math.log((n + ALPHA) / (total + ALPHA * vocab.length));
      }
      return score;
    })
    .map((score, c) => ({ cuisine: cuisineList[c], score }))
    .sort((a, b) => b.score - a.score);
};
let cTop1 = 0;
let cTop3 = 0;
let rTop1 = 0;
for (const r of recipes) {
  const ranked = classify(r.ingredients, r);
  if (ranked[0].cuisine === r.cuisine) cTop1++;
  if (ranked.slice(0, 3).some((x) => x.cuisine === r.cuisine)) cTop3++;
  if (REGION_OF[ranked[0].cuisine] === REGION_OF[r.cuisine]) rTop1++;
}
const cuisineMetrics = {
  cuisines: cuisineList.length,
  regions: new Set(cuisineList.map((c) => REGION_OF[c])).size,
  leaveOneOut: {
    cuisineTop1: +(cTop1 / recipes.length).toFixed(3),
    cuisineTop3: +(cTop3 / recipes.length).toFixed(3),
    regionTop1: +(rTop1 / recipes.length).toFixed(3),
  },
};
console.log('cuisine classifier', cuisineMetrics);

/** Probability of each region given the ingredients, with `exclude`'s own counts removed. */
const regionProbs = (ings: string[], exclude?: (typeof recipes)[number]) => {
  const ranked = classify(ings, exclude);
  const max = ranked[0].score;
  const z = ranked.reduce((acc, r) => acc + Math.exp(r.score - max), 0);
  const out: Record<string, number> = {};
  for (const r of ranked) out[REGION_OF[r.cuisine]] = (out[REGION_OF[r.cuisine]] || 0) + Math.exp(r.score - max) / z;
  return out;
};

// ---------- Stage 2: ranker ----------
const byGroup = new Map<string, string[]>();
for (const d of INGREDIENTS) byGroup.set(d.group, [...(byGroup.get(d.group) || []), d.name]);

const byRegion = new Map<string, typeof recipes>();
for (const r of recipes) byRegion.set(r.region, [...(byRegion.get(r.region) || []), r]);

const simulatePantry = (target: (typeof recipes)[number]) => {
  const pantry = new Set<string>();
  const keepCore = 0.45 + rand() * 0.5;
  for (const ing of target.ingredients) {
    const role = roleOf(ing);
    const keep = role === 'core' ? keepCore : role === 'flavour' ? 0.5 : 0.8;
    if (rand() >= keep) continue;
    // Sometimes the cook has a same-group substitute instead of the exact item
    const mates = byGroup.get(BY_NAME.get(ing)!.group)!.filter((m) => m !== ing);
    pantry.add(role === 'core' && mates.length && rand() < 0.2 ? pick(mates) : ing);
  }
  // Other items already in the fridge; real kitchens lean towards one region's cooking
  const noise = 2 + Math.floor(rand() * 8);
  const sameRegion = byRegion.get(target.region)!;
  for (let i = 0; i < noise; i++) pantry.add(pick(pick(rand() < SAME_REGION_NOISE ? sameRegion : recipes).ingredients));
  return pantry;
};

interface Session {
  feats: number[][]; // [0] is the positive
  baseline: number[]; // coverage-only scores, same order
}

const makeSession = (targetIdx: number): Session => {
  const target = recipes[targetIdx];
  const pantry = simulatePantry(target);
  // Hard negatives: the recipes that overlap this pantry most, so the ranker learns to tell
  // plausible candidates apart (where cuisine fit matters), plus random ones
  const overlap = recipes.map((r, i) => [i, r.ingredients.filter((x) => pantry.has(x)).length / r.ingredients.length] as const);
  const hard = overlap.filter(([i]) => i !== targetIdx).sort((a, b) => b[1] - a[1]).slice(0, HARD_NEGATIVES).map(([i]) => i);
  const others = [...hard, ...shuffle(recipes.map((_, i) => i).filter((i) => i !== targetIdx && !hard.includes(i))).slice(0, NEGATIVES - HARD_NEGATIVES)];
  const cands = [targetIdx, ...others];
  // Leave the target out of the classifier so the region signal is honest
  const fit = regionProbs([...pantry], target);
  const feats = cands.map((i) => recipeFeatures(pantry, recipes[i].ingredients, sim, fit[recipes[i].region] || 0));
  return { feats, baseline: feats.map((f) => f[0] - 0.01 * f[3]) };
};

const train: Session[] = [];
const test: Session[] = [];
recipes.forEach((_, i) => {
  for (let s = 0; s < TRAIN_SESSIONS_PER_RECIPE; s++) train.push(makeSession(i));
  for (let s = 0; s < TEST_SESSIONS_PER_RECIPE; s++) test.push(makeSession(i));
});

const F = FEATURE_NAMES.length;
const w = new Float64Array(F);
const dot = (a: ArrayLike<number>, b: ArrayLike<number>) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

for (let epoch = 0; epoch < EPOCHS; epoch++) {
  let loss = 0;
  for (const s of shuffle(train)) {
    const scores = s.feats.map((f) => dot(w, f));
    const max = Math.max(...scores);
    const exps = scores.map((x) => Math.exp(x - max));
    const Z = exps.reduce((a, b) => a + b, 0);
    loss += -Math.log(exps[0] / Z);
    const grad = new Float64Array(F);
    s.feats.forEach((f, c) => {
      const p = exps[c] / Z - (c === 0 ? 1 : 0);
      for (let k = 0; k < F; k++) grad[k] += p * f[k];
    });
    for (let k = 0; k < F; k++) w[k] -= LR * (grad[k] + L2 * w[k]);
  }
  if (epoch % 10 === 9 || epoch === 0) console.log(`epoch ${epoch + 1}: loss ${(loss / train.length).toFixed(4)}`);
}

// ---------- Evaluation ----------
const evaluate = (scoreOf: (s: Session) => number[]) => {
  let top1 = 0;
  let top3 = 0;
  let mrr = 0;
  for (const s of test) {
    const scores = scoreOf(s);
    const rank = 1 + scores.slice(1).filter((x) => x > scores[0]).length;
    if (rank === 1) top1++;
    if (rank <= 3) top3++;
    mrr += 1 / rank;
  }
  return { top1: +(top1 / test.length).toFixed(3), top3: +(top3 / test.length).toFixed(3), mrr: +(mrr / test.length).toFixed(3) };
};
const metrics = {
  model: evaluate((s) => s.feats.map((f) => dot(w, f))),
  coverageBaseline: evaluate((s) => s.baseline),
  testSessions: test.length,
  candidatesPerSession: NEGATIVES + 1,
};
console.log('held-out metrics', metrics);

const neighbours = (name: string) =>
  vocab
    .filter((v) => v !== name)
    .map((v) => [v, sim(name, v)] as const)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([v, s]) => `${v} ${s.toFixed(2)}`);
for (const probe of ['spinach', 'paneer', 'chicken thigh', 'soy sauce', 'rice']) console.log(probe, '->', neighbours(probe).join(', '));

const round = (x: number) => Math.round(x * 1e4) / 1e4;
const model = {
  version: 1,
  trainedAt: new Date().toISOString().slice(0, 10),
  seed: SEED,
  recipes: recipes.length,
  dim: DIM,
  vocab,
  embeddings: embeddings.map((e) => e.map(round)),
  featureNames: FEATURE_NAMES,
  weights: Array.from(w, round),
  metrics,
  cuisineModel: {
    alpha: ALPHA,
    cuisines: cuisineList,
    docCount,
    // Sparse ingredient counts per cuisine: [vocabIndex, count] pairs
    counts: counts.map((m) => [...m.entries()].sort((a, b) => a[0] - b[0])),
    metrics: cuisineMetrics,
  },
};

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/ml/model.json');
writeFileSync(out, JSON.stringify(model) + '\n');
console.log(`wrote ${path.relative(process.cwd(), out)} (${vocab.length} ingredients, ${recipes.length} recipes)`);
