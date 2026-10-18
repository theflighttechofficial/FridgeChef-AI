import { test } from 'node:test';
import assert from 'node:assert/strict';

// The taste model reads localStorage at import time
const store = new Map<string, string>();
(globalThis as any).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) };

const { canonicalize } = await import('../src/ml/normalize');
const { recommend, similarity } = await import('../src/ml/recommender');
const { recordTaste, tasteScore, resetTaste } = await import('../src/ml/tasteModel');
const { predictCuisines } = await import('../src/ml/composer');
const { corpus } = await import('../src/ml/data/recipes');
const { REGIONS } = await import('../src/ml/data/schema');

const pantry = (...names: string[]) => names.map((name, i) => ({ id: String(i), name, category: 'Other' as const }));

test('canonicalize maps messy pantry names onto the vocabulary', () => {
  assert.deepEqual(canonicalize('Lean Ground Beef (90/10)'), ['ground beef']);
  assert.deepEqual(canonicalize('Paneer (Indian Cottage Cheese)'), ['paneer']);
  assert.deepEqual(canonicalize('Soy Sauce & Fish Sauce').sort(), ['fish sauce', 'soy sauce']);
  assert.deepEqual(canonicalize('Ginger-Garlic Paste').sort(), ['garlic', 'ginger', 'ginger garlic paste']);
  assert.deepEqual(canonicalize('Yellow Toor Dal / Lentils'), ['lentils']);
  assert.deepEqual(canonicalize('Fresh Herbs (Dill/Parsley)'), ['parsley']);
  assert.deepEqual(canonicalize('Mystery jar'), []);
});

test('learned embeddings place substitutes close together', () => {
  assert.ok(similarity('spinach', 'kale') > 0.85);
  assert.ok(similarity('chicken thigh', 'chicken breast') > 0.85);
  assert.ok(similarity('spinach', 'chocolate') < 0.5);
});

test('an Indian pantry gets Indian recipes first', () => {
  const recs = recommend(pantry('Paneer', 'Roma Tomatoes', 'Red Onions', 'Ginger-Garlic Paste', 'Ghee', 'Kasuri Methi', 'Greek Yogurt', 'Basmati Rice', 'Toor Dal'), { limit: 3 });
  assert.equal(recs.length, 3);
  assert.equal(recs[0].recipe.region, 'Indian');
  assert.ok(recs[0].recipe.matchedIngredients.length >= 3);
  assert.ok(recs.every((r) => r.recipe.source === 'local-model' && r.recipe.steps.length > 0));
});

test('dietary filters are hard constraints', () => {
  const recs = recommend(pantry('Chicken Breast', 'Bacon', 'Eggs', 'Spinach', 'Tofu'), { filters: { dietary: ['Vegan'] }, limit: 6 });
  assert.ok(recs.length > 0);
  assert.ok(recs.every((r) => r.recipe.dietaryTags.includes('Vegan')));
});

test('close substitutes are suggested instead of listed as missing', () => {
  const recs = recommend(pantry('Kale', 'Paneer', 'Onion', 'Garlic', 'Ginger', 'Green Chiles', 'Cream'), { limit: 6 });
  const palak = recs.find((r) => r.recipe.title === 'Palak Paneer');
  assert.ok(palak, 'Palak Paneer should be recommended');
  assert.ok(palak!.recipe.substitutions!.some((s) => s.missing === 'Spinach' && s.use === 'Kale'));
  assert.ok(!palak!.recipe.missingIngredients.includes('Spinach'));
});

test('taste model learns from feedback', () => {
  resetTaste();
  const thai = { cuisine: 'Thai Street Food', dietaryTags: ['Vegan'], matchedIngredients: ['Coconut Milk'], missingIngredients: [] };
  assert.equal(tasteScore(thai), 0);
  for (let i = 0; i < 5; i++) recordTaste(thai, 1);
  assert.ok(tasteScore(thai) > 0.3);
  const before = recommend(pantry('Rice', 'Eggs'), { limit: 6 }).filter((r) => r.recipe.cuisine === 'Thai Street Food').length;
  resetTaste();
  const after = recommend(pantry('Rice', 'Eggs'), { limit: 6 }).filter((r) => r.recipe.cuisine === 'Thai Street Food').length;
  assert.ok(before >= after);
});

test('corpus covers every listed cuisine and region', () => {
  const recipes = corpus();
  assert.ok(recipes.length >= 400);
  const cuisines = new Set(recipes.map((r) => r.cuisine));
  for (const [region, list] of Object.entries(REGIONS)) {
    for (const c of list) assert.ok(cuisines.has(c), `no recipe for ${c} (${region})`);
  }
});

test('regional pantries get regional recipes', () => {
  const top = (...names: string[]) => recommend(pantry(...names), { limit: 3 }).map((r) => r.recipe.cuisine);
  assert.ok(top('Hilsa', 'Mustard Oil', 'Mustard Seeds', 'Green Chillies', 'Potato', 'Rice').includes('Bengali'));
  assert.ok(top('Rice', 'Urad Dal', 'Fenugreek seeds', 'Coconut', 'Curry Leaves').some((c) => ['Tamil', 'Mangalorean', 'Kerala'].includes(c)));
  assert.ok(top('Chicken thighs', 'Red wine', 'Bacon', 'Mushrooms', 'Carrots', 'Onion').includes('French'));
  assert.ok(top('Corn tortillas', 'Black beans', 'Avocado', 'Lime', 'Cilantro').includes('Mexican'));
});

test('region filter keeps every pick in that region', () => {
  const recs = recommend(pantry('Chicken', 'Onion', 'Tomato', 'Rice'), { filters: { cuisine: 'Southeast Asian' }, limit: 6 });
  assert.ok(recs.length > 0);
  assert.ok(recs.every((r) => r.recipe.region === 'Southeast Asian'));
});

test('any ingredient mix gets a composed recipe that uses it', () => {
  const recs = recommend(pantry('Turnip', 'Mussels', 'Bitter gourd', 'Pomegranate'), { limit: 4 });
  const composed = recs.filter((r) => r.recipe.id.startsWith('composed-'));
  assert.ok(composed.length > 0);
  const first = composed[0].recipe;
  assert.ok(first.matchedIngredients.includes('Mussels'));
  assert.ok(first.steps.length >= 3 && first.steps.every((s) => s.instruction.trim()));
});

test('composed recipes respect dietary filters', () => {
  const recs = recommend(pantry('Chicken breast', 'Zucchini', 'Mushrooms', 'Pasta'), { filters: { dietary: ['Vegan'] }, limit: 6 });
  for (const r of recs) {
    assert.ok(r.recipe.dietaryTags.includes('Vegan'), r.recipe.title);
    assert.ok(!r.recipe.matchedIngredients.includes('Chicken breast'), r.recipe.title);
  }
});

test('cuisine classifier recognises flavour profiles', () => {
  assert.equal(predictCuisines(['soy sauce', 'ginger', 'spring onion', 'sesame oil', 'rice vinegar'])[0].cuisine.match(/Chinese|Cantonese|Sichuan|Japanese|Korean|Taiwanese/) !== null, true);
  const indian = predictCuisines(['garam masala', 'turmeric', 'cumin', 'ginger garlic paste', 'ghee'])[0].cuisine;
  assert.ok(Object.values(REGIONS.Indian).includes(indian) || REGIONS['South Asian'].includes(indian), indian);
});
