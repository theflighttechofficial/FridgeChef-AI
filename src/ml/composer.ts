/**
 * Recipe composer: builds a cookable recipe from whatever is in the pantry, for ingredient
 * combinations no recipe in the corpus covers.
 *
 *   1. The trained naive Bayes cuisine model (model.json → cuisineModel) predicts which cuisine the
 *      pantry leans towards, unless the person picked one in the filters.
 *   2. A technique is chosen from what is on hand (noodles, rice, eggs, a protein, or vegetables).
 *   3. That cuisine family's flavour base (aromatics, spices, sauces) and step template turn the
 *      pantry items into a recipe. Base items the pantry lacks become the shopping list.
 */
import { Recipe } from '../types';
import model from './model.json';
import { BY_NAME } from './normalize';
import { REGION_OF } from './data/schema';

type Family = 'indian' | 'eastAsian' | 'southeastAsian' | 'middleEastern' | 'african' | 'mediterranean' | 'european' | 'latin' | 'american';

const FAMILY_OF_REGION: Record<string, Family> = {
  Indian: 'indian',
  'South Asian': 'indian',
  'East Asian': 'eastAsian',
  'Southeast Asian': 'southeastAsian',
  'Middle Eastern': 'middleEastern',
  African: 'african',
  European: 'european',
  Americas: 'latin',
  Oceania: 'american',
  Fusion: 'american',
};
const FAMILY_OVERRIDES: Record<string, Family> = {
  Italian: 'mediterranean', Greek: 'mediterranean', Mediterranean: 'mediterranean', Spanish: 'mediterranean', Portuguese: 'mediterranean', French: 'mediterranean',
  Moroccan: 'middleEastern', Egyptian: 'middleEastern', Tunisian: 'middleEastern',
  American: 'american', 'Southern & Cajun': 'american', Canadian: 'american',
};
const familyOf = (cuisine: string): Family => FAMILY_OVERRIDES[cuisine] || FAMILY_OF_REGION[REGION_OF[cuisine]] || 'american';

type Technique = 'noodles' | 'rice' | 'eggs' | 'main' | 'veg';

interface FamilyStyle {
  base: string[]; // flavour base, most important first
  dish: Record<Technique, string>;
  steps: Record<Technique, (main: string, veg: string, base: string) => string[]>;
}

const STYLES: Record<Family, FamilyStyle> = {
  indian: {
    base: ['onion', 'ginger garlic paste', 'tomato', 'cumin', 'turmeric', 'garam masala', 'chili powder', 'cilantro'],
    dish: { noodles: 'Masala Noodles', rice: 'Pulao', eggs: 'Egg Bhurji', main: 'Curry', veg: 'Sabzi' },
    steps: {
      noodles: (m, v, b) => [`Boil the noodles and drain.@300`, `Crackle cumin in oil, add ${b} and cook until soft.@300`, `Add ${v}${m ? ` and ${m}` : ''} with turmeric and garam masala; stir-fry.@300`, 'Toss in the noodles and finish with cilantro.@120'],
      rice: (m, v, b) => [`Rinse and soak the rice.@900`, `Fry whole spices and ${b} in ghee or oil.@300`, `Add ${[m, v].filter(Boolean).join(' and ')} and the spices; sauté.@300`, 'Add rice and water (1:1.75), cover and cook, then rest.@1200'],
      eggs: (_, v, b) => [`Soften ${b} in butter or oil.@240`, `Add ${v || 'tomato'} with turmeric and chili.@180`, 'Scramble in the eggs slowly; finish with cilantro.@180'],
      main: (m, v, b) => [`Cook ${b} until golden.@480`, 'Add turmeric, chili powder and garam masala; cook until the oil separates.@300', `Add ${m}${v ? ` and ${v}` : ''} with a splash of water; simmer until cooked.@1200`, 'Finish with cilantro and a squeeze of lemon.'],
      veg: (_, v, b) => [`Crackle cumin in oil and add ${b}.@240`, `Add ${v} with turmeric and chili; cover and cook.@900`, 'Uncover, sprinkle garam masala and toss until dry.@180'],
    },
  },
  eastAsian: {
    base: ['garlic', 'ginger', 'soy sauce', 'spring onion', 'sesame oil', 'rice vinegar', 'cornstarch'],
    dish: { noodles: 'Stir-Fried Noodles', rice: 'Fried Rice', eggs: 'Egg Stir-Fry', main: 'Stir-Fry', veg: 'Garlic Stir-Fry' },
    steps: {
      noodles: (m, v) => ['Cook the noodles, rinse and toss with a little oil.@300', `Stir-fry ${m ? `${m}, then ` : ''}garlic and ginger in a very hot wok.@240`, `Add ${v} and toss.@120`, 'Add noodles, soy sauce and sesame oil; finish with spring onion.@120'],
      rice: (m, v) => [`Stir-fry ${m || 'egg'} and set aside.@180`, `Fry garlic and ${v} in a hot wok.@180`, 'Add cold cooked rice and toss until it hops.@240', 'Return the rest; season with soy, sesame oil and spring onion.@60'],
      eggs: (_, v) => ['Scramble eggs softly and set aside.@60', `Stir-fry garlic and ${v || 'tomato'}.@180`, 'Season with soy and a pinch of sugar; fold the eggs back in.@60'],
      main: (m, v) => [`Toss ${m} with soy sauce and cornstarch.@600`, `Sear in a smoking wok; add garlic, ginger and ${v}.@300`, 'Add soy, rice vinegar and a splash of water; toss until glossy.@120', 'Finish with sesame oil and spring onion; serve with rice.'],
      veg: (_, v) => ['Fry garlic and ginger until fragrant.@30', `Add ${v} and a splash of water; cover briefly.@180`, 'Toss with soy sauce and sesame oil.@60'],
    },
  },
  southeastAsian: {
    base: ['garlic', 'green chili', 'fish sauce', 'lime', 'coconut milk', 'lemongrass', 'basil'],
    dish: { noodles: 'Street-Style Noodles', rice: 'Fried Rice', eggs: 'Chili Omelette', main: 'Coconut Curry', veg: 'Coconut Vegetables' },
    steps: {
      noodles: (m, v) => ['Soak or cook the noodles.@300', `Stir-fry garlic, chili${m ? ` and ${m}` : ''}.@240`, `Add ${v}, noodles, fish sauce and a little sugar.@180`, 'Finish with lime and herbs.'],
      rice: (m, v) => [`Fry garlic and chili, add ${m || 'egg'}.@240`, `Add ${v} and cold rice.@240`, 'Season with fish sauce and a pinch of sugar; serve with lime and cucumber.'],
      eggs: (_, v) => [`Beat eggs with fish sauce, chili and ${v || 'spring onion'}.`, 'Fry in hot oil until puffed and crisp at the edges.@180', 'Serve over rice with lime.'],
      main: (m, v) => ['Fry garlic, chili and lemongrass (or curry paste) in thick coconut cream.@180', `Add ${m} and cook.@300`, `Add coconut milk and ${v}; simmer.@600`, 'Season with fish sauce, lime and basil; serve with rice.'],
      veg: (_, v) => ['Fry garlic and chili.@60', `Add ${v} and a splash of coconut milk; simmer.@480`, 'Finish with lime and herbs.'],
    },
  },
  middleEastern: {
    base: ['onion', 'garlic', 'olive oil', 'cumin', 'lemon', 'parsley', 'paprika', 'yogurt'],
    dish: { noodles: 'Spiced Noodles', rice: 'Pilaf', eggs: 'Shakshuka', main: 'Spiced Tray Bake', veg: 'Roasted Vegetables with Garlic Yogurt' },
    steps: {
      noodles: (m, v, b) => [`Toast broken noodles in oil until golden.@180`, `Add ${b}${m ? `, ${m}` : ''} and ${v}.@300`, 'Add water or stock, cover and cook; finish with parsley.@600'],
      rice: (m, v, b) => [`Soften ${b} in olive oil with cumin.@300`, `Add ${[m, v].filter(Boolean).join(' and ')}.@300`, 'Stir in rice and stock; cover and cook, then fluff with parsley.@1200'],
      eggs: (_, v, b) => [`Cook ${b} with paprika and cumin.@300`, `Add ${v || 'tomato'} and simmer into a sauce.@600`, 'Crack in the eggs, cover until just set; finish with parsley.@360'],
      main: (m, v, b) => [`Coat ${m} with olive oil, garlic, cumin, paprika and lemon.@900`, `Spread on a tray with ${v || 'onion'}.`, 'Roast at 210°C until charred.@1800', 'Serve with garlic yogurt and parsley.'],
      veg: (_, v) => [`Toss ${v} with olive oil, cumin and paprika.`, 'Roast at 220°C until caramelised.@1500', 'Spoon over garlic-lemon yogurt and scatter parsley.'],
    },
  },
  african: {
    base: ['onion', 'garlic', 'ginger', 'tomato', 'ras el hanout', 'harissa', 'peanut butter'],
    dish: { noodles: 'Spiced Noodles', rice: 'Jollof-Style Rice', eggs: 'Spiced Eggs', main: 'Stew', veg: 'Vegetable Stew' },
    steps: {
      noodles: (m, v) => [`Cook the noodles.@300`, `Fry onion, garlic and ${m || v}.@300`, 'Add tomato and spice; toss with the noodles.@240'],
      rice: (m, v) => ['Blend tomato, onion and chili; fry down until thick.@900', `Add ${[m, v].filter(Boolean).join(' and ')} and the spices.@300`, 'Add rice and stock; cover tightly and steam.@1500'],
      eggs: (_, v) => [`Fry onion and ${v || 'tomato'} with spice.@480`, 'Add eggs and stir until just set.@180'],
      main: (m, v) => [`Brown ${m} with onion, garlic and ginger.@600`, 'Add tomato and spice blend; cook down.@480', `Add ${v} and water (and a spoon of peanut butter); simmer.@1500`],
      veg: (_, v) => ['Fry onion, garlic and ginger.@300', `Add ${v}, tomato and spice; simmer until tender.@1200`],
    },
  },
  mediterranean: {
    base: ['garlic', 'olive oil', 'onion', 'canned tomatoes', 'basil', 'parmesan', 'lemon'],
    dish: { noodles: 'Pasta', rice: 'Risotto', eggs: 'Frittata', main: 'Skillet', veg: 'Roasted Vegetables' },
    steps: {
      noodles: (m, v) => ['Cook the pasta in well-salted water; save a cup of the water.@540', `Sauté garlic in olive oil with ${[m, v].filter(Boolean).join(' and ')}.@420`, 'Toss pasta with the pan, a splash of pasta water, basil and parmesan.@60'],
      rice: (m, v) => [`Soften onion and garlic in olive oil; add ${[m, v].filter(Boolean).join(' and ')}.@360`, 'Toast the rice, then add hot stock a ladle at a time, stirring.@1200', 'Finish with butter and parmesan.'],
      eggs: (_, v) => [`Sauté ${v || 'onion'} in an oven-safe pan.@360`, 'Pour over beaten eggs with parmesan; cook until the edges set.@240', 'Finish under the grill until puffed.@300'],
      main: (m, v) => [`Season ${m} and sear in olive oil.@480`, `Add garlic, ${v || 'onion'} and tomatoes; simmer.@900`, 'Finish with basil, lemon and parmesan.'],
      veg: (_, v) => [`Toss ${v} with olive oil, garlic and salt.`, 'Roast at 220°C.@1500', 'Finish with lemon, basil and parmesan.'],
    },
  },
  european: {
    base: ['onion', 'butter', 'garlic', 'stock', 'rosemary', 'black pepper', 'sour cream'],
    dish: { noodles: 'Buttered Noodles', rice: 'Baked Rice', eggs: 'Omelette', main: 'Braise', veg: 'Vegetable Gratin' },
    steps: {
      noodles: (m, v) => ['Cook the noodles.@480', `Cook onion and ${[m, v].filter(Boolean).join(' and ')} in butter.@480`, 'Toss with the noodles, a spoon of sour cream and black pepper.'],
      rice: (m, v) => [`Soften onion in butter; add ${[m, v].filter(Boolean).join(' and ')}.@360`, 'Add rice and stock; bake covered at 180°C.@1500', 'Fluff with butter and herbs.'],
      eggs: (_, v) => ['Whisk eggs well.', 'Cook in foaming butter, stirring, until just set.@90', `Fill with ${v || 'herbs'} and fold.@30`],
      main: (m, v) => [`Brown ${m} in butter.@600`, `Add onion, garlic, ${v || 'carrot'}, herbs and stock.`, 'Cover and braise low until tender.@3000', 'Stir in sour cream or butter to finish.'],
      veg: (_, v) => [`Layer ${v} in a buttered dish.`, 'Pour over seasoned cream or stock; top with cheese if you have it.', 'Bake until bubbling.@2400'],
    },
  },
  latin: {
    base: ['onion', 'garlic', 'cumin', 'chili powder', 'lime', 'cilantro', 'canned tomatoes', 'tortillas'],
    dish: { noodles: 'Sopa Seca', rice: 'Rice Bowl', eggs: 'Huevos a la Mexicana', main: 'Tacos', veg: 'Vegetable Tacos' },
    steps: {
      noodles: (m, v) => ['Toast short noodles in oil until golden.@180', `Add blended tomato, onion and garlic${m ? ` with ${m}` : ''}.@300`, `Add ${v}, stock and cumin; cook until absorbed.@600`],
      rice: (m, v) => ['Toast rice in oil.@300', `Add tomato, onion, garlic and ${[m, v].filter(Boolean).join(' and ')}.@300`, 'Add stock; cover and cook. Serve with lime and cilantro.@1200'],
      eggs: (_, v) => [`Sauté onion, chili and ${v || 'tomato'}.@300`, 'Scramble in the eggs.@180', 'Serve with warm tortillas and salsa.'],
      main: (m, v) => [`Season ${m} with cumin, chili, garlic and lime.@900`, `Sear until charred; cook ${v || 'onion'} alongside.@600`, 'Slice and pile into warm tortillas with cilantro and lime.'],
      veg: (_, v) => [`Char ${v} in a hot pan with cumin and chili.@480`, 'Warm the tortillas.', 'Fill and finish with lime, cilantro and salsa.'],
    },
  },
  american: {
    base: ['onion', 'garlic', 'butter', 'paprika', 'black pepper', 'cheddar', 'bbq sauce'],
    dish: { noodles: 'Skillet Noodles', rice: 'Rice Skillet', eggs: 'Scramble', main: 'Sheet-Pan Dinner', veg: 'Roasted Vegetable Bowl' },
    steps: {
      noodles: (m, v) => ['Cook the noodles.@480', `Brown ${[m, v].filter(Boolean).join(' and ')} with onion and garlic.@480`, 'Toss with butter, cheese and pepper.'],
      rice: (m, v) => [`Brown ${[m, v].filter(Boolean).join(' and ')} with onion and paprika.@600`, 'Stir in cooked rice and heat through.@300', 'Top with cheese and let it melt.'],
      eggs: (_, v) => [`Cook ${v || 'onion'} in butter.@300`, 'Add eggs and scramble gently.@180', 'Fold in cheddar.'],
      main: (m, v) => [`Toss ${m} and ${v || 'potato'} with oil, paprika, garlic and pepper.`, 'Roast at 220°C.@1800', 'Brush with BBQ sauce for the last few minutes.@300'],
      veg: (_, v) => [`Toss ${v} with oil, paprika and garlic.`, 'Roast at 220°C until crisp.@1500', 'Top with cheese and serve.'],
    },
  },
};

const PROTEIN_GROUPS = new Set(['poultry', 'red meat', 'pork', 'fish', 'shellfish', 'soy protein', 'pulse', 'soft cheese']);
const MEAT_GROUPS = new Set(['poultry', 'red meat', 'pork', 'fish', 'shellfish']);
const DAIRY_GROUPS = new Set(['milk', 'cream', 'cultured dairy', 'hard cheese', 'soft cheese']);
const DAIRY_NAMES = new Set(['butter', 'ghee', 'paneer', 'khoya']);
const GLUTEN_GROUPS = new Set(['bread', 'pasta']);
const GLUTEN_NAMES = new Set(['flour', 'soy sauce', 'semolina', 'couscous', 'barley', 'panko', 'noodles', 'oyster sauce', 'worcestershire sauce']);
const VEG_GROUPS = new Set(['leafy green', 'salad leaf', 'brassica', 'allium', 'root', 'starchy root', 'tomato', 'sweet pepper', 'fresh veg', 'squash', 'nightshade', 'mushroom', 'sweet veg', 'sea veg']);
const EMOJI: Record<Technique, string> = { noodles: '🍜', rice: '🍚', eggs: '🍳', main: '🍲', veg: '🥗' };
const TIME: Record<Technique, [number, number]> = { noodles: [10, 15], rice: [15, 25], eggs: [5, 10], main: [15, 35], veg: [10, 25] };

// ---------- Cuisine classifier (trained naive Bayes) ----------
const cm = model.cuisineModel;
const vocabIndex = new Map<string, number>(model.vocab.map((n: string, i: number) => [n, i]));
const totals = cm.counts.map((pairs: number[][]) => pairs.reduce((s, [, n]) => s + n, 0));
const countMaps = cm.counts.map((pairs: number[][]) => new Map(pairs.map(([i, n]) => [i, n] as [number, number])));
const docTotal = cm.docCount.reduce((s: number, n: number) => s + n, 0);

/** Cuisines ranked by how well they explain these ingredients. */
export const predictCuisines = (ingredients: string[]) => {
  const known = ingredients.map((i) => vocabIndex.get(i)).filter((i): i is number => i !== undefined);
  const scores = (cm.cuisines as string[]).map((cuisine, c) => {
    let score = Math.log(cm.docCount[c] / docTotal);
    for (const i of known) score += Math.log(((countMaps[c].get(i) || 0) + cm.alpha) / (totals[c] + cm.alpha * model.vocab.length));
    return { cuisine, score };
  });
  const max = Math.max(...scores.map((s) => s.score));
  const z = scores.reduce((s, x) => s + Math.exp(x.score - max), 0);
  return scores.map((s) => ({ cuisine: s.cuisine, probability: Math.exp(s.score - max) / z })).sort((a, b) => b.probability - a.probability);
};

/** Probability of each region (Indian, East Asian, ...) for these ingredients. */
export const predictRegions = (ingredients: string[]) => {
  const out: Record<string, number> = {};
  for (const { cuisine, probability } of predictCuisines(ingredients)) out[REGION_OF[cuisine]] = (out[REGION_OF[cuisine]] || 0) + probability;
  return out;
};

// ---------- Composer ----------
const title = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const list = (items: string[]) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);
const groupOf = (name: string) => BY_NAME.get(name)?.group || '';

const pickTechniques = (pantry: string[]): Technique[] => {
  const groups = new Set(pantry.map(groupOf));
  const out: Technique[] = [];
  if (pantry.some((p) => PROTEIN_GROUPS.has(groupOf(p)) || p === 'paneer')) out.push('main');
  if (groups.has('noodle') || groups.has('pasta')) out.push('noodles');
  if (pantry.includes('rice') || groups.has('grain')) out.push('rice');
  if (pantry.includes('egg')) out.push('eggs');
  if (pantry.some((p) => VEG_GROUPS.has(groupOf(p)))) out.push('veg');
  return out;
};

const dietAllows = (name: string, dietary: string[]) => {
  const g = groupOf(name);
  const vegan = dietary.includes('Vegan');
  if ((vegan || dietary.includes('Vegetarian')) && MEAT_GROUPS.has(g)) return false;
  if (vegan && (name === 'egg' || name === 'honey' || DAIRY_GROUPS.has(g) || DAIRY_NAMES.has(name))) return false;
  if (dietary.includes('Dairy-Free') && (DAIRY_GROUPS.has(g) || DAIRY_NAMES.has(name))) return false;
  if (dietary.includes('Gluten-Free') && (GLUTEN_GROUPS.has(g) || GLUTEN_NAMES.has(name))) return false;
  return true;
};

const tagsFor = (items: string[]) => {
  const groups = items.map(groupOf);
  const meat = groups.some((g) => MEAT_GROUPS.has(g));
  const dairy = items.some((i) => DAIRY_GROUPS.has(groupOf(i)) || DAIRY_NAMES.has(i));
  const tags: string[] = [];
  if (!meat) tags.push('Vegetarian');
  if (!meat && !dairy && !items.includes('egg') && !items.includes('honey')) tags.push('Vegan');
  if (!items.some((i) => GLUTEN_GROUPS.has(groupOf(i)) || GLUTEN_NAMES.has(i))) tags.push('Gluten-Free');
  if (!dairy) tags.push('Dairy-Free');
  if (!groups.includes('nut')) tags.push('Nut-Free');
  return tags;
};

export interface ComposeOptions {
  dietary?: string[];
  cuisine?: string; // a cuisine or region from the filters, or 'All'
  limit?: number;
}

/**
 * Compose up to `limit` recipes from the pantry. `pantry` maps canonical names to the person's
 * own wording (from canonicalPantry).
 */
export const composeRecipes = (pantry: Map<string, string>, { dietary = [], cuisine, limit = 2 }: ComposeOptions = {}): Recipe[] => {
  const usable = [...pantry.keys()].filter((p) => !BY_NAME.get(p)?.staple && dietAllows(p, dietary));
  if (!usable.length) return [];

  // Respect a chosen cuisine or region; otherwise let the classifier pick
  const ranked = predictCuisines(usable).map((c) => c.cuisine);
  const wanted = cuisine && cuisine !== 'All' ? ranked.filter((c) => c === cuisine || REGION_OF[c] === cuisine) : ranked;
  const chosen = wanted[0] || ranked[0];
  const family = familyOf(chosen);
  const style = STYLES[family];

  const proteins = usable.filter((p) => PROTEIN_GROUPS.has(groupOf(p)));
  const vegs = usable.filter((p) => VEG_GROUPS.has(groupOf(p)) && !style.base.includes(p)).slice(0, 3);
  const name = (p: string) => pantry.get(p)!;

  return pickTechniques(usable)
    .slice(0, limit)
    .map((technique, k) => {
      const main = technique === 'main' ? proteins[0] : technique === 'eggs' ? 'egg' : proteins[0];
      const carb = technique === 'noodles' ? usable.find((p) => ['noodle', 'pasta'].includes(groupOf(p))) : technique === 'rice' ? usable.find((p) => p === 'rice' || groupOf(p) === 'grain') : undefined;
      const body = [main, carb, ...vegs].filter((x): x is string => !!x && dietAllows(x, dietary));
      const baseItems = style.base.filter((b) => dietAllows(b, dietary));
      const have = baseItems.filter((b) => pantry.has(b));
      const missing = baseItems.filter((b) => !pantry.has(b)).slice(0, 3);
      const all = [...new Set([...body, ...have])];

      const mainLabel = main && technique !== 'eggs' ? name(main) : '';
      const vegLabel = list(vegs.map(name)) || (technique === 'veg' ? list(usable.slice(0, 3).map(name)) : '');
      const baseLabel = list(have.slice(0, 3).map((b) => b)) || 'onion and garlic';
      const heading = [mainLabel, ...vegs.map(name)].filter(Boolean).slice(0, 2).join(' & ');
      const [prep, cook] = TIME[technique];
      const proteinCount = body.filter((b) => PROTEIN_GROUPS.has(groupOf(b)) || b === 'egg').length;

      return {
        id: `composed-${technique}-${[...pantry.keys()].sort().join('-').slice(0, 60)}-${k}`,
        title: `${chosen}-Style ${heading ? `${title(heading)} ` : ''}${style.dish[technique]}`,
        description: `Composed on this device from your ${list(body.slice(0, 4).map(name))}, with a ${chosen} flavour base.`,
        prepTimeMinutes: prep,
        cookTimeMinutes: cook,
        calories: 320 + proteinCount * 90 + (carb ? 140 : 0),
        difficulty: technique === 'rice' || technique === 'main' ? 'Medium' : 'Easy',
        dietaryTags: tagsFor(all),
        cuisine: chosen,
        region: REGION_OF[chosen],
        matchedIngredients: all.map(name),
        missingIngredients: missing.map(title),
        macros: { protein: `${12 + proteinCount * 14}g`, carbs: `${carb ? 55 : 18}g`, fat: `${14 + proteinCount * 4}g` },
        servings: 2,
        chefTip: missing.length
          ? `No ${list(missing)}? It still works; season to taste as you go.`
          : 'You have everything for this one. Taste and adjust salt at the end.',
        emoji: EMOJI[technique],
        source: 'local-model',
        steps: style.steps[technique](mainLabel, vegLabel || 'the vegetables', baseLabel).map((s, i) => {
          const m = /@(\d+)$/.exec(s);
          return { stepNumber: i + 1, instruction: m ? s.slice(0, m.index) : s, timerSeconds: m ? Number(m[1]) : undefined };
        }),
      } satisfies Recipe;
    });
};
