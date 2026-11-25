/**
 * Shared building blocks for the Indian dish families: the vegetables and proteins they are made
 * with, and a helper that turns one dish into a corpus row with diet labels worked out from its
 * ingredients. Families are the way Indian home cooking is actually organised: a poriyal, thoran,
 * palya or ki sabzi is a method that every household applies to many vegetables.
 */
import { DF, GF, HP, KETO, LC, NF, Row, VEG, VG } from '../schema';

export interface Veg {
  key: string;
  en: string; // English name as used in dish titles
  hi: string; // Hindi
  ta: string; // Tamil
  te: string; // Telugu
  ing: string[]; // canonical ingredient names
  prep: string; // how to cut it
  emoji: string;
  firm?: boolean; // needs boiling or a longer cook first
  kcal?: number; // extra per serving over the family base
  carbs?: number;
}

export const VEG_LIST: Veg[] = [
  { key: 'potato', en: 'Potato', hi: 'Aloo', ta: 'Urulai', te: 'Bangaladumpa', ing: ['potato'], prep: 'peel and cube the potato', emoji: '🥔', firm: true, kcal: 60, carbs: 14 },
  { key: 'cabbage', en: 'Cabbage', hi: 'Patta Gobhi', ta: 'Muttaikose', te: 'Cabbage', ing: ['cabbage'], prep: 'shred the cabbage finely', emoji: '🥬' },
  { key: 'cauliflower', en: 'Cauliflower', hi: 'Gobi', ta: 'Cauliflower', te: 'Cauliflower', ing: ['cauliflower'], prep: 'cut the cauliflower into small florets', emoji: '🥦' },
  { key: 'carrot', en: 'Carrot', hi: 'Gajar', ta: 'Carrot', te: 'Carrot', ing: ['carrot'], prep: 'dice the carrot small', emoji: '🥕', carbs: 4 },
  { key: 'beetroot', en: 'Beetroot', hi: 'Chukandar', ta: 'Beetroot', te: 'Beetroot', ing: ['beetroot'], prep: 'peel and dice the beetroot small', emoji: '🟣', carbs: 5 },
  { key: 'beans', en: 'Beans', hi: 'Beans', ta: 'Beans', te: 'Beans', ing: ['green beans'], prep: 'string and chop the beans finely', emoji: '🫛' },
  { key: 'peas', en: 'Peas', hi: 'Matar', ta: 'Pattani', te: 'Batani', ing: ['peas'], prep: 'shell the peas', emoji: '🟢', kcal: 30, carbs: 6 },
  { key: 'okra', en: 'Okra', hi: 'Bhindi', ta: 'Vendakkai', te: 'Bendakaya', ing: ['okra'], prep: 'wipe the okra dry and cut into rounds', emoji: '🫛' },
  { key: 'eggplant', en: 'Brinjal', hi: 'Baingan', ta: 'Kathirikai', te: 'Vankaya', ing: ['eggplant'], prep: 'cut the brinjal into pieces and keep in salted water', emoji: '🍆' },
  { key: 'pumpkin', en: 'Pumpkin', hi: 'Kaddu', ta: 'Parangikai', te: 'Gummadikaya', ing: ['pumpkin'], prep: 'peel and cube the pumpkin', emoji: '🎃', carbs: 5 },
  { key: 'bottle-gourd', en: 'Bottle Gourd', hi: 'Lauki', ta: 'Suraikai', te: 'Sorakaya', ing: ['bottle gourd'], prep: 'peel and dice the bottle gourd', emoji: '🥒' },
  { key: 'bitter-gourd', en: 'Bitter Gourd', hi: 'Karela', ta: 'Pavakkai', te: 'Kakarakaya', ing: ['bitter gourd'], prep: 'slice the bitter gourd thin, rub with salt and squeeze after ten minutes', emoji: '🥒' },
  { key: 'drumstick', en: 'Drumstick', hi: 'Sahjan', ta: 'Murungakkai', te: 'Munakkaya', ing: ['drumstick'], prep: 'cut the drumsticks into finger-length pieces', emoji: '🥢', firm: true },
  { key: 'raw-banana', en: 'Raw Banana', hi: 'Kacche Kele', ta: 'Vazhakkai', te: 'Aratikaya', ing: ['raw banana'], prep: 'peel and dice the raw banana into water', emoji: '🍌', firm: true, kcal: 50, carbs: 12 },
  { key: 'colocasia', en: 'Colocasia', hi: 'Arbi', ta: 'Seppankizhangu', te: 'Chamadumpa', ing: ['colocasia'], prep: 'boil, peel and slice the colocasia', emoji: '🥔', firm: true, kcal: 50, carbs: 12 },
  { key: 'jackfruit', en: 'Raw Jackfruit', hi: 'Kathal', ta: 'Pala Pinju', te: 'Panasa', ing: ['jackfruit'], prep: 'oil your hands, then cut the raw jackfruit into cubes', emoji: '🍈', firm: true, kcal: 40, carbs: 10 },
  { key: 'radish', en: 'Radish', hi: 'Mooli', ta: 'Mullangi', te: 'Mullangi', ing: ['radish'], prep: 'peel and slice the radish', emoji: '⚪' },
  { key: 'spinach', en: 'Spinach', hi: 'Palak', ta: 'Keerai', te: 'Palakura', ing: ['spinach'], prep: 'wash and chop the spinach', emoji: '🥬' },
  { key: 'cucumber', en: 'Cucumber', hi: 'Kheera', ta: 'Vellarikkai', te: 'Dosakaya', ing: ['cucumber'], prep: 'peel and dice the cucumber', emoji: '🥒' },
  { key: 'sweet-potato', en: 'Sweet Potato', hi: 'Shakarkandi', ta: 'Sakkaraivalli', te: 'Chilagada', ing: ['sweet potato'], prep: 'peel and cube the sweet potato', emoji: '🍠', firm: true, kcal: 60, carbs: 14 },
  { key: 'mushroom', en: 'Mushroom', hi: 'Mushroom', ta: 'Kaalan', te: 'Puttagodugu', ing: ['mushrooms'], prep: 'wipe and slice the mushrooms', emoji: '🍄' },
  { key: 'capsicum', en: 'Capsicum', hi: 'Shimla Mirch', ta: 'Kudaimilagai', te: 'Capsicum', ing: ['bell pepper'], prep: 'cut the capsicum into squares', emoji: '🫑' },
  { key: 'tomato', en: 'Tomato', hi: 'Tamatar', ta: 'Thakkali', te: 'Tomato', ing: ['tomato'], prep: 'chop the tomatoes', emoji: '🍅' },
  { key: 'corn', en: 'Corn', hi: 'Makai', ta: 'Cholam', te: 'Mokkajonna', ing: ['corn'], prep: 'strip the corn kernels off the cob', emoji: '🌽', kcal: 40, carbs: 10 },
  { key: 'methi', en: 'Fenugreek Leaves', hi: 'Methi', ta: 'Vendhaya Keerai', te: 'Menthi Kura', ing: ['fenugreek leaves'], prep: 'pick and chop the fenugreek leaves', emoji: '🌿' },
  { key: 'turnip', en: 'Turnip', hi: 'Shalgam', ta: 'Turnip', te: 'Turnip', ing: ['turnip'], prep: 'peel and cube the turnip', emoji: '⚪' },
];

export const veg = (key: string) => {
  const v = VEG_LIST.find((x) => x.key === key);
  if (!v) throw new Error(`unknown vegetable ${key}`);
  return v;
};
export const vegs = (keys: string) => keys.split(' ').map(veg);

export interface Protein {
  key: string;
  en: string;
  hi: string;
  te: string;
  ta: string;
  ing: string[];
  emoji: string;
  veg: boolean;
  protein: number;
  fat: number;
  kcal: number;
  cookMin: number;
  prep: string;
}

export const PROTEINS: Protein[] = [
  { key: 'chicken', en: 'Chicken', hi: 'Murgh', te: 'Kodi', ta: 'Kozhi', ing: ['chicken'], emoji: '🍗', veg: false, protein: 30, fat: 16, kcal: 220, cookMin: 30, prep: 'cut the chicken into curry pieces' },
  { key: 'mutton', en: 'Mutton', hi: 'Gosht', te: 'Mamsam', ta: 'Aattu Kari', ing: ['lamb'], emoji: '🍖', veg: false, protein: 30, fat: 22, kcal: 280, cookMin: 60, prep: 'cut the mutton into small pieces' },
  { key: 'fish', en: 'Fish', hi: 'Machhi', te: 'Chepa', ta: 'Meen', ing: ['white fish'], emoji: '🐟', veg: false, protein: 26, fat: 10, kcal: 170, cookMin: 15, prep: 'clean the fish and cut into thick slices' },
  { key: 'prawn', en: 'Prawn', hi: 'Jhinga', te: 'Royyala', ta: 'Eral', ing: ['shrimp'], emoji: '🍤', veg: false, protein: 24, fat: 8, kcal: 150, cookMin: 12, prep: 'peel and devein the prawns' },
  { key: 'egg', en: 'Egg', hi: 'Anda', te: 'Guddu', ta: 'Muttai', ing: ['egg'], emoji: '🥚', veg: true, protein: 14, fat: 12, kcal: 160, cookMin: 15, prep: 'boil, peel and halve the eggs' },
  { key: 'paneer', en: 'Paneer', hi: 'Paneer', te: 'Paneer', ta: 'Paneer', ing: ['paneer'], emoji: '🧀', veg: true, protein: 18, fat: 22, kcal: 260, cookMin: 10, prep: 'cut the paneer into cubes and soak in warm water' },
  { key: 'mushroom', en: 'Mushroom', hi: 'Khumb', te: 'Puttagodugu', ta: 'Kaalan', ing: ['mushrooms'], emoji: '🍄', veg: true, protein: 5, fat: 8, kcal: 90, cookMin: 12, prep: 'wipe and slice the mushrooms' },
  { key: 'crab', en: 'Crab', hi: 'Kekda', te: 'Peetha', ta: 'Nandu', ing: ['crab'], emoji: '🦀', veg: false, protein: 20, fat: 8, kcal: 140, cookMin: 25, prep: 'clean the crab and crack the claws' },
];
export const protein = (key: string) => {
  const p = PROTEINS.find((x) => x.key === key);
  if (!p) throw new Error(`unknown protein ${key}`);
  return p;
};

// ---------- Diet labels from ingredients ----------

const MEAT = ['chicken breast', 'chicken thigh', 'chicken', 'turkey', 'ground beef', 'beef steak', 'lamb', 'pork', 'bacon', 'sausage', 'ham', 'duck'];
const SEAFOOD = ['salmon', 'white fish', 'tuna', 'shrimp', 'mackerel', 'anchovies', 'crab', 'mussels', 'fish sauce', 'oyster sauce', 'shrimp paste'];
const DAIRY = ['milk', 'heavy cream', 'butter', 'ghee', 'yogurt', 'sour cream', 'cheddar', 'parmesan', 'mozzarella', 'feta', 'paneer', 'cream cheese', 'khoya', 'condensed milk', 'buttermilk'];
const GLUTEN = ['flour', 'pasta', 'noodles', 'bread', 'tortillas', 'flatbread', 'panko', 'semolina', 'vermicelli', 'couscous', 'barley', 'puff pastry', 'soy sauce'];
const NUTS = ['cashews', 'peanuts', 'almonds', 'peanut butter'];

export const dietTags = (ingredients: string[], [protein, carbs, fat]: [number, number, number]) => {
  const has = (list: string[]) => ingredients.some((i) => list.includes(i));
  const tags: string[] = [];
  const vegetarian = !has(MEAT) && !has(SEAFOOD);
  if (vegetarian) tags.push(VEG);
  if (vegetarian && !has(DAIRY) && !ingredients.includes('egg') && !ingredients.includes('honey')) tags.push(VG);
  if (!has(GLUTEN)) tags.push(GF);
  if (!has(DAIRY)) tags.push(DF);
  if (!has(NUTS)) tags.push(NF);
  if (protein >= 20) tags.push(HP);
  if (carbs <= 15) tags.push(LC);
  if (carbs <= 10 && fat >= 15) tags.push(KETO);
  return tags;
};

// ---------- Building a row ----------

export interface Dish {
  title: string;
  cuisine: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  prep: number;
  cook: number;
  kcal: number;
  servings?: number;
  macros: [number, number, number];
  emoji: string;
  ingredients: string[];
  steps: string[];
  tip: string;
}

const unique = (list: string[]) => [...new Set(list)];

export const row = (d: Dish): Row => {
  const ingredients = unique(d.ingredients);
  return [
    d.title,
    d.cuisine,
    d.description,
    dietTags(ingredients, d.macros),
    d.difficulty || (d.prep + d.cook > 60 ? 'Medium' : 'Easy'),
    d.prep,
    d.cook,
    Math.round(d.kcal),
    d.servings || 4,
    d.macros,
    d.emoji,
    ingredients,
    d.steps,
    d.tip,
  ];
};

/** Capitalise the first letter of a step. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Boil-first instruction for firm vegetables. */
export const softenFirst = (v: Veg) => (v.firm ? ` Par-boil the ${v.en.toLowerCase()} until just tender first.@480` : '');
