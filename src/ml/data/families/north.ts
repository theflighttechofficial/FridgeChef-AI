/**
 * North Indian dish families: dry sabzis (aloo X, X ki sabzi, bharwan), gravies (X masala,
 * do pyaza, kadai, handi, korma, makhani, lababdar, achari, saagwala, kali mirch, bhuna,
 * jalfrezi), koftas, dals, parathas and breads, pulao and biryani, kebabs and tikkas, raitas,
 * chaat, pakoras, halwa and kheer, lassi and sherbets, and Punjabi, Mughlai, Awadhi, Kashmiri,
 * Rajasthani and Bihari specials.
 */
import { Row } from '../schema';
import { PROTEINS, Protein, Veg, cap, protein as baseProtein, row, vegs } from './common';

// Mixed vegetables behave like a protein in the gravy families (Vegetable Jalfrezi, Kadai Vegetable...)
const MIX_VEG: Protein = { key: 'mixveg', en: 'Vegetable', hi: 'Sabzi', te: 'Kayagura', ta: 'Kaikari', ing: ['potato', 'carrot', 'green beans', 'peas', 'cauliflower'], emoji: '🥘', veg: true, protein: 6, fat: 6, kcal: 110, cookMin: 15, prep: 'cut the potato, carrot, beans and cauliflower into even pieces and shell the peas' };
const protein = (key: string) => (key === 'mixveg' ? MIX_VEG : baseProtein(key));
void PROTEINS;

type M = [number, number, number];
const dish = (title: string, cuisine: string, description: string, ingredients: string[], steps: string[], tip: string, emoji: string, kcal: number, macros: M, prep = 10, cook = 20, difficulty?: 'Easy' | 'Medium' | 'Hard'): Row =>
  row({ title, cuisine, description, ingredients: [...ingredients, 'salt'], steps, tip, emoji, kcal, macros, prep, cook, difficulty });

const firm = (v: Veg) => (v.firm ? `${cap(v.prep)}, then par-boil until just tender.@480` : `${cap(v.prep)}.`);

// ---------- Vegetable families ----------

const alooX = (v: Veg) =>
  dish(`Aloo ${v.hi}`, 'North Indian', `Homestyle dry potato and ${v.en.toLowerCase()} sabzi with cumin and turmeric.`,
    ['potato', ...v.ing, 'cumin', 'turmeric', 'chili powder', 'coriander powder', 'amchur', 'green chili', 'vegetable oil', 'cilantro'],
    [`Peel and cube the potato; ${v.prep}.`, 'Splutter cumin in oil, add green chili, the potato and turmeric and cook covered for five minutes.@300', `Add the ${v.en.toLowerCase()} and the spices and cook until both are tender, then add amchur and cilantro.@720`],
    'Cook covered on low heat so nothing burns.', v.emoji, 180 + (v.kcal || 0), [4, 26 + (v.carbs || 0), 8]);

const kiSabzi = (v: Veg) =>
  dish(`${v.hi} ki Sabzi`, 'North Indian', `Everyday North Indian ${v.en.toLowerCase()} sabzi with onion, tomato and ginger.`,
    [...v.ing, 'onion', 'tomato', 'ginger', 'cumin', 'turmeric', 'chili powder', 'coriander powder', 'garam masala', 'vegetable oil', 'cilantro'],
    [firm(v), 'Fry cumin, onion and ginger until soft, then add tomato and the spices and cook down.@480', `Add the ${v.en.toLowerCase()}, cover and cook until tender, then add garam masala and cilantro.@720`],
    'Eat with hot phulkas.', v.emoji, 150 + (v.kcal || 0), [4, 18 + (v.carbs || 0), 8]);

const masalaGravy = (v: Veg) =>
  dish(`${v.hi} Masala`, 'Punjabi', `${v.en} in a dhaba-style onion tomato masala.`,
    [...v.ing, 'onion', 'tomato', 'ginger garlic paste', 'cumin', 'turmeric', 'chili powder', 'coriander powder', 'garam masala', 'kasuri methi', 'vegetable oil'],
    [firm(v), 'Brown the onion with cumin, add ginger garlic paste, tomato and the spices and cook until the oil separates.@720', `Add the ${v.en.toLowerCase()} and a little water and simmer until tender. Finish with garam masala and kasuri methi.@720`],
    'Crush kasuri methi between your palms before adding.', v.emoji, 200 + (v.kcal || 0), [5, 20 + (v.carbs || 0), 11]);

const bharwan = (v: Veg) =>
  dish(`Bharwan ${v.hi}`, 'Punjabi', `${v.en} stuffed with a tangy spice mix and cooked slowly.`,
    [...v.ing, 'besan', 'amchur', 'fennel seeds', 'coriander powder', 'chili powder', 'turmeric', 'onion', 'vegetable oil'],
    [`${cap(v.prep)}, then slit for stuffing.`, 'Mix roasted besan with amchur, fennel, coriander, chili, turmeric and salt and fill the vegetable.', 'Cook covered in oil with onion on low heat, turning, until tender.@1200'],
    'Roast the besan until nutty before mixing.', v.emoji, 190, [5, 18, 11], 20, 25);

const bharta = (v: Veg) =>
  dish(`${v.hi} Bharta`, 'North Indian', `Mashed ${v.en.toLowerCase()} cooked with onion, garlic and green chili.`,
    [...v.ing, 'onion', 'garlic', 'tomato', 'green chili', 'cumin', 'mustard oil', 'cilantro'],
    [`${cap(v.prep)} and cook or roast until very soft, then mash.@900`, 'Fry cumin, garlic, onion and green chili in mustard oil, add tomato.@480', 'Add the mash and cook together, then add cilantro.@300'],
    'Raw mustard oil on top gives the Bihari touch.', v.emoji, 150, [3, 18, 8]);

const kofta = (name: string, ing: string[], desc: string, emoji: string, p = 6, kcal = 320) =>
  dish(`${name} Kofta`, 'Punjabi', desc,
    [...ing, 'besan', 'onion', 'tomato', 'cashews', 'heavy cream', 'ginger garlic paste', 'garam masala', 'chili powder', 'vegetable oil'],
    [`Mix the ${ing[0]} with besan and spices, shape balls and fry until golden.@480`, 'Cook onion, tomato, cashews and ginger garlic paste and blend into a smooth gravy.@720', 'Simmer with cream and garam masala and add the koftas just before serving.@300'],
    'Add koftas at the end so they stay whole.', emoji, kcal, [p, 22, 22], 25, 30, 'Medium');

const dal = (title: string, cuisine: string, desc: string, ing: string[], tadka: string, tip: string, emoji = '🥣') =>
  dish(title, cuisine, desc, [...ing, 'turmeric', 'cumin', 'ghee', 'cilantro'],
    [`Wash the ${ing[0]} and cook with turmeric until soft.@1500`, 'Mash lightly and simmer to the thickness you like.@300', cap(tadka)],
    tip, emoji, 240, [13, 32, 7], 10, 35);

const paratha = (name: string, desc: string, filling: string[], method: string, emoji = '🫓', p = 8, kcal = 300) =>
  dish(`${name} Paratha`, 'Punjabi', desc, ['flour', ...filling, 'ghee', 'yogurt'],
    ['Knead flour with water into a soft dough and rest.@900', cap(method), 'Roll gently and cook on a hot pan with ghee until golden on both sides. Serve with yogurt.@240'],
    'Rest the dough so it rolls without tearing.', emoji, kcal, [p, 42, 11], 20, 15);

const raita = (name: string, ing: string[], emoji: string) =>
  dish(`${name} Raita`, 'North Indian', `Cool yogurt raita with ${name.toLowerCase()}.`, ['yogurt', ...ing, 'cumin', 'chili powder', 'mint'],
    ['Whisk the yogurt smooth with salt.', `Stir in the ${name.toLowerCase()}.`, 'Finish with roasted cumin, a pinch of chili powder and mint.'],
    'Roast and crush the cumin fresh.', emoji, 110, [5, 10, 5], 10, 0);

const pakora = (name: string, ing: string[], emoji: string, p = 5) =>
  dish(`${name} Pakora`, 'Indian Street Food', `Crisp ${name.toLowerCase()} fritters in spiced gram flour batter.`, [...ing, 'besan', 'rice flour', 'chili powder', 'cumin', 'chaat masala', 'vegetable oil'],
    [`Prepare the ${name.toLowerCase()}.`, 'Whisk besan, rice flour, chili, cumin and salt with water into a thick batter.', 'Dip and deep-fry until golden. Sprinkle chaat masala.@300'],
    'A spoon of hot oil in the batter makes it crisper.', emoji, 240, [p, 24, 12], 10, 15);

const halwa = (name: string, ing: string[], desc: string, emoji: string) =>
  dish(`${name} Halwa`, 'Indian Sweets', desc, [...ing, 'sugar', 'ghee', 'cardamom', 'almonds'],
    [`Cook the ${ing[0]} in ghee, stirring, until it changes colour and smells cooked.@900`, `Add ${ing.slice(1).join(' and ') || 'the sugar'} and cook until thick.@900`, 'Add sugar and cardamom and stir until glossy. Top with almonds.@300'],
    'Keep stirring; halwa catches easily.', emoji, 340, [5, 46, 15], 10, 35);

const kheer = (name: string, ing: string[], emoji: string) =>
  dish(`${name} Kheer`, 'Indian Sweets', `Creamy ${name.toLowerCase()} kheer simmered in milk.`, [...ing, 'milk', 'sugar', 'cardamom', 'almonds'],
    [`Cook the ${ing[0]} in milk, stirring often, until soft.@1500`, 'Add sugar and simmer until creamy.@600', 'Finish with cardamom and almonds.'],
    'Serve warm or chilled.', emoji, 280, [8, 40, 9], 10, 35);

const lassi = (name: string, ing: string[], desc: string, emoji = '🥛') =>
  dish(name, 'Punjabi', desc, ['yogurt', ...ing], ['Chill all the ingredients.', 'Blend the yogurt with the rest until frothy.', 'Serve in tall glasses.'], 'Use thick, cold yogurt.', emoji, 180, [7, 26, 5], 5, 0);

// ---------- Proteins × North Indian styles ----------

interface Style { name: string; title?: (p: Protein) => string; cuisine: string; desc: (p: Protein) => string; ing: string[]; steps: (p: Protein) => string[]; carbs: number; fat: number; tip: string }

const ST = (p: Protein, finish: string, base: string) => [
  `${cap(p.prep)}.`,
  `${cap(base)}.@720`,
  `Add the ${p.en.toLowerCase()} and cook until done${p.cookMin > 20 ? ', adding water as needed' : ''}. ${cap(finish)}.@${p.cookMin * 60}`,
];

const N_STYLES: Style[] = [
  { name: 'Kadai', title: (p) => `Kadai ${p.en}`, cuisine: 'Punjabi', desc: (p) => `${p.en} with peppers in a freshly ground kadai masala.`, ing: ['bell pepper', 'onion', 'tomato', 'ginger garlic paste', 'coriander powder', 'chili powder', 'kasuri methi', 'garam masala', 'vegetable oil'], carbs: 12, fat: 6, tip: 'Grind coriander seeds and dry chilies fresh for real kadai flavour.',
    steps: (p) => ST(p, 'add the peppers and kasuri methi at the end', 'fry ginger garlic paste and onion, add tomato, coriander and chili and cook down') },
  { name: 'Do Pyaza', cuisine: 'Mughlai', desc: (p) => `${p.en} with onions added twice: in the gravy and as crunchy petals.`, ing: ['onion', 'tomato', 'ginger garlic paste', 'yogurt', 'garam masala', 'chili powder', 'coriander powder', 'vegetable oil'], carbs: 12, fat: 6, tip: 'Add the onion petals in the last five minutes.',
    steps: (p) => ST(p, 'add onion petals and cook for five more minutes', 'brown sliced onion, add ginger garlic paste, tomato, yogurt and the spices') },
  { name: 'Handi', title: (p) => `${p.en} Handi`, cuisine: 'North Indian', desc: (p) => `${p.en} slow-cooked in a clay pot with yogurt and cream.`, ing: ['onion', 'tomato', 'yogurt', 'heavy cream', 'ginger garlic paste', 'garam masala', 'chili powder', 'ghee'], carbs: 10, fat: 10, tip: 'Seal the pot for the last ten minutes.',
    steps: (p) => ST(p, 'stir in cream and cook covered on low heat', 'cook onion, ginger garlic paste, tomato and yogurt with the spices in ghee') },
  { name: 'Achari', title: (p) => `Achari ${p.en}`, cuisine: 'Punjabi', desc: (p) => `${p.en} in a tangy gravy flavoured with pickling spices.`, ing: ['mustard seeds', 'fennel seeds', 'fenugreek seeds', 'onion', 'tomato', 'yogurt', 'chili powder', 'turmeric', 'mustard oil'], carbs: 10, fat: 8, tip: 'Mustard oil heated until smoking gives the pickle taste.',
    steps: (p) => ST(p, 'finish with a squeeze of lemon if you like', 'splutter mustard, fennel and fenugreek seeds in mustard oil, add onion, tomato and yogurt with the spices') },
  { name: 'Bhuna', title: (p) => `Bhuna ${p.en}`, cuisine: 'North Indian', desc: (p) => `${p.en} roasted in its own masala until thick and dark.`, ing: ['onion', 'tomato', 'ginger garlic paste', 'yogurt', 'chili powder', 'coriander powder', 'garam masala', 'vegetable oil'], carbs: 10, fat: 8, tip: 'Bhuna means patient roasting; keep stirring.',
    steps: (p) => ST(p, 'roast until the masala clings and the oil separates', 'brown the onion deeply, add ginger garlic paste, tomato, yogurt and the spices') },
  { name: 'Korma', title: (p) => `${p.en} Korma`, cuisine: 'Mughlai', desc: (p) => `${p.en} in a mild, rich yogurt, onion and nut gravy.`, ing: ['yogurt', 'onion', 'cashews', 'almonds', 'ginger garlic paste', 'cardamom', 'cloves', 'garam masala', 'ghee'], carbs: 10, fat: 14, tip: 'Keep the heat low so the yogurt does not split.',
    steps: (p) => ST(p, 'stir in ground nuts and simmer until creamy', 'fry whole spices and sliced onion in ghee, add ginger garlic paste and yogurt') },
  { name: 'Makhani', title: (p) => `${p.en} Makhani`, cuisine: 'Punjabi', desc: (p) => `${p.en} in a velvety tomato, butter and cream sauce.`, ing: ['tomato', 'butter', 'heavy cream', 'cashews', 'ginger garlic paste', 'chili powder', 'kasuri methi', 'garam masala', 'sugar'], carbs: 12, fat: 16, tip: 'A pinch of sugar balances the tomato.',
    steps: (p) => ST(p, 'add cream and kasuri methi', 'simmer tomato and cashews, blend smooth, and cook with ginger garlic paste, butter and chili') },
  { name: 'Lababdar', title: (p) => `${p.en} Lababdar`, cuisine: 'Punjabi', desc: (p) => `${p.en} in a rich, slightly tangy onion-tomato gravy with grated paneer.`, ing: ['onion', 'tomato', 'paneer', 'heavy cream', 'ginger garlic paste', 'garam masala', 'chili powder', 'kasuri methi', 'butter'], carbs: 12, fat: 16, tip: 'Grated paneer stirred in at the end is the lababdar signature.',
    steps: (p) => ST(p, 'stir in cream and grated paneer', 'cook chopped onion and tomato with ginger garlic paste and spices in butter until thick') },
  { name: 'Saagwala', title: (p) => `${p.en} Saagwala`, cuisine: 'Punjabi', desc: (p) => `${p.en} cooked in a garlicky spinach gravy.`, ing: ['spinach', 'onion', 'tomato', 'garlic', 'ginger', 'green chili', 'garam masala', 'heavy cream', 'ghee'], carbs: 10, fat: 10, tip: 'Blanch the spinach briefly to keep it green.',
    steps: (p) => ST(p, 'stir in a little cream', 'blanch and blend the spinach; cook onion, garlic, ginger and tomato in ghee and add the spinach') },
  { name: 'Kali Mirch', title: (p) => `${p.en} Kali Mirch`, cuisine: 'Mughlai', desc: (p) => `${p.en} in a creamy white gravy with crushed black pepper.`, ing: ['black pepper', 'yogurt', 'cashews', 'onion', 'heavy cream', 'ginger garlic paste', 'cardamom', 'butter'], carbs: 8, fat: 14, tip: 'Use plenty of freshly crushed pepper.',
    steps: (p) => ST(p, 'add cream and lots of crushed pepper', 'cook onion and ginger garlic paste in butter without browning, add yogurt and ground cashews') },
  { name: 'Jalfrezi', title: (p) => `${p.en} Jalfrezi`, cuisine: 'North Indian', desc: (p) => `${p.en} stir-fried with peppers, onion and tomato in a tangy masala.`, ing: ['bell pepper', 'onion', 'tomato', 'ginger', 'green chili', 'vinegar', 'chili powder', 'garam masala', 'vegetable oil'], carbs: 12, fat: 6, tip: 'Keep the vegetables crunchy.',
    steps: (p) => ST(p, 'toss in the peppers and onion and a dash of vinegar', 'stir-fry ginger and green chili, add tomato and the spices') },
  { name: 'Tikka Masala', title: (p) => `${p.en} Tikka Masala`, cuisine: 'Punjabi', desc: (p) => `Charred ${p.en.toLowerCase()} tikka in a creamy spiced tomato gravy.`, ing: ['yogurt', 'tomato', 'onion', 'heavy cream', 'ginger garlic paste', 'garam masala', 'chili powder', 'kasuri methi', 'butter'], carbs: 12, fat: 14, tip: 'Char the tikka well before it goes into the gravy.',
    steps: (p) => [`${cap(p.prep)} and marinate in yogurt and spices, then grill until charred.@1200`, 'Cook onion, tomato and ginger garlic paste in butter and blend.@720', `Simmer with cream and kasuri methi and add the ${p.en.toLowerCase()}.@${Math.min(p.cookMin, 20) * 60}`] },
  { name: 'Rara', title: (p) => `${p.en} Rara`, cuisine: 'Punjabi', desc: (p) => `Punjabi ${p.en.toLowerCase()} cooked with its own keema in a thick masala.`, ing: ['lamb', 'onion', 'tomato', 'ginger garlic paste', 'yogurt', 'garam masala', 'chili powder', 'ghee'], carbs: 8, fat: 12, tip: 'The minced meat makes the gravy rich and thick.',
    steps: (p) => ST(p, 'stir in the cooked keema and simmer until thick', 'cook minced lamb with onion, ginger garlic paste, tomato, yogurt and spices in ghee') },
  { name: 'Changezi', title: (p) => `${p.en} Changezi`, cuisine: 'Mughlai', desc: (p) => `Old Delhi ${p.en.toLowerCase()} changezi: charred, then simmered in a creamy masala.`, ing: ['yogurt', 'heavy cream', 'onion', 'tomato', 'cashews', 'ginger garlic paste', 'garam masala', 'butter'], carbs: 10, fat: 16, tip: 'Grill first for a smoky edge.',
    steps: (p) => ST(p, 'add cream and simmer briefly', 'cook onion, tomato and cashews and blend; cook with ginger garlic paste, yogurt and spices in butter') },
  { name: 'Pasanda', title: (p) => `${p.en} Pasanda`, cuisine: 'Awadhi', desc: (p) => `Awadhi ${p.en.toLowerCase()} pasanda in a fragrant almond and yogurt gravy.`, ing: ['almonds', 'yogurt', 'onion', 'ginger garlic paste', 'cardamom', 'saffron', 'heavy cream', 'ghee'], carbs: 8, fat: 16, tip: 'Pasanda pieces are traditionally flattened thin.',
    steps: (p) => ST(p, 'finish with saffron and cream', 'fry onion in ghee and grind with almonds; cook with ginger garlic paste, yogurt and cardamom') },
  { name: 'Tawa', title: (p) => `Tawa ${p.en}`, cuisine: 'Punjabi', desc: (p) => `${p.en} tossed on a hot griddle with onion, peppers and tawa masala.`, ing: ['onion', 'bell pepper', 'tomato', 'ginger garlic paste', 'chili powder', 'chaat masala', 'garam masala', 'lemon', 'butter'], carbs: 10, fat: 8, tip: 'A very hot griddle gives the charred edges.',
    steps: (p) => ST(p, 'toss with chaat masala and lemon', 'cook onion, peppers, tomato and ginger garlic paste with the spices in butter on a hot griddle') },
  { name: 'Masala', title: (p) => `${p.en} Masala`, cuisine: 'North Indian', desc: (p) => `Homestyle ${p.en.toLowerCase()} masala in a thick onion tomato gravy.`, ing: ['onion', 'tomato', 'ginger garlic paste', 'turmeric', 'chili powder', 'coriander powder', 'garam masala', 'vegetable oil', 'cilantro'], carbs: 10, fat: 8, tip: 'Brown the onions well for a deep colour.',
    steps: (p) => ST(p, 'finish with garam masala and cilantro', 'brown the onion, add ginger garlic paste, tomato and the spices and cook until the oil separates') },
  { name: 'Methi', title: (p) => `Methi ${p.en}`, cuisine: 'Punjabi', desc: (p) => `${p.en} cooked with fresh fenugreek leaves in a creamy gravy.`, ing: ['fenugreek leaves', 'onion', 'tomato', 'ginger garlic paste', 'heavy cream', 'garam masala', 'green chili', 'vegetable oil'], carbs: 10, fat: 12, tip: 'Salt the methi and squeeze to cut bitterness.',
    steps: (p) => ST(p, 'add the fenugreek and cream and simmer', 'cook onion, ginger garlic paste, green chili and tomato with garam masala') },
  { name: 'Malai', title: (p) => `${p.en} Malai Curry`, cuisine: 'Mughlai', desc: (p) => `${p.en} in a mild, creamy white gravy with cashews.`, ing: ['heavy cream', 'cashews', 'onion', 'ginger', 'green chili', 'cardamom', 'butter'], carbs: 8, fat: 16, tip: 'Keep the onion pale for a white gravy.',
    steps: (p) => ST(p, 'add cream and simmer until silky', 'boil and blend onion, cashews, ginger and green chili and cook gently in butter with cardamom') },
  { name: 'Rogan Josh', title: (p) => `${p.en} Rogan Josh`, cuisine: 'Kashmiri', desc: (p) => `Kashmiri ${p.en.toLowerCase()} rogan josh with yogurt, fennel and Kashmiri chili.`, ing: ['yogurt', 'fennel seeds', 'ginger', 'chili powder', 'cardamom', 'cloves', 'asafoetida', 'mustard oil'], carbs: 6, fat: 12, tip: 'Kashmiri chili gives the red colour without too much heat.',
    steps: (p) => ST(p, 'simmer until the oil rises to the top', 'heat mustard oil, add whole spices and asafoetida, then chili, yogurt, fennel and ginger') },
  { name: 'Tikka', title: (p) => `${p.en} Tikka`, cuisine: 'Punjabi', desc: (p) => `Classic Punjabi ${p.en.toLowerCase()} tikka, marinated and charred.`, ing: ['yogurt', 'ginger garlic paste', 'chili powder', 'garam masala', 'lemon', 'mustard oil', 'onion'], carbs: 4, fat: 6, tip: 'Marinate overnight when you can.',
    steps: (p) => [`${cap(p.prep)}.`, `Marinate the ${p.en.toLowerCase()} with yogurt, ginger garlic paste, chili, garam masala, lemon and mustard oil.@3600`, 'Thread on skewers and grill on high heat until charred. Serve with onion rings.@720'] },
  { name: 'Lahori', title: (p) => `Lahori ${p.en}`, cuisine: 'Punjabi', desc: (p) => `${p.en} in a rich, tomato-heavy Lahori masala.`, ing: ['tomato', 'yogurt', 'ginger garlic paste', 'green chili', 'garam masala', 'black pepper', 'ghee', 'cilantro'], carbs: 8, fat: 12, tip: 'Cook until the ghee separates.',
    steps: (p) => ST(p, 'finish with green chili, pepper and cilantro', 'cook tomato, yogurt and ginger garlic paste in ghee until thick') },
  { name: 'Afghani', title: (p) => `Afghani ${p.en} Curry`, cuisine: 'Mughlai', desc: (p) => `${p.en} in a mild, creamy Afghani-style gravy with pepper.`, ing: ['heavy cream', 'yogurt', 'cashews', 'onion', 'black pepper', 'cardamom', 'butter'], carbs: 8, fat: 16, tip: 'Mild and creamy; let the pepper lead.',
    steps: (p) => ST(p, 'add cream and crushed pepper', 'cook onion and ground cashews in butter with yogurt and cardamom') },
  { name: 'Dhaba Curry', title: (p) => `Dhaba ${p.en} Curry`, cuisine: 'Punjabi', desc: (p) => `Rustic highway-dhaba ${p.en.toLowerCase()} curry, bold and oily.`, ing: ['onion', 'tomato', 'ginger garlic paste', 'green chili', 'coriander powder', 'chili powder', 'garam masala', 'mustard oil', 'cilantro'], carbs: 10, fat: 10, tip: 'Smoke the oil first for the dhaba taste.',
    steps: (p) => ST(p, 'finish with garam masala and cilantro', 'heat mustard oil until it smokes, brown the onion and add ginger garlic paste, tomato and spices') },
];

const N_PAIRS: Record<string, string[]> = {
  Kadai: ['chicken', 'mutton', 'mushroom', 'egg', 'prawn', 'mixveg'],
  Tawa: ['chicken', 'paneer', 'fish', 'mushroom', 'prawn', 'mutton'],
  Masala: ['chicken', 'mutton', 'egg', 'fish'],
  Methi: ['chicken', 'paneer', 'mushroom'],
  Malai: ['paneer', 'mushroom', 'egg', 'chicken', 'mixveg'],
  'Rogan Josh': ['chicken', 'mushroom'],
  Tikka: ['chicken', 'fish'],
  Lahori: ['chicken', 'mutton'],
  Afghani: ['chicken', 'paneer'],
  'Do Pyaza': ['chicken', 'mutton', 'paneer', 'mushroom', 'egg'],
  Handi: ['chicken', 'mutton', 'paneer', 'mushroom', 'egg', 'mixveg'],
  Achari: ['chicken', 'mutton', 'paneer', 'mushroom', 'egg', 'fish', 'prawn', 'mixveg'],
  Bhuna: ['chicken', 'paneer', 'egg', 'prawn', 'mushroom', 'mutton'],
  Korma: ['paneer', 'egg', 'mushroom', 'prawn', 'fish'],
  Makhani: ['mushroom', 'egg', 'prawn', 'fish', 'mixveg'],
  Lababdar: ['paneer', 'chicken', 'mushroom'],
  Saagwala: ['chicken', 'mutton', 'mushroom', 'egg', 'prawn'],
  'Kali Mirch': ['chicken', 'mutton', 'paneer', 'mushroom', 'prawn', 'egg'],
  Jalfrezi: ['paneer', 'mushroom', 'prawn', 'egg', 'mixveg'],
  'Tikka Masala': ['paneer', 'fish', 'prawn', 'mushroom', 'egg'],
  Rara: ['chicken', 'mutton'],
  Changezi: ['chicken', 'paneer', 'mutton'],
  Pasanda: ['chicken', 'mutton', 'paneer'],
  'Dhaba Curry': ['chicken', 'mutton', 'egg', 'fish', 'paneer', 'mushroom', 'mixveg'],
};

const proteinDish = (s: Style, p: Protein): Row =>
  row({
    title: s.title ? s.title(p) : `${p.en} ${s.name}`, cuisine: s.cuisine, description: s.desc(p),
    difficulty: p.cookMin >= 45 ? 'Medium' : 'Easy', prep: 15, cook: p.cookMin + 12,
    kcal: p.kcal + 150, macros: [p.protein + (s.name === 'Rara' ? 6 : 0), s.carbs, p.fat + s.fat], emoji: p.emoji,
    ingredients: [...p.ing, ...s.ing, 'salt'], steps: s.steps(p), tip: s.tip,
  });

// ---------- Kebabs and tikka ----------

const tikka = (title: string, cuisine: string, ing: string[], desc: string, emoji: string, macros: M, kcal: number, method = 'thread on skewers and grill or bake on high heat until charred at the edges') =>
  dish(title, cuisine, desc, [...ing, 'yogurt', 'ginger garlic paste', 'chili powder', 'garam masala', 'lemon', 'mustard oil'],
    [`Marinate the ${ing[0]} with yogurt, ginger garlic paste, chili, garam masala, lemon and mustard oil.@3600`, cap(method) + '.@720', 'Serve with mint chutney and onion rings.'],
    'Marinate overnight for the best flavour.', emoji, kcal, macros, 15, 15);

// ---------- Rows ----------

export const NORTH_FAMILY_ROWS: Row[] = [
  ...N_STYLES.flatMap((s) => (N_PAIRS[s.name] || []).map((k) => proteinDish(s, protein(k)))),
  ...vegs('beans capsicum spinach carrot okra radish tomato mushroom pumpkin cabbage corn sweet-potato').map(alooX),
  ...vegs('pumpkin capsicum cabbage beans okra raw-banana jackfruit colocasia turnip radish bitter-gourd sweet-potato corn cauliflower methi beetroot carrot drumstick').map(kiSabzi),
  ...vegs('eggplant cauliflower peas colocasia jackfruit bitter-gourd capsicum corn potato pumpkin raw-banana turnip').map(masalaGravy),
  ...vegs('okra bitter-gourd eggplant capsicum tomato potato').map(bharwan),
  ...vegs('potato tomato pumpkin bottle-gourd').map(bharta),
  kofta('Malai', ['paneer', 'potato'], 'Paneer and potato dumplings in a creamy cashew gravy.', '🧀', 12, 420),
  kofta('Lauki', ['bottle gourd'], 'Bottle gourd dumplings in a spiced tomato gravy.', '🥒'),
  kofta('Paneer', ['paneer'], 'Soft paneer koftas in a rich onion tomato gravy.', '🧀', 14, 400),
  kofta('Palak', ['spinach', 'paneer'], 'Spinach and paneer koftas in a creamy gravy.', '🥬', 10, 360),
  kofta('Kacche Kele', ['raw banana'], 'Raw banana koftas, a fasting-day favourite.', '🍌'),
  kofta('Gobi', ['cauliflower'], 'Cauliflower koftas in a tomato gravy.', '🥦'),
  kofta('Mutton', ['lamb'], 'Mutton meatballs in a rich, spiced gravy.', '🍖', 26, 460),
  kofta('Chicken', ['chicken'], 'Minced chicken koftas in a creamy tomato gravy.', '🍗', 24, 420),
  dal('Arhar Dal', 'North Indian', 'Simple yellow toor dal with a cumin and garlic tadka.', ['lentils', 'tomato', 'garlic', 'green chili'], 'fry cumin, garlic and green chili in ghee and pour over', 'Everyday comfort with rice.'),
  dal('Moong Dal Tadka', 'Punjabi', 'Yellow moong dal with a smoky ghee tadka.', ['lentils', 'tomato', 'onion', 'garlic', 'chili powder'], 'fry cumin, garlic, onion and chili powder in ghee and pour over', 'Light and quick.'),
  dal('Dhaba Dal Fry', 'Punjabi', 'Thick dal fry with onion, tomato and lots of garlic.', ['lentils', 'chana dal', 'onion', 'tomato', 'garlic', 'ginger', 'garam masala'], 'fry cumin, onion, garlic, ginger and tomato in ghee, add garam masala and stir in', 'Mixing two dals gives body.'),
  dal('Dhuli Urad Dal', 'Punjabi', 'Dry white urad dal with ginger and green chili.', ['urad dal', 'ginger', 'green chili', 'onion'], 'fry cumin, ginger, green chili and onion in ghee and fold in gently', 'Cook it just tender so the grains stay separate.'),
  dal('Maa ki Dal', 'Punjabi', 'Whole black urad dal slow-cooked with ginger and garlic, without cream.', ['urad dal', 'kidney beans', 'ginger', 'garlic', 'tomato', 'chili powder'], 'fry ginger, garlic and tomato with chili in ghee and simmer the dal with it for an hour', 'The longer it simmers, the better.'),
  dal('Dal Panchmel', 'Rajasthani', 'Five-lentil Rajasthani dal served with baati.', ['lentils', 'chana dal', 'urad dal', 'kidney beans', 'tomato', 'ginger', 'asafoetida'], 'fry cumin, asafoetida, ginger and tomato in ghee and pour over', 'Serve with baati or rice.'),
  dal('Lasooni Dal', 'North Indian', 'Garlic-forward yellow dal.', ['lentils', 'garlic', 'tomato', 'green chili'], 'fry lots of sliced garlic golden in ghee with cumin and chili and pour over', 'Fry the garlic slowly until golden.'),
  dal('Sabut Masoor', 'Punjabi', 'Whole brown lentils in an onion tomato masala.', ['lentils', 'onion', 'tomato', 'ginger garlic paste', 'garam masala'], 'cook onion, ginger garlic paste and tomato with garam masala in ghee and stir in', 'Whole masoor keeps its shape.'),
  dal('Moong Masoor Dal', 'North Indian', 'Quick mixed moong and masoor dal.', ['lentils', 'tomato', 'onion', 'garlic'], 'fry cumin, garlic and onion in ghee and pour over', 'Ready in twenty minutes.'),
  dal('Lobia Masala', 'Punjabi', 'Black-eyed peas in a spiced onion tomato gravy.', ['black-eyed peas', 'onion', 'tomato', 'ginger garlic paste', 'garam masala', 'amchur'], 'cook onion, ginger garlic paste and tomato with the spices in ghee and simmer the beans in it', 'Soak the beans overnight.', '🫘'),
  dal('Kala Chana Masala', 'Punjabi', 'Black chickpeas in a dry, tangy masala.', ['chickpeas', 'onion', 'tomato', 'ginger', 'amchur', 'garam masala'], 'cook onion, ginger and tomato with amchur and garam masala in ghee and toss the chickpeas in it', 'Great with puri.', '🫘'),
  dal('Dal Bukhara', 'Mughlai', 'Rich slow-cooked black dal with butter and cream.', ['urad dal', 'tomato', 'ginger garlic paste', 'butter', 'heavy cream', 'chili powder'], 'simmer the dal for hours with tomato puree, ginger garlic paste, butter and cream', 'Simmer low and slow.'),
  dal('Chana Dal with Lauki', 'North Indian', 'Split chickpeas cooked with bottle gourd.', ['chana dal', 'bottle gourd', 'tomato', 'ginger', 'green chili'], 'fry cumin, ginger and green chili in ghee and pour over', 'Lauki makes it light.'),
  dal('Rajasthani Kadhi Pakodi', 'Rajasthani', 'Spicy yogurt kadhi with small gram flour fritters.', ['yogurt', 'besan', 'chili powder', 'fenugreek seeds', 'vegetable oil'], 'fry small besan pakodis, simmer the yogurt kadhi until thick and add them', 'Rajasthani kadhi is spicier than Punjabi.'),
  dal('Palak Kadhi', 'North Indian', 'Yogurt kadhi with spinach.', ['yogurt', 'besan', 'spinach', 'fenugreek seeds', 'chili powder'], 'simmer the yogurt and besan with spinach until thick and temper with fenugreek seeds and chili in ghee', 'Stir until it boils so it does not split.'),
  paratha('Mooli', 'Flatbread stuffed with spiced grated radish.', ['radish', 'green chili', 'cilantro', 'cumin'], 'grate the radish, squeeze dry, mix with chili, cilantro, cumin and salt, and seal inside the dough'),
  paratha('Pyaz', 'Onion-stuffed crisp paratha.', ['onion', 'green chili', 'cilantro', 'chili powder'], 'mix chopped onion with chili, cilantro and spices and seal inside the dough'),
  paratha('Lachha', 'Flaky, layered paratha.', ['ghee'], 'roll thin, brush with ghee, pleat and coil, then roll again'),
  paratha('Pudina', 'Layered mint paratha.', ['mint', 'chaat masala'], 'roll thin, spread ghee and dried mint, pleat and coil, then roll again'),
  paratha('Ajwain', 'Carom-seed paratha, good for digestion.', ['cumin'], 'knead carom seeds into the dough and roll triangles with ghee'),
  paratha('Keema', 'Paratha stuffed with spiced minced mutton.', ['lamb', 'onion', 'green chili', 'garam masala'], 'cook minced lamb with onion and spices until dry and seal inside the dough', '🫓', 22, 420),
  paratha('Dal', 'Paratha made with leftover dal.', ['lentils', 'green chili', 'cilantro'], 'knead leftover dal into the flour with chili and cilantro', '🫓', 12, 310),
  paratha('Mixed Veg', 'Paratha stuffed with spiced mixed vegetables.', ['potato', 'carrot', 'peas', 'cauliflower', 'garam masala'], 'mash the cooked vegetables with garam masala and seal inside the dough'),
  paratha('Palak', 'Green spinach paratha.', ['spinach', 'green chili', 'cumin'], 'knead blanched spinach puree into the flour with chili and cumin'),
  paratha('Cheese', 'Paratha stuffed with melting cheese.', ['cheddar', 'green chili'], 'seal grated cheese and chili inside the dough', '🧀', 14, 380),
  paratha('Anda', 'Egg paratha with onion and chili.', ['egg', 'onion', 'green chili'], 'cook the paratha, then pour beaten egg with onion and chili on top and flip', '🍳', 16, 360),
  paratha('Matar', 'Paratha stuffed with spiced green peas.', ['peas', 'green chili', 'ginger', 'cumin'], 'mash cooked peas with ginger, chili and cumin and seal inside the dough'),
  paratha('Chana Dal', 'Paratha stuffed with spiced chana dal.', ['chana dal', 'green chili', 'cumin', 'amchur'], 'cook and mash chana dal with spices and seal inside the dough', '🫓', 12, 330),
  paratha('Lauki', 'Soft bottle gourd paratha.', ['bottle gourd', 'green chili', 'cumin'], 'knead squeezed grated lauki into the flour with spices'),
  paratha('Gajar', 'Carrot paratha with ginger.', ['carrot', 'ginger', 'green chili'], 'knead grated carrot, ginger and chili into the flour'),
  paratha('Paneer Methi', 'Paratha stuffed with paneer and fenugreek.', ['paneer', 'fenugreek leaves', 'green chili'], 'mix crumbled paneer and fenugreek and seal inside the dough', '🫓', 16, 360),
  dish('Tandoori Roti', 'Punjabi', 'Whole wheat flatbread baked in a tandoor.', ['flour', 'yogurt', 'butter'], ['Knead flour, yogurt and water into a soft dough and rest.@1200', 'Shape rounds and cook on a very hot upturned pan or under the grill until blistered.@240', 'Brush with butter.'], 'A tandoor gives the char; a cast-iron pan comes close.', '🫓', 180, [6, 32, 4], 15, 10),
  dish('Butter Naan', 'Punjabi', 'Soft leavened naan brushed with butter.', ['flour', 'yogurt', 'yeast', 'sugar', 'butter'], ['Knead flour, yogurt, yeast and sugar into a soft dough and let it rise.@3600', 'Shape teardrops and cook on a very hot pan, then over the flame.@240', 'Brush with butter.'], 'A very hot pan makes the bubbles.', '🫓', 260, [7, 42, 8], 20, 15),
  dish('Garlic Naan', 'Punjabi', 'Naan topped with garlic and coriander.', ['flour', 'yogurt', 'yeast', 'garlic', 'cilantro', 'butter'], ['Knead and rise the naan dough.@3600', 'Press garlic and cilantro into each round and cook on a very hot pan.@240', 'Brush with garlic butter.'], 'Press the garlic in so it does not fall off.', '🧄', 280, [7, 42, 9], 20, 15),
  dish('Missi Roti', 'Punjabi', 'Gram flour and wheat roti with spices.', ['besan', 'flour', 'onion', 'green chili', 'cumin', 'ghee'], ['Knead besan, flour, onion, chili and cumin into a dough.', 'Roll and cook on a hot pan.@180', 'Brush with ghee.'], 'Best with butter and pickle.', '🫓', 220, [9, 32, 7], 15, 15),
  dish('Makki ki Roti', 'Punjabi', 'Cornmeal flatbread, the partner of sarson ka saag.', ['cornmeal', 'radish', 'ghee'], ['Knead cornmeal with warm water and a little grated radish.', 'Pat rounds between your palms.', 'Cook slowly on a hot pan with ghee.@360'], 'Pat on a damp cloth if it cracks.', '🌽', 230, [4, 40, 7], 15, 15),
  dish('Rumali Roti', 'Mughlai', 'Handkerchief-thin roti cooked on an upturned wok.', ['flour', 'milk', 'vegetable oil'], ['Knead flour, milk and oil into a very soft dough and rest.@1800', 'Stretch paper-thin.', 'Cook on a hot upturned wok for seconds, then fold like a handkerchief.@60'], 'Rest the dough well so it stretches.', '🫓', 170, [5, 30, 3], 30, 10, 'Hard'),
  dish('Aloo Kulcha', 'Punjabi', 'Leavened bread stuffed with spiced potato.', ['flour', 'yogurt', 'baking powder', 'potato', 'green chili', 'cilantro', 'butter'], ['Knead flour, yogurt and baking powder into a soft dough.@1200', 'Seal spiced mashed potato inside and roll.', 'Cook on a hot pan with butter.@300'], 'Amritsari kulchas are crisp outside.', '🫓', 340, [8, 52, 11], 20, 15),
  dish('Paneer Kulcha', 'Punjabi', 'Leavened bread stuffed with spiced paneer.', ['flour', 'yogurt', 'baking powder', 'paneer', 'green chili', 'cilantro', 'butter'], ['Knead flour, yogurt and baking powder into a soft dough.@1200', 'Seal spiced paneer inside and roll.', 'Cook on a hot pan with butter.@300'], 'Serve with chole.', '🧀', 380, [14, 46, 15], 20, 15),
  dish('Matar Kachori', 'North Indian', 'Flaky kachoris filled with spiced green peas.', ['flour', 'peas', 'ginger', 'green chili', 'fennel seeds', 'vegetable oil'], ['Cook mashed peas with ginger, chili and fennel until dry.@600', 'Fill a short dough and seal.', 'Fry slowly until crisp.@600'], 'A winter breakfast in Delhi.', '🥟', 300, [7, 38, 14], 25, 20),
  dish('Khasta Kachori', 'Rajasthani', 'Flaky kachoris filled with spiced moong dal.', ['flour', 'lentils', 'fennel seeds', 'chili powder', 'amchur', 'asafoetida', 'vegetable oil'], ['Cook ground moong dal with spices until dry.@600', 'Fill a short dough and seal.', 'Fry on very low heat until crisp.@900'], 'Low heat makes them khasta (flaky).', '🥟', 320, [8, 38, 15], 25, 25),
  dish('Aloo Puri', 'North Indian', 'Puffed puris with a thin, spicy potato curry.', ['flour', 'potato', 'tomato', 'cumin', 'chili powder', 'amchur', 'vegetable oil'], ['Simmer boiled potato with tomato, cumin and spices into a thin curry.@900', 'Roll small puris from a stiff dough.', 'Fry until puffed.@120'], 'A Sunday breakfast favourite.', '🫓', 420, [9, 60, 16], 15, 25),

  // Rice
  ...[
    ['Matar Pulao', ['peas'], 'Fragrant rice with green peas and whole spices.'],
    ['Paneer Pulao', ['paneer', 'peas'], 'Pulao with golden fried paneer.'],
    ['Chana Pulao', ['chickpeas', 'onion'], 'Chickpea pulao, a lunch-box favourite.'],
    ['Mushroom Pulao', ['mushrooms', 'onion'], 'Pulao with sautéed mushrooms.'],
    ['Chicken Yakhni Pulao', ['chicken', 'onion', 'yogurt'], 'Rice cooked in a fragrant chicken stock.'],
    ['Mutton Yakhni Pulao', ['lamb', 'onion', 'yogurt'], 'Rice cooked in a rich mutton yakhni.'],
    ['Corn Pulao', ['corn', 'onion'], 'Sweet corn pulao with mint.'],
    ['Kathal Pulao', ['jackfruit', 'onion'], 'Raw jackfruit pulao with whole spices.'],
    ['Methi Pulao', ['fenugreek leaves', 'onion'], 'Fenugreek-leaf pulao.'],
  ].map(([title, ing, desc]) =>
    dish(title as string, 'North Indian', desc as string, ['rice', ...(ing as string[]), 'cumin', 'bay leaf', 'cinnamon', 'cloves', 'cardamom', 'ghee'],
      ['Soak the rice for twenty minutes.@1200', `Fry whole spices in ghee, then the ${(ing as string[])[0]}${(ing as string[]).includes('chicken') || (ing as string[]).includes('lamb') ? ' and cook until tender, keeping the stock' : ''}.@600`, 'Add the rice and water or stock, cover and cook until fluffy.@900'],
      'Do not stir while it cooks.', '🍚', (ing as string[]).some((i) => ['chicken', 'lamb'].includes(i)) ? 480 : 330,
      (ing as string[]).some((i) => ['chicken', 'lamb'].includes(i)) ? [24, 56, 14] : (ing as string[]).includes('paneer') ? [12, 54, 12] : [7, 58, 8], 15, 30)),
  ...[
    ['Lucknowi Chicken Biryani', 'Awadhi', 'chicken'], ['Moradabadi Chicken Biryani', 'North Indian', 'chicken'], ['Delhi Mutton Biryani', 'Mughlai', 'mutton'], ['Egg Dum Biryani', 'Mughlai', 'egg'],
    ['Paneer Tikka Biryani', 'Punjabi', 'paneer'], ['Mushroom Dum Biryani', 'North Indian', 'mushroom'], ['Keema Biryani', 'Mughlai', 'mutton'], ['Lucknowi Fish Biryani', 'Awadhi', 'fish'], ['Kathal Biryani', 'Awadhi', 'mushroom'],
  ].map(([title, cuisine, key]) => {
    const p = protein(key);
    const ing = title === 'Kathal Biryani' ? ['jackfruit'] : p.ing;
    return dish(title, cuisine, `${title} layered with saffron rice, fried onions and mint, sealed and cooked on dum.`,
      ['rice', ...ing, 'yogurt', 'onion', 'ginger garlic paste', 'saffron', 'mint', 'garam masala', 'cardamom', 'bay leaf', 'ghee'],
      [`Marinate the ${title === 'Kathal Biryani' ? 'jackfruit' : p.en.toLowerCase()} with yogurt, ginger garlic paste and garam masala.@1800`, 'Fry onions golden in ghee and par-boil the rice with whole spices.@900', 'Layer meat, rice, onions, mint and saffron milk, seal and cook on low heat.@1800'],
      'Rest ten minutes before opening.', '🍚', p.kcal + 380, [p.protein, 62, p.fat + 6], 30, 60, 'Hard');
  }),

  // Kebabs and tikka
  tikka('Hariyali Chicken Tikka', 'Punjabi', ['chicken', 'mint', 'cilantro', 'spinach', 'green chili'], 'Green-marinated chicken tikka with mint and coriander.', '🍢', [32, 6, 14], 300),
  tikka('Hariyali Paneer Tikka', 'Punjabi', ['paneer', 'mint', 'cilantro', 'green chili', 'bell pepper'], 'Paneer tikka in a green herb marinade.', '🍢', [18, 8, 22], 320),
  tikka('Achari Paneer Tikka', 'Punjabi', ['paneer', 'mustard seeds', 'fennel seeds', 'onion', 'bell pepper'], 'Paneer tikka with pickling spices.', '🍢', [18, 8, 22], 320),
  tikka('Mushroom Tikka', 'Punjabi', ['mushrooms', 'bell pepper', 'onion'], 'Charred mushroom tikka.', '🍄', [6, 10, 10], 170),
  tikka('Tandoori Gobi', 'Punjabi', ['cauliflower'], 'Smoky tandoori cauliflower florets.', '🥦', [6, 12, 9], 160),
  tikka('Tandoori Aloo', 'Punjabi', ['potato', 'paneer'], 'Stuffed tandoori potatoes.', '🥔', [8, 30, 12], 260),
  tikka('Tandoori Fish', 'Punjabi', ['white fish', 'besan'], 'Ajwain-scented tandoori fish.', '🐟', [28, 6, 10], 240),
  tikka('Tandoori Prawns', 'Punjabi', ['shrimp'], 'Prawns charred in a tandoori marinade.', '🍤', [24, 4, 9], 200),
  tikka('Chicken Reshmi Kebab', 'Mughlai', ['chicken breast', 'heavy cream', 'cashews', 'egg'], 'Silky creamy chicken kebabs.', '🍢', [32, 6, 18], 340),
  tikka('Chicken Seekh Kebab', 'Mughlai', ['chicken', 'onion', 'cilantro', 'green chili'], 'Minced chicken kebabs on skewers.', '🍢', [28, 4, 14], 280, 'shape the minced chicken around skewers and grill until cooked'),
  tikka('Fish Amritsari Tikka', 'Punjabi', ['white fish', 'besan', 'chaat masala'], 'Amritsari-spiced fish tikka.', '🐟', [26, 8, 10], 240),
  tikka('Murgh Afghani', 'Mughlai', ['chicken', 'heavy cream', 'cashews', 'black pepper'], 'Mild, creamy grilled chicken.', '🍗', [32, 6, 20], 360),
  dish('Hara Bhara Kebab', 'North Indian', 'Green patties of spinach, peas and potato.', ['spinach', 'peas', 'potato', 'green chili', 'ginger', 'cornstarch', 'cashews', 'chaat masala', 'vegetable oil'], ['Blanch spinach and peas and chop finely.@180', 'Mix with mashed potato, chili, ginger, cornstarch and chaat masala and shape patties with a cashew on top.', 'Shallow-fry until crisp.@480'], 'Squeeze the spinach dry.', '🟢', 200, [6, 24, 9], 20, 15),
  dish('Dahi ke Kebab', 'Awadhi', 'Melt-in-the-mouth hung yogurt kebabs.', ['yogurt', 'paneer', 'besan', 'onion', 'green chili', 'cardamom', 'panko', 'vegetable oil'], ['Hang the yogurt overnight until very thick.@28800', 'Mix with paneer, roasted besan, onion, chili and cardamom and shape patties.', 'Coat in panko and shallow-fry until golden.@360'], 'Chill the patties before frying.', '⚪', 260, [10, 18, 16], 20, 15),
  dish('Rajma Galouti', 'Awadhi', 'Melt-in-the-mouth kidney bean kebabs.', ['kidney beans', 'onion', 'ginger', 'garam masala', 'cardamom', 'saffron', 'ghee'], ['Mash cooked kidney beans with fried onion, ginger and the spices.', 'Shape small patties.', 'Cook in ghee until crisp.@360'], 'Serve on small parathas.', '🫘', 230, [10, 28, 9], 20, 15),

  // Raita, chaat, pakora
  raita('Onion', ['onion', 'green chili'], '🧅'), raita('Mint', ['mint', 'cilantro'], '🌿'), raita('Aloo', ['potato'], '🥔'), raita('Pineapple', ['pineapple', 'sugar'], '🍍'), raita('Beetroot', ['beetroot'], '🟣'), raita('Palak', ['spinach'], '🥬'), raita('Lauki', ['bottle gourd'], '🥒'), raita('Mixed Veg', ['cucumber', 'tomato', 'onion', 'carrot'], '🥗'), raita('Fruit', ['apple', 'banana', 'pomegranate', 'sugar'], '🍓'), raita('Kaddu', ['pumpkin'], '🎃'),
  ...[
    ['Papdi Chaat', ['flour', 'potato', 'chickpeas', 'yogurt', 'tamarind', 'mint'], 'Crisp wafers with potato, chickpeas, yogurt and chutneys.', '🥗'],
    ['Aloo Chaat', ['potato', 'chaat masala', 'lemon', 'onion', 'tamarind'], 'Fried potato cubes tossed with chaat masala and chutneys.', '🥔'],
    ['Chana Chaat', ['chickpeas', 'onion', 'tomato', 'lemon', 'green chili'], 'Tangy chickpea chaat.', '🫘'],
    ['Fruit Chaat', ['apple', 'banana', 'orange', 'pomegranate', 'lemon'], 'Seasonal fruit tossed with chaat masala.', '🍎'],
    ['Raj Kachori', ['flour', 'potato', 'chickpeas', 'yogurt', 'tamarind', 'pomegranate'], 'Giant crisp kachori filled with chaat.', '🥟'],
    ['Palak Patta Chaat', ['spinach', 'besan', 'yogurt', 'tamarind', 'pomegranate'], 'Crisp fried spinach leaves with yogurt and chutneys.', '🥬'],
    ['Shakarkandi Chaat', ['sweet potato', 'lemon', 'chaat masala'], 'Roasted sweet potato chaat, Delhi winter style.', '🍠'],
    ['Matar Kulcha Chaat', ['peas', 'onion', 'tomato', 'lemon', 'tamarind'], 'Delhi white pea chaat.', '🟢'],
    ['Dahi Papdi Chaat', ['flour', 'yogurt', 'potato', 'tamarind', 'mint'], 'Papdi under sweet yogurt and chutneys.', '🥗'],
    ['Kachalu Chaat', ['colocasia', 'lemon', 'chaat masala', 'tamarind'], 'Tangy colocasia chaat.', '🥔'],
  ].map(([title, ing, desc, emoji]) =>
    dish(title as string, 'Indian Street Food', desc as string, [...(ing as string[]), 'chaat masala', 'cumin', 'cilantro', 'chili powder'],
      [`Prepare the ${(ing as string[])[0]}: cook, fry or chop as needed.@300`, 'Arrange in a plate with the rest of the ingredients.', 'Finish with chaat masala, roasted cumin, chili and cilantro.'],
      'Assemble just before eating.', emoji as string, 220, [6, 34, 6], 15, 10)),
  pakora('Paneer', ['paneer'], '🧀', 12), pakora('Aloo', ['potato'], '🥔'), pakora('Gobi', ['cauliflower'], '🥦'), pakora('Palak', ['spinach'], '🥬'), pakora('Mirchi', ['green chili', 'potato'], '🌶️'), pakora('Egg', ['egg'], '🥚', 10), pakora('Chicken', ['chicken'], '🍗', 18), pakora('Fish', ['white fish'], '🐟', 18), pakora('Moong Dal', ['lentils', 'ginger'], '🟢', 10), pakora('Baingan', ['eggplant'], '🍆'), pakora('Pyaz', ['onion'], '🧅'),

  // Sweets and drinks
  halwa('Lauki', ['bottle gourd', 'milk'], 'Bottle gourd halwa cooked in milk and ghee.', '🥒'),
  halwa('Aate ka', ['flour'], 'Wheat flour halwa, the gurdwara karah prasad.', '🟤'),
  halwa('Besan', ['besan', 'milk'], 'Roasted gram flour halwa.', '🟡'),
  halwa('Kaddu', ['pumpkin'], 'Pumpkin halwa with cardamom.', '🎃'),
  halwa('Suji Kesar', ['semolina', 'saffron'], 'Saffron semolina halwa.', '🟠'),
  halwa('Chukandar', ['beetroot', 'milk'], 'Beetroot halwa, ruby red.', '🟣'),
  halwa('Shakarkandi', ['sweet potato', 'milk'], 'Sweet potato halwa for fasting days.', '🍠'),
  halwa('Anjeer', ['dates', 'milk'], 'Fig and date halwa.', '🟤'),
  kheer('Lauki', ['bottle gourd'], '🥒'), kheer('Sabudana', ['sago'], '⚪'), kheer('Gajar', ['carrot'], '🥕'), kheer('Makhana Style Poha', ['poha'], '🥣'), kheer('Dalia', ['oats'], '🥣'), kheer('Badam', ['almonds'], '🥛'),
  dish('Atta Ladoo', 'Indian Sweets', 'Roasted wheat flour ladoos with ghee and jaggery.', ['flour', 'ghee', 'jaggery', 'cardamom', 'almonds'], ['Roast the flour in ghee until golden.@900', 'Cool slightly, mix in powdered jaggery, cardamom and almonds.', 'Shape into balls.'], 'A winter energy sweet.', '🟤', 200, [3, 24, 10], 10, 20),
  dish('Coconut Ladoo', 'Indian Sweets', 'Coconut and condensed milk ladoos.', ['coconut', 'condensed milk', 'cardamom', 'ghee'], ['Cook coconut with condensed milk until it comes together.@600', 'Add cardamom.', 'Shape balls and roll in coconut.'], 'Ready in fifteen minutes.', '⚪', 170, [2, 20, 9], 5, 10),
  dish('Pinni', 'Punjabi', 'Punjabi winter ladoos of wheat, ghee and nuts.', ['flour', 'ghee', 'sugar', 'almonds', 'cashews', 'khoya'], ['Roast the flour in ghee until brown.@1200', 'Add roasted khoya, sugar and chopped nuts.', 'Shape firmly.'], 'Keeps for weeks.', '🟤', 230, [4, 24, 13], 15, 25),
  dish('Gulgule', 'North Indian', 'Sweet wheat and jaggery fritters.', ['flour', 'jaggery', 'banana', 'fennel seeds', 'vegetable oil'], ['Dissolve jaggery and mix into flour with mashed banana and fennel.', 'Drop spoonfuls into hot oil.', 'Fry until deep brown.@300'], 'Made on Teej and Diwali.', '🟤', 220, [3, 34, 8], 10, 15),
  dish('Rabri', 'Indian Sweets', 'Thick reduced milk with layers of cream.', ['milk', 'sugar', 'saffron', 'cardamom', 'almonds'], ['Simmer milk in a wide pan, pulling the cream to the sides.@3600', 'Scrape the layers back in and add sugar and saffron.@300', 'Chill and top with almonds.'], 'Serve with jalebi.', '🥛', 300, [10, 32, 14], 5, 65, 'Medium'),
  dish('Malai Kulfi', 'Indian Sweets', 'Dense frozen milk dessert with cardamom.', ['milk', 'condensed milk', 'cardamom', 'almonds', 'saffron'], ['Simmer milk until reduced by half.@2700', 'Add condensed milk, cardamom, saffron and nuts.', 'Freeze in moulds overnight.@28800'], 'No churning needed.', '🍦', 260, [8, 30, 12], 10, 45),
  dish('Mango Kulfi', 'Indian Sweets', 'Mango and reduced milk kulfi.', ['mango', 'milk', 'condensed milk', 'cardamom'], ['Simmer milk until reduced.@2700', 'Blend with mango and condensed milk.', 'Freeze in moulds overnight.@28800'], 'Use sweet, fragrant mangoes.', '🥭', 250, [6, 34, 9], 10, 45),
  dish('Imarti', 'Indian Sweets', 'Urad dal flower spirals soaked in syrup.', ['urad dal', 'sugar', 'saffron', 'ghee'], ['Grind soaked urad dal into a fluffy batter.@7200', 'Pipe spirals into hot ghee and fry.@180', 'Soak in saffron syrup.@300'], 'Imarti is thicker and softer than jalebi.', '🌼', 240, [4, 40, 8], 20, 30, 'Medium'),
  dish('Balushahi', 'Indian Sweets', 'Flaky glazed sweet from North India.', ['flour', 'ghee', 'yogurt', 'sugar', 'cardamom', 'baking powder'], ['Rub ghee into flour, add yogurt and baking powder and shape discs with a dent.', 'Fry slowly until golden.@600', 'Dip in thick syrup.@120'], 'Fry on low heat for flaky layers.', '🍩', 280, [3, 38, 13], 20, 25, 'Medium'),
  lassi('Sweet Lassi', ['sugar', 'cardamom'], 'Thick Punjabi sweet lassi.'),
  lassi('Namkeen Lassi', ['cumin', 'mint', 'salt'], 'Salted lassi with roasted cumin and mint.'),
  lassi('Rose Lassi', ['rose water', 'sugar'], 'Rose-scented lassi.', '🌹'),
  lassi('Banana Lassi', ['banana', 'sugar'], 'Banana and yogurt lassi.', '🍌'),
  dish('Jaljeera', 'North Indian', 'Tangy cumin and mint cooler.', ['cumin', 'mint', 'lemon', 'tamarind', 'chaat masala', 'water'], ['Grind roasted cumin, mint, tamarind and chaat masala.', 'Mix with cold water and lemon.', 'Serve over ice.'], 'Add boondi on top for crunch.', '🥤', 40, [0, 8, 0], 10, 0),
  dish('Aam Panna', 'North Indian', 'Raw mango summer cooler.', ['mango', 'sugar', 'cumin', 'mint', 'water'], ['Boil raw mangoes until soft and scoop out the pulp.@900', 'Blend with sugar, roasted cumin, mint and water.', 'Serve chilled.'], 'Protects against heatstroke, say grandmothers.', '🥭', 90, [0, 22, 0], 10, 15),
  dish('Thandai', 'North Indian', 'Holi milk drink with nuts, fennel and spices.', ['milk', 'almonds', 'fennel seeds', 'black pepper', 'cardamom', 'poppy seeds', 'rose water', 'sugar'], ['Soak and grind the nuts, seeds and spices into a paste.@3600', 'Blend into chilled milk with sugar and rose water.', 'Strain and serve cold.'], 'Make the paste a day ahead.', '🥛', 240, [8, 26, 12], 20, 0),
  dish('Badam Milk', 'North Indian', 'Warm almond and saffron milk.', ['milk', 'almonds', 'saffron', 'cardamom', 'sugar'], ['Soak, peel and grind the almonds.@3600', 'Simmer with milk, saffron, cardamom and sugar.@600', 'Serve warm or chilled.'], 'Great before bed.', '🥛', 230, [9, 24, 11], 10, 10),
  dish('Kesar Doodh', 'North Indian', 'Saffron milk with cardamom and nuts.', ['milk', 'saffron', 'cardamom', 'sugar', 'almonds'], ['Warm the milk with saffron and cardamom.@300', 'Add sugar.', 'Top with chopped almonds.'], 'Soak the saffron first for colour.', '🥛', 180, [8, 20, 8], 5, 5),

  // Soups and pickles
  ...[
    ['Tamatar Shorba', ['tomato', 'ginger', 'cumin', 'black pepper'], 'Spiced tomato soup.', '🍅', [3, 12, 4]],
    ['Dal Shorba', ['lentils', 'ginger', 'cumin', 'lemon'], 'Thin lentil soup with ginger and lemon.', '🥣', [8, 18, 3]],
    ['Palak Shorba', ['spinach', 'garlic', 'cumin', 'black pepper'], 'Garlicky spinach soup.', '🥬', [4, 8, 4]],
    ['Murgh Shorba', ['chicken', 'onion', 'ginger', 'black pepper'], 'Clear spiced chicken soup.', '🍗', [18, 6, 6]],
    ['Mutton Shorba', ['lamb', 'onion', 'ginger', 'black pepper'], 'Warming mutton bone soup.', '🍖', [18, 6, 10]],
  ].map(([title, ing, desc, emoji, macros]) =>
    dish(title as string, 'North Indian', desc as string, [...(ing as string[]), 'bay leaf', 'cilantro', 'ghee', 'water'],
      [`Simmer the ${(ing as string[])[0]} with bay leaf, ginger and spices in water.@${(ing as string[]).some((i) => ['chicken', 'lamb'].includes(i)) ? 2400 : 900}`, 'Strain or blend, then season.', 'Temper with cumin in ghee and add cilantro.@60'],
      'Serve hot as a starter.', emoji as string, 120, macros as M, 10, 30)),
  ...[
    ['Aam ka Achaar', ['mango', 'mustard oil', 'fennel seeds', 'fenugreek seeds', 'mustard seeds', 'chili powder', 'turmeric'], 'Punjabi raw mango pickle.', '🥭'],
    ['Nimbu ka Achaar', ['lemon', 'sugar', 'chili powder', 'cumin'], 'Sweet and sour lemon pickle.', '🍋'],
    ['Gajar Mooli Achaar', ['carrot', 'radish', 'mustard seeds', 'mustard oil', 'chili powder'], 'Winter carrot and radish pickle.', '🥕'],
    ['Hari Mirch Achaar', ['green chili', 'mustard seeds', 'fennel seeds', 'lemon', 'mustard oil'], 'Instant green chili pickle.', '🌶️'],
    ['Pudina Chutney', ['mint', 'cilantro', 'green chili', 'lemon', 'onion'], 'Green mint chutney for chaat and kebabs.', '🌿'],
    ['Imli Chutney', ['tamarind', 'jaggery', 'cumin', 'chili powder'], 'Sweet tamarind chutney for chaat.', '🟤'],
    ['Lahsun Chutney', ['garlic', 'chili powder', 'lemon', 'cumin'], 'Fiery Rajasthani garlic chutney.', '🧄'],
  ].map(([title, ing, desc, emoji]) =>
    dish(title as string, title === 'Lahsun Chutney' ? 'Rajasthani' : 'Punjabi', desc as string, [...(ing as string[])],
      [`Prepare the ${(ing as string[])[0]}: wash, dry and cut as needed.`, 'Mix or grind with the spices and salt.', (title as string).includes('Achaar') ? 'Pack into a clean jar and leave in the sun for a few days.@86400' : 'Chill and serve.'],
      'Use a dry spoon so it keeps.', emoji as string, 50, [1, 8, 2], 15, 0)),

  // Breakfast
  dish('Suji Chilla', 'North Indian', 'Quick semolina pancakes with vegetables.', ['semolina', 'yogurt', 'onion', 'tomato', 'green chili', 'cilantro', 'vegetable oil'], ['Mix semolina and yogurt with water and rest.@900', 'Stir in the chopped vegetables.', 'Spread on a hot pan and cook both sides.@240'], 'A ten-minute breakfast.', '🥞', 220, [6, 32, 7], 15, 10),
  dish('Paneer Chilla', 'North Indian', 'Besan chilla stuffed with paneer.', ['besan', 'paneer', 'onion', 'green chili', 'cilantro', 'vegetable oil'], ['Whisk besan with water and spices.', 'Spread on a hot pan and add crumbled paneer.@120', 'Fold and cook until golden.@120'], 'High protein breakfast.', '🥞', 280, [16, 22, 14], 10, 10),
  dish('Namkeen Dalia', 'North Indian', 'Savory broken wheat porridge with vegetables.', ['oats', 'carrot', 'peas', 'onion', 'tomato', 'cumin', 'ghee'], ['Roast the broken wheat in ghee.@180', 'Add cumin, onion, vegetables and water.', 'Cook until soft.@900'], 'Pressure cook to save time.', '🥣', 240, [8, 38, 6], 10, 20),
  dish('Namkeen Seviyan', 'North Indian', 'Savory vermicelli with vegetables.', ['vermicelli', 'onion', 'peas', 'carrot', 'mustard seeds', 'green chili', 'lemon', 'vegetable oil'], ['Roast vermicelli until golden.@180', 'Fry mustard seeds, onion and vegetables, add water.@300', 'Add vermicelli and cook until absorbed. Finish with lemon.@300'], 'Roast well so it does not stick.', '🍜', 260, [6, 44, 7], 5, 15),
  dish('Bread Upma North Style', 'North Indian', 'Bread cubes tossed with onion, tomato and spices.', ['bread', 'onion', 'tomato', 'cumin', 'chili powder', 'cilantro', 'vegetable oil'], ['Cube the bread.', 'Fry cumin, onion and tomato with chili.@300', 'Toss in the bread until warm.@120'], 'Use day-old bread.', '🍞', 250, [7, 38, 8], 5, 10),

  // Specials
  dish('Amritsari Chole', 'Punjabi', 'Dark, tangy Amritsari chickpeas with pomegranate seed powder.', ['chickpeas', 'tea', 'onion', 'tomato', 'ginger', 'pomegranate', 'amchur', 'garam masala', 'ghee'], ['Boil chickpeas with a tea bag for colour.@2400', 'Cook onion, ginger, tomato and spices in ghee.@720', 'Simmer the chickpeas with the masala and pomegranate powder until thick.@900'], 'Tea gives the dark colour.', '🫘', 340, [14, 44, 12], 15, 70),
  dish('Aloo Tamatar ki Sabzi', 'North Indian', 'Runny potato and tomato curry for puri.', ['potato', 'tomato', 'cumin', 'ginger', 'green chili', 'turmeric', 'chili powder', 'cilantro', 'ghee'], ['Boil and break the potatoes.@900', 'Cook cumin, ginger, chili and tomato in ghee.@360', 'Add the potatoes and water and simmer.@600'], 'Keep it thin and soupy.', '🥔', 200, [4, 30, 7]),
  dish('Gobi Matar', 'North Indian', 'Cauliflower and peas cooked dry with spices.', ['cauliflower', 'peas', 'cumin', 'ginger', 'tomato', 'turmeric', 'coriander powder', 'garam masala', 'vegetable oil'], ['Fry cumin and ginger, add cauliflower and turmeric.@300', 'Add peas, tomato and spices.', 'Cook covered until tender.@720'], 'Do not overcook the cauliflower.', '🥦', 170, [6, 18, 8]),
  dish('Mushroom Matar', 'Punjabi', 'Mushrooms and peas in onion tomato gravy.', ['mushrooms', 'peas', 'onion', 'tomato', 'ginger garlic paste', 'garam masala', 'chili powder', 'heavy cream', 'vegetable oil'], ['Cook onion, ginger garlic paste and tomato with the spices.@720', 'Add mushrooms and peas.', 'Simmer and finish with cream.@600'], 'Sear the mushrooms first for flavour.', '🍄', 200, [7, 16, 12]),
  dish('Methi Matar Malai', 'Mughlai', 'Fenugreek and peas in a creamy white gravy.', ['fenugreek leaves', 'peas', 'onion', 'cashews', 'heavy cream', 'ginger', 'green chili', 'garam masala', 'butter'], ['Grind onion, cashews, ginger and chili and cook in butter.@600', 'Add fenugreek and peas and cook.@480', 'Finish with cream and garam masala.@180'], 'A pinch of sugar tames the methi bitterness.', '🌿', 300, [7, 18, 22]),
  dish('Saag Aloo', 'Punjabi', 'Potatoes cooked in a spiced spinach puree.', ['spinach', 'potato', 'onion', 'garlic', 'ginger', 'green chili', 'garam masala', 'ghee'], ['Blanch and blend the spinach.@180', 'Fry onion, garlic, ginger and the potatoes in ghee.@600', 'Add the spinach and spices and simmer until the potatoes are soft.@600'], 'Use waxy potatoes.', '🥬', 210, [5, 26, 9]),
  dish('Saag Paneer', 'Punjabi', 'Paneer in mixed greens with mustard leaves and spinach.', ['spinach', 'mustard greens', 'paneer', 'garlic', 'ginger', 'green chili', 'cornmeal', 'ghee'], ['Cook the greens with ginger and chili and blend coarsely.@1200', 'Thicken with cornmeal and simmer.@600', 'Add fried paneer and a garlic ghee tadka.@180'], 'Mustard greens give the Punjabi taste.', '🥬', 330, [16, 14, 24]),
  dish('Chicken Patiala', 'Punjabi', 'Rich chicken curry wrapped in thin omelette sheets.', ['chicken', 'egg', 'onion', 'tomato', 'heavy cream', 'cashews', 'ginger garlic paste', 'garam masala', 'butter'], ['Cook the chicken in a rich onion, cashew and tomato gravy with cream.@1800', 'Make thin omelettes.@240', 'Wrap the chicken in omelettes and pour the gravy over.'], 'A royal Patiala dish.', '🍗', 520, [40, 12, 34], 20, 45, 'Medium'),
  dish('Amritsari Murgh', 'Punjabi', 'Amritsar-style chicken in a buttery masala.', ['chicken', 'onion', 'tomato', 'ginger garlic paste', 'yogurt', 'kasuri methi', 'garam masala', 'butter'], ['Marinate chicken in yogurt and spices.@1800', 'Cook onion, tomato and ginger garlic paste in butter.@720', 'Add the chicken and cook until tender with kasuri methi.@1500'], 'Generous butter is the Amritsari way.', '🍗', 430, [34, 12, 28], 15, 40),
  dish('Chicken Nihari', 'Mughlai', 'Slow-cooked Delhi chicken nihari with ginger and lemon.', ['chicken', 'flour', 'ghee', 'onion', 'ginger garlic paste', 'fennel seeds', 'garam masala', 'ginger', 'lemon'], ['Brown the chicken with onion and ginger garlic paste in ghee.@600', 'Add the spices and water and simmer slowly.@3600', 'Thicken with flour and finish with ginger and lemon.@600'], 'Eat with khamiri roti.', '🍲', 450, [34, 12, 30], 20, 80, 'Medium'),
  dish('Saag Gosht', 'Punjabi', 'Mutton slow-cooked with spinach.', ['lamb', 'spinach', 'onion', 'tomato', 'ginger garlic paste', 'garam masala', 'chili powder', 'ghee'], ['Brown the mutton with onion and ginger garlic paste.@900', 'Add tomato and spices and simmer until tender.@2700', 'Add blended spinach and cook until thick.@900'], 'The spinach melts into the gravy.', '🥬', 450, [34, 10, 30], 20, 80, 'Medium'),
  dish('Mutton Keema Matar', 'Punjabi', 'Punjabi minced mutton with peas and ginger.', ['lamb', 'peas', 'onion', 'tomato', 'ginger', 'garam masala', 'chili powder', 'ghee'], ['Brown the mince with onion and ginger.@900', 'Add tomato, spices and peas.', 'Cook until dry.@900'], 'Serve with pav or roti.', '🍖', 420, [30, 12, 28]),
  dish('Kashmiri Mujh Gaad', 'Kashmiri', 'Fish cooked with radish, a Kashmiri winter dish.', ['white fish', 'radish', 'fennel seeds', 'ginger', 'chili powder', 'turmeric', 'mustard oil'], ['Fry the fish in mustard oil.@360', 'Fry the radish slices.@480', 'Simmer together with fennel, ginger and chili in water.@900'], 'Made on Navroz.', '🐟', 320, [26, 10, 18], 15, 35),
  dish('Kashmiri Dum Olav', 'Kashmiri', 'Kashmiri-style dum aloo in a red yogurt gravy.', ['potato', 'yogurt', 'chili powder', 'fennel seeds', 'ginger', 'cardamom', 'mustard oil'], ['Fry pricked small potatoes until golden.@600', 'Whisk yogurt with Kashmiri chili, fennel and ginger.', 'Simmer the potatoes in the gravy until thick.@1200'], 'Kashmiri chili gives colour without heat.', '🥔', 280, [6, 32, 14]),
  dish('Kashmiri Tamatar Chaman', 'Kashmiri', 'Paneer cooked in tomato gravy with Kashmiri spices.', ['paneer', 'tomato', 'fennel seeds', 'ginger', 'chili powder', 'cardamom', 'ghee'], ['Fry the paneer in ghee.@240', 'Cook tomato with the spices to a sauce.@720', 'Simmer the paneer in it.@300'], 'No onion or garlic.', '🧀', 330, [16, 10, 24]),
  dish('Rajasthani Papad ki Sabzi', 'Rajasthani', 'Roasted papad in a spiced yogurt gravy.', ['urad dal', 'yogurt', 'chili powder', 'coriander powder', 'cumin', 'asafoetida', 'ghee'], ['Roast papads and break into pieces.@120', 'Simmer yogurt with the spices until thick.@600', 'Add the papad just before serving.@60'], 'Add the papad at the last minute.', '🥣', 180, [8, 14, 9]),
  dish('Rajasthani Bajre ki Khichdi', 'Rajasthani', 'Pearl millet and moong khichdi with ghee.', ['rice', 'lentils', 'cumin', 'asafoetida', 'ghee'], ['Soak and pound the millet (or use broken rice) and moong.@3600', 'Pressure cook with water and salt until soft.@1500', 'Temper with cumin and asafoetida in ghee.@60'], 'Serve with kadhi and lots of ghee.', '🥣', 300, [11, 48, 8]),
  dish('Bihari Kadhi Bari', 'Bihari', 'Yogurt kadhi with fluffy lentil fritters.', ['yogurt', 'besan', 'urad dal', 'turmeric', 'fenugreek seeds', 'mustard oil'], ['Fry fluffy urad dal baris.@480', 'Simmer yogurt and besan with turmeric until thick.@1200', 'Add the baris and temper with fenugreek seeds in mustard oil.@60'], 'Eat with rice.', '🥣', 320, [12, 26, 18]),
  dish('Bihari Chana Ghugni', 'Bihari', 'Black chickpea ghugni with onion and spices.', ['chickpeas', 'onion', 'ginger garlic paste', 'garam masala', 'chili powder', 'mustard oil'], ['Cook the chickpeas soft.@1800', 'Fry onion and ginger garlic paste in mustard oil with the spices.@600', 'Add chickpeas and cook until thick.@600'], 'Serve with puffed rice.', '🫘', 280, [12, 36, 10]),
  dish('Bihari Litti Masala', 'Bihari', 'Sattu-stuffed baked wheat balls with chokha.', ['flour', 'besan', 'onion', 'garlic', 'lemon', 'mustard oil', 'eggplant', 'potato', 'tomato', 'ghee'], ['Mix roasted gram flour with onion, garlic, lemon and mustard oil and stuff into dough balls.', 'Bake or roast until crisp and dip in ghee.@1500', 'Mash roasted eggplant, potato and tomato for the chokha.@900'], 'Roast over coals for the real taste.', '🟤', 460, [14, 62, 18], 25, 45, 'Medium'),
];
