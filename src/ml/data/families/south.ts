/**
 * South Indian dish families: Tamil poriyal, kootu, sambar and kuzhambu; Kerala thoran,
 * mezhukkupuratti, pachadi, ishtu and theeyal; Karnataka palya, huli, gojju and majjige huli;
 * Andhra kura, vepudu, pulusu, pappu and pachadi; plus tiffin, rice, meat and seafood, snacks and
 * sweets. Each list pairs a method with the vegetables or proteins it is really cooked with.
 */
import { Row } from '../schema';
import { PROTEINS, Protein, Veg, cap, protein, row, veg, vegs } from './common';

const firstStep = (v: Veg, text: string) => (v.firm ? [`${cap(v.prep)}, then par-boil until just tender.@480`, text] : [`${cap(v.prep)}.`, text]);

// ---------- Tamil ----------

const poriyal = (v: Veg): Row =>
  row({
    title: `${v.en} Poriyal`, cuisine: 'Tamil',
    description: `Dry ${v.en.toLowerCase()} stir-fry with mustard seeds, urad dal and fresh coconut.`,
    prep: 10, cook: 12, kcal: 110 + (v.kcal || 0), macros: [3, 10 + (v.carbs || 0), 6], emoji: v.emoji,
    ingredients: [...v.ing, 'coconut', 'mustard seeds', 'urad dal', 'curry leaves', 'green chili', 'vegetable oil', 'salt'],
    steps: [...firstStep(v, 'Fry mustard seeds, urad dal, curry leaves and green chili in oil until the dal turns golden.@60'), `Add the ${v.en.toLowerCase()} and salt, sprinkle a little water, cover and cook until tender.@480`, 'Stir in grated coconut and cook uncovered for a minute.@60'],
    tip: 'Add the coconut at the end so it stays fresh and moist.',
  });

const kootu = (v: Veg): Row =>
  row({
    title: `${v.en} Kootu`, cuisine: 'Tamil',
    description: `${v.en} and moong dal in a mild coconut and cumin gravy.`,
    prep: 10, cook: 25, kcal: 170 + (v.kcal || 0), macros: [8, 22 + (v.carbs || 0), 6], emoji: v.emoji,
    ingredients: [...v.ing, 'lentils', 'coconut', 'cumin', 'green chili', 'turmeric', 'mustard seeds', 'curry leaves', 'vegetable oil'],
    steps: [`${cap(v.prep)}.`, `Cook the lentils with turmeric until soft, then add the ${v.en.toLowerCase()} and cook until tender.@1200`, 'Grind coconut, cumin and green chili to a paste, stir in and simmer.@300', 'Temper with mustard seeds and curry leaves and pour over.@60'],
    tip: 'Kootu should be thick enough to eat with rice, not runny.',
  });

const sambar = (v: Veg): Row =>
  row({
    title: `${v.en} Sambar`, cuisine: 'Tamil',
    description: `Toor dal and tamarind sambar with ${v.en.toLowerCase()}.`,
    prep: 15, cook: 35, kcal: 200 + (v.kcal || 0), macros: [10, 30 + (v.carbs || 0), 5], emoji: '🥘',
    ingredients: [...v.ing, 'lentils', 'tamarind', 'onion', 'tomato', 'sambar powder', 'turmeric', 'mustard seeds', 'fenugreek seeds', 'curry leaves', 'asafoetida', 'vegetable oil', 'cilantro'],
    steps: [`${cap(v.prep)}.`, 'Cook the lentils with turmeric until mushy and mash.@1200', `Cook the ${v.en.toLowerCase()}, onion and tomato in tamarind water with sambar powder until tender.@720`, 'Add the dal, simmer, and temper with mustard and fenugreek seeds, curry leaves and asafoetida. Add cilantro.@300'],
    tip: 'Sambar thickens as it stands; loosen with hot water before serving.',
  });

const puliKuzhambu = (v: Veg): Row =>
  row({
    title: `${v.en} Puli Kuzhambu`, cuisine: 'Tamil',
    description: `Tangy tamarind gravy with ${v.en.toLowerCase()}, cooked in sesame oil.`,
    prep: 10, cook: 25, kcal: 180 + (v.kcal || 0), macros: [3, 18 + (v.carbs || 0), 11], emoji: v.emoji,
    ingredients: [...v.ing, 'tamarind', 'onion', 'garlic', 'sambar powder', 'jaggery', 'mustard seeds', 'fenugreek seeds', 'curry leaves', 'vegetable oil'],
    steps: [`${cap(v.prep)}.`, `Fry mustard and fenugreek seeds, curry leaves, garlic and onion, then add the ${v.en.toLowerCase()} and fry.@420`, 'Add sambar powder, tamarind water and a pinch of jaggery and simmer until thick and the oil floats.@1080'],
    tip: 'It keeps for two days and tastes better on the second.',
  });

const morKuzhambu = (v: Veg): Row =>
  row({
    title: `${v.en} Mor Kuzhambu`, cuisine: 'Tamil',
    description: `Buttermilk curry with ${v.en.toLowerCase()}, coconut and green chili.`,
    prep: 10, cook: 15, kcal: 150 + (v.kcal || 0), macros: [5, 12 + (v.carbs || 0), 8], emoji: '🥣',
    ingredients: [...v.ing, 'buttermilk', 'coconut', 'green chili', 'cumin', 'ginger', 'turmeric', 'mustard seeds', 'curry leaves', 'coconut oil'],
    steps: [...firstStep(v, 'Grind coconut, green chili, cumin and ginger to a smooth paste.'), `Cook the ${v.en.toLowerCase()} with turmeric, stir in the paste and buttermilk and warm gently.@480`, 'Temper with mustard seeds and curry leaves in coconut oil.@60'],
    tip: 'Never let it boil after the buttermilk goes in.',
  });

const thogayal = (name: string, ing: string[], emoji: string): Row =>
  row({
    title: `${name} Thogayal`, cuisine: 'Tamil',
    description: `Thick roasted ${name.toLowerCase()} relish ground with urad dal and tamarind.`,
    prep: 5, cook: 10, kcal: 80, macros: [3, 8, 4], emoji,
    ingredients: [...ing, 'urad dal', 'tamarind', 'green chili', 'coconut', 'vegetable oil', 'salt'],
    steps: [`Roast urad dal and green chili in oil, then add the ${name.toLowerCase()} and cook until soft.@300`, 'Cool and grind coarsely with tamarind, coconut and salt.', 'Serve with rice and a spoon of ghee.'],
    tip: 'Grind it coarse; thogayal is thicker than chutney.',
  });

const kadaiyal = (v: Veg): Row =>
  row({
    title: `${v.en} Paruppu Kadaiyal`, cuisine: 'Tamil',
    description: `${v.en} mashed with moong dal, garlic and cumin.`,
    prep: 10, cook: 20, kcal: 150, macros: [9, 18, 4], emoji: v.emoji,
    ingredients: [...v.ing, 'lentils', 'garlic', 'cumin', 'green chili', 'tomato', 'mustard seeds', 'vegetable oil'],
    steps: [`${cap(v.prep)}.`, `Cook lentils with the ${v.en.toLowerCase()}, garlic, tomato and green chili until soft.@1200`, 'Mash well and temper with mustard seeds and cumin.@60'],
    tip: 'Mix with hot rice and ghee.',
  });

// ---------- Kerala ----------

const thoran = (v: Veg): Row =>
  row({
    title: `${v.en} Thoran`, cuisine: 'Kerala',
    description: `Kerala stir-fry of ${v.en.toLowerCase()} with crushed coconut, garlic and curry leaves.`,
    prep: 10, cook: 12, kcal: 120 + (v.kcal || 0), macros: [3, 10 + (v.carbs || 0), 7], emoji: v.emoji,
    ingredients: [...v.ing, 'coconut', 'garlic', 'green chili', 'turmeric', 'cumin', 'mustard seeds', 'curry leaves', 'coconut oil'],
    steps: [...firstStep(v, 'Crush coconut, garlic, green chili, cumin and turmeric together coarsely.'), 'Splutter mustard seeds and curry leaves in coconut oil.@60', `Add the ${v.en.toLowerCase()} and the coconut mix, cover and cook on low heat until tender, stirring now and then.@480`],
    tip: 'Crush the coconut by pulsing; it should not become a paste.',
  });

const mezhukkupuratti = (v: Veg): Row =>
  row({
    title: `${v.en} Mezhukkupuratti`, cuisine: 'Kerala',
    description: `${v.en} sautéed in coconut oil with shallots and crushed chili.`,
    prep: 10, cook: 15, kcal: 140 + (v.kcal || 0), macros: [2, 14 + (v.carbs || 0), 8], emoji: v.emoji,
    ingredients: [...v.ing, 'onion', 'garlic', 'chili powder', 'turmeric', 'curry leaves', 'coconut oil', 'salt'],
    steps: [...firstStep(v, 'Slice the onion and crush the garlic.'), 'Fry the onion, garlic and curry leaves in coconut oil until golden.@240', `Add the ${v.en.toLowerCase()}, turmeric and chili powder and roast until well coated and slightly crisp.@600`],
    tip: 'Mezhukku means oil; be generous with good coconut oil.',
  });

const keralaPachadi = (name: string, ing: string[], emoji: string): Row =>
  row({
    title: `Kerala ${name} Pachadi`, cuisine: 'Kerala',
    description: `Sadya-style yogurt curry with ${name.toLowerCase()} and mustard-coconut paste.`,
    prep: 10, cook: 10, kcal: 130, macros: [4, 14, 7], emoji,
    ingredients: [...ing, 'yogurt', 'coconut', 'mustard seeds', 'green chili', 'ginger', 'curry leaves', 'coconut oil'],
    steps: [`Cook the ${name.toLowerCase()} with a little water and salt until soft.@360`, 'Grind coconut, green chili, ginger and a few mustard seeds and stir in.@120', 'Take off the heat, stir in whisked yogurt and temper with mustard seeds and curry leaves.@60'],
    tip: 'Add the yogurt off the heat.',
  });

const ishtu = (name: string, ing: string[], emoji: string, hp = 0): Row =>
  row({
    title: `${name} Ishtu`, cuisine: 'Kerala',
    description: `Mild Kerala stew of ${name.toLowerCase()} in coconut milk with whole spices.`,
    prep: 15, cook: 25, kcal: 260 + hp * 6, macros: [6 + hp, 18, 18], emoji,
    ingredients: [...ing, 'coconut milk', 'onion', 'ginger', 'green chili', 'cinnamon', 'cloves', 'cardamom', 'curry leaves', 'coconut oil'],
    steps: [`Fry whole spices, onion, ginger, green chili and curry leaves in coconut oil without browning.@240`, `Add the ${name.toLowerCase()} with thin coconut milk and simmer until cooked.@900`, 'Pour in thick coconut milk and warm through without boiling.@120'],
    tip: 'Serve with appam or idiyappam.',
  });

const theeyal = (v: Veg): Row =>
  row({
    title: `${v.en} Theeyal`, cuisine: 'Kerala',
    description: `${v.en} in a dark roasted-coconut and tamarind gravy.`,
    prep: 15, cook: 30, kcal: 210, macros: [4, 18, 14], emoji: v.emoji,
    ingredients: [...v.ing, 'coconut', 'coriander powder', 'chili powder', 'tamarind', 'onion', 'fenugreek seeds', 'curry leaves', 'coconut oil', 'mustard seeds'],
    steps: [`${cap(v.prep)}.`, 'Roast coconut slowly until deep brown, add coriander and chili powders and fenugreek and grind to a paste.@600', `Cook the ${v.en.toLowerCase()} and onion in tamarind water, add the paste and simmer until thick. Temper with mustard seeds and curry leaves.@900`],
    tip: 'Roast the coconut until it is the colour of chocolate, not black.',
  });

// ---------- Karnataka ----------

const palya = (v: Veg): Row =>
  row({
    title: `${v.en} Palya`, cuisine: 'Karnataka',
    description: `Karnataka-style ${v.en.toLowerCase()} stir-fry with chana dal, coconut and a touch of jaggery.`,
    prep: 10, cook: 12, kcal: 120 + (v.kcal || 0), macros: [4, 12 + (v.carbs || 0), 6], emoji: v.emoji,
    ingredients: [...v.ing, 'chana dal', 'coconut', 'mustard seeds', 'curry leaves', 'green chili', 'jaggery', 'lemon', 'vegetable oil'],
    steps: [...firstStep(v, 'Fry mustard seeds, chana dal, curry leaves and green chili in oil.@90'), `Add the ${v.en.toLowerCase()} with salt and a pinch of jaggery, cover and cook until tender.@480`, 'Finish with coconut and a squeeze of lemon.'],
    tip: 'A pinch of jaggery is the Karnataka signature.',
  });

const huli = (v: Veg): Row =>
  row({
    title: `${v.en} Huli`, cuisine: 'Karnataka',
    description: `Karnataka sambar with ${v.en.toLowerCase()}, freshly ground coconut masala and jaggery.`,
    prep: 15, cook: 35, kcal: 210 + (v.kcal || 0), macros: [10, 30 + (v.carbs || 0), 6], emoji: '🥘',
    ingredients: [...v.ing, 'lentils', 'coconut', 'coriander powder', 'chili powder', 'tamarind', 'jaggery', 'mustard seeds', 'curry leaves', 'vegetable oil'],
    steps: [`${cap(v.prep)}.`, 'Cook the lentils until soft.@1200', `Cook the ${v.en.toLowerCase()} in tamarind water with jaggery, add a paste of coconut, coriander and chili and the dal and simmer.@720`, 'Temper with mustard seeds and curry leaves.@60'],
    tip: 'Huli is slightly sweeter and thicker than Tamil sambar.',
  });

const gojju = (name: string, ing: string[], emoji: string): Row =>
  row({
    title: `${name} Gojju`, cuisine: 'Karnataka',
    description: `Sweet, sour and spicy Karnataka gojju with ${name.toLowerCase()}.`,
    prep: 10, cook: 20, kcal: 150, macros: [2, 22, 6], emoji,
    ingredients: [...ing, 'tamarind', 'jaggery', 'sambar powder', 'sesame seeds', 'mustard seeds', 'curry leaves', 'vegetable oil'],
    steps: [`Cook the ${name.toLowerCase()} in oil until soft.@360`, 'Add tamarind water, jaggery and sambar powder and simmer until thick.@600', 'Stir in roasted sesame powder and temper with mustard seeds and curry leaves.@60'],
    tip: 'Balance sweet and sour to your taste with jaggery and tamarind.',
  });

const majjigeHuli = (v: Veg): Row =>
  row({
    title: `${v.en} Majjige Huli`, cuisine: 'Karnataka',
    description: `Karnataka buttermilk curry with ${v.en.toLowerCase()} and coconut.`,
    prep: 10, cook: 15, kcal: 150, macros: [6, 12, 8], emoji: '🥣',
    ingredients: [...v.ing, 'buttermilk', 'coconut', 'chana dal', 'green chili', 'ginger', 'mustard seeds', 'curry leaves', 'vegetable oil'],
    steps: [...firstStep(v, 'Soak chana dal and grind with coconut, green chili and ginger.'), `Cook the ${v.en.toLowerCase()} until soft, then stir in the paste and buttermilk and heat gently.@480`, 'Temper with mustard seeds and curry leaves.@60'],
    tip: 'Do not boil after the buttermilk goes in.',
  });

// ---------- Andhra ----------

const kura = (v: Veg): Row =>
  row({
    title: `${v.te} Kura`, cuisine: 'Andhra',
    description: `Andhra-style ${v.en.toLowerCase()} curry with onion, tomato and red chili.`,
    prep: 10, cook: 20, kcal: 160 + (v.kcal || 0), macros: [4, 16 + (v.carbs || 0), 9], emoji: v.emoji,
    ingredients: [...v.ing, 'onion', 'tomato', 'chili powder', 'coriander powder', 'turmeric', 'ginger garlic paste', 'mustard seeds', 'curry leaves', 'vegetable oil'],
    steps: [`${cap(v.prep)}.`, 'Fry mustard seeds, curry leaves and onion, then add ginger garlic paste and tomato and cook down.@480', `Add the ${v.en.toLowerCase()}, chili, coriander and turmeric with a splash of water and cook until tender.@720`],
    tip: 'Andhra curries are hot; go easy on the chili if you prefer.',
  });

const vepudu = (v: Veg): Row =>
  row({
    title: `${v.te} Vepudu`, cuisine: 'Andhra',
    description: `Crisp Andhra fry of ${v.en.toLowerCase()} with red chili and garlic.`,
    prep: 10, cook: 15, kcal: 170 + (v.kcal || 0), macros: [3, 16 + (v.carbs || 0), 11], emoji: v.emoji,
    ingredients: [...v.ing, 'chili powder', 'garlic', 'cumin', 'turmeric', 'mustard seeds', 'curry leaves', 'peanuts', 'vegetable oil'],
    steps: [...firstStep(v, 'Crush garlic and cumin together.'), 'Fry mustard seeds, curry leaves and peanuts in oil.@60', `Add the ${v.en.toLowerCase()} with turmeric and fry uncovered until crisp, then add the garlic mix and chili powder.@720`],
    tip: 'Fry uncovered so it crisps instead of steaming.',
  });

const pulusu = (v: Veg): Row =>
  row({
    title: `${v.te} Pulusu`, cuisine: 'Andhra',
    description: `Sweet-sour tamarind stew with ${v.en.toLowerCase()}.`,
    prep: 10, cook: 25, kcal: 150 + (v.kcal || 0), macros: [3, 22 + (v.carbs || 0), 6], emoji: v.emoji,
    ingredients: [...v.ing, 'tamarind', 'onion', 'jaggery', 'chili powder', 'turmeric', 'rice flour', 'mustard seeds', 'fenugreek seeds', 'curry leaves', 'vegetable oil'],
    steps: [`${cap(v.prep)}.`, `Fry mustard and fenugreek seeds, curry leaves and onion, then add the ${v.en.toLowerCase()}.@300`, 'Add tamarind water, jaggery, chili and turmeric and simmer until tender, then thicken with a little rice flour in water.@900'],
    tip: 'Pulusu should be pourable over hot rice.',
  });

const pappu = (v: Veg): Row =>
  row({
    title: `${v.te} Pappu`, cuisine: 'Andhra',
    description: `Andhra dal cooked with ${v.en.toLowerCase()} and a garlic tempering.`,
    prep: 10, cook: 25, kcal: 210, macros: [12, 30, 5], emoji: '🥣',
    ingredients: [...v.ing, 'lentils', 'green chili', 'tamarind', 'turmeric', 'garlic', 'mustard seeds', 'cumin', 'curry leaves', 'ghee'],
    steps: [`${cap(v.prep)}.`, `Cook the lentils with the ${v.en.toLowerCase()}, green chili, turmeric and a little tamarind until soft.@1200`, 'Mash lightly and temper with mustard seeds, cumin, garlic and curry leaves in ghee.@90'],
    tip: 'Eat with hot rice, ghee and a fry on the side.',
  });

const andhraPachadi = (v: Veg): Row =>
  row({
    title: `${v.te} Pachadi`, cuisine: 'Andhra',
    description: `Andhra chutney of roasted ${v.en.toLowerCase()} with chili, tamarind and garlic.`,
    prep: 5, cook: 12, kcal: 90, macros: [2, 10, 5], emoji: v.emoji,
    ingredients: [...v.ing, 'green chili', 'tamarind', 'garlic', 'cumin', 'mustard seeds', 'urad dal', 'vegetable oil', 'salt'],
    steps: [`Roast green chili, then the ${v.en.toLowerCase()} in oil until soft.@420`, 'Grind coarsely with tamarind, garlic, cumin and salt.', 'Temper with mustard seeds and urad dal.@60'],
    tip: 'Use a stone mortar for the best texture.',
  });

// ---------- Proteins ----------

interface Style { name: string; cuisine: string; desc: (p: Protein) => string; ing: string[]; steps: (p: Protein) => string[]; carbs: number; extraFat: number; tip: string; emoji?: string }

const S_STYLES: Style[] = [
  { name: 'Pepper Fry', cuisine: 'Tamil', desc: (p) => `${p.en} tossed dry with crushed black pepper, fennel and curry leaves.`, ing: ['black pepper', 'fennel seeds', 'onion', 'ginger garlic paste', 'curry leaves', 'turmeric', 'vegetable oil'], carbs: 6, extraFat: 4, tip: 'Crush the pepper fresh just before adding.',
    steps: (p) => [`${cap(p.prep)} and toss with turmeric and salt.`, 'Fry onion, curry leaves and ginger garlic paste until golden.@420', `Add the ${p.en.toLowerCase()}, cook until done, then add crushed pepper and fennel and fry until dry.@${p.cookMin * 60}`] },
  { name: 'Roast', cuisine: 'Kerala', desc: (p) => `Kerala-style ${p.en.toLowerCase()} roast, slow-cooked with onions until dark and glossy.`, ing: ['onion', 'tomato', 'ginger', 'garlic', 'chili powder', 'coriander powder', 'garam masala', 'curry leaves', 'coconut oil'], carbs: 10, extraFat: 6, tip: 'Patience: let the onions caramelise fully.',
    steps: (p) => [`${cap(p.prep)}.`, 'Cook sliced onion, ginger, garlic and curry leaves in coconut oil until deep brown.@900', `Add tomato and the spices, then the ${p.en.toLowerCase()}, and roast until thick and the masala clings.@${p.cookMin * 60}`] },
  { name: 'Sukka', cuisine: 'Mangalorean', desc: (p) => `Dry Mangalorean ${p.en.toLowerCase()} with roasted coconut and spices.`, ing: ['coconut', 'coriander powder', 'cumin', 'black pepper', 'onion', 'tamarind', 'ghee', 'curry leaves'], carbs: 8, extraFat: 8, tip: 'Roast the coconut slowly until golden and fragrant.',
    steps: (p) => [`${cap(p.prep)}.`, 'Roast coconut with coriander, cumin and pepper and grind coarsely.@300', `Cook the ${p.en.toLowerCase()} with onion and curry leaves in ghee, add the coconut mix and tamarind and cook until dry.@${p.cookMin * 60}`] },
  { name: 'Ghee Roast', cuisine: 'Mangalorean', desc: (p) => `Fiery red Mangalorean ${p.en.toLowerCase()} roasted in ghee.`, ing: ['ghee', 'chili powder', 'coriander powder', 'cumin', 'black pepper', 'garlic', 'tamarind', 'yogurt', 'curry leaves'], carbs: 6, extraFat: 12, tip: 'Use Byadgi chilies for colour without too much heat.',
    steps: (p) => [`${cap(p.prep)} and marinate with yogurt and salt.@900`, 'Roast the spices and garlic and grind with tamarind to a paste.@240', `Cook the ${p.en.toLowerCase()} in plenty of ghee, add the paste and roast until the ghee separates. Add curry leaves.@${p.cookMin * 60}`] },
  { name: 'Varuval', cuisine: 'Tamil', desc: (p) => `Tamil ${p.en.toLowerCase()} varuval, spicy and semi-dry.`, ing: ['onion', 'tomato', 'ginger garlic paste', 'chili powder', 'coriander powder', 'fennel seeds', 'curry leaves', 'vegetable oil'], carbs: 8, extraFat: 6, tip: 'Finish on high heat for crisp edges.',
    steps: (p) => [`${cap(p.prep)}.`, 'Fry fennel, curry leaves and onion, add ginger garlic paste and tomato and cook down.@480', `Add the ${p.en.toLowerCase()} and the spices and cook until dry and coated.@${p.cookMin * 60}`] },
  { name: 'Kuzhambu', cuisine: 'Tamil', desc: (p) => `Tamil ${p.en.toLowerCase()} kuzhambu in a coconut and tamarind gravy.`, ing: ['coconut', 'tamarind', 'onion', 'tomato', 'chili powder', 'coriander powder', 'fennel seeds', 'curry leaves', 'vegetable oil'], carbs: 10, extraFat: 6, tip: 'Even better with rice the next day.',
    steps: (p) => [`${cap(p.prep)}.`, 'Fry onion and curry leaves, add tomato and the spices and cook down.@480', `Add tamarind water and a paste of coconut and fennel, then the ${p.en.toLowerCase()}, and simmer until cooked.@${p.cookMin * 60}`] },
  { name: 'Pulusu', cuisine: 'Andhra', desc: (p) => `Andhra ${p.en.toLowerCase()} in a tangy tamarind stew.`, ing: ['tamarind', 'onion', 'tomato', 'chili powder', 'coriander powder', 'fenugreek seeds', 'turmeric', 'curry leaves', 'vegetable oil'], carbs: 12, extraFat: 4, tip: 'Rest it for an hour before eating.',
    steps: (p) => [`${cap(p.prep)}.`, 'Fry fenugreek seeds, curry leaves and onion, add tomato and the spices.@480', `Add tamarind water and simmer, then the ${p.en.toLowerCase()}, and cook gently.@${p.cookMin * 60}`] },
  { name: 'Iguru', cuisine: 'Andhra', desc: (p) => `Thick, spicy Andhra ${p.en.toLowerCase()} iguru.`, ing: ['onion', 'ginger garlic paste', 'chili powder', 'garam masala', 'turmeric', 'curry leaves', 'cilantro', 'vegetable oil'], carbs: 8, extraFat: 6, tip: 'Cook until the masala is thick and clinging.',
    steps: (p) => [`${cap(p.prep)}.`, 'Fry onion until brown, add ginger garlic paste, chili, turmeric and curry leaves.@480', `Add the ${p.en.toLowerCase()} and cook until the masala is thick, then add garam masala and cilantro.@${p.cookMin * 60}`] },
  { name: 'Moilee', cuisine: 'Kerala', desc: (p) => `Kerala ${p.en.toLowerCase()} moilee in turmeric coconut milk.`, ing: ['coconut milk', 'onion', 'ginger', 'green chili', 'turmeric', 'tomato', 'curry leaves', 'coconut oil'], carbs: 10, extraFat: 10, tip: 'Keep it mild and golden.',
    steps: (p) => [`${cap(p.prep)}.`, 'Cook onion, ginger, green chili and curry leaves in coconut oil without browning, add turmeric.@300', `Add thin coconut milk and the ${p.en.toLowerCase()} and simmer, then thick coconut milk and tomato.@${p.cookMin * 60}`] },
  { name: 'Chettinad Curry', cuisine: 'Chettinad', desc: (p) => `${p.en} in a fiery Chettinad gravy of roasted spices and coconut.`, ing: ['coconut', 'black pepper', 'fennel seeds', 'cinnamon', 'cloves', 'onion', 'tomato', 'ginger garlic paste', 'curry leaves', 'vegetable oil'], carbs: 10, extraFat: 8, tip: 'Roast the spices until they darken.',
    steps: (p) => [`${cap(p.prep)}.`, 'Roast coconut, pepper, fennel, cinnamon and cloves and grind.@300', `Fry onion, ginger garlic paste and tomato, add the ${p.en.toLowerCase()} and the paste and simmer.@${p.cookMin * 60}`] },
  { name: 'Fry', cuisine: 'Andhra', desc: (p) => `Andhra ${p.en.toLowerCase()} fry, spicy and crisp.`, ing: ['chili powder', 'ginger garlic paste', 'turmeric', 'lemon', 'rice flour', 'curry leaves', 'vegetable oil'], carbs: 6, extraFat: 8, tip: 'Rice flour gives a crisp coat.',
    steps: (p) => [`${cap(p.prep)} and marinate with chili, ginger garlic paste, turmeric, lemon and rice flour.@1200`, `Shallow-fry the ${p.en.toLowerCase()} with curry leaves until crisp and cooked.@${Math.max(8, p.cookMin) * 60}`] },
  { name: 'Mappas', cuisine: 'Kerala', desc: (p) => `Syrian Christian ${p.en.toLowerCase()} mappas with coconut milk and vinegar.`, ing: ['coconut milk', 'onion', 'ginger', 'garlic', 'coriander powder', 'black pepper', 'vinegar', 'curry leaves', 'coconut oil'], carbs: 10, extraFat: 10, tip: 'A dash of vinegar balances the rich coconut milk.',
    steps: (p) => [`${cap(p.prep)}.`, 'Fry onion, ginger, garlic and curry leaves in coconut oil, add coriander and pepper.@420', `Add the ${p.en.toLowerCase()} with coconut milk and vinegar and simmer until cooked.@${p.cookMin * 60}`] },
];

// Which protein goes with which style (skipping pairings that are not really cooked)
const S_PAIRS: Record<string, string[]> = {
  'Pepper Fry': ['chicken', 'mutton', 'prawn', 'egg', 'mushroom', 'crab', 'paneer'],
  Roast: ['chicken', 'mutton', 'egg', 'mushroom', 'fish'],
  Sukka: ['chicken', 'mutton', 'egg', 'mushroom', 'crab'],
  'Ghee Roast': ['mutton', 'prawn', 'egg', 'mushroom', 'paneer', 'crab', 'fish'],
  Varuval: ['chicken', 'mutton', 'egg', 'mushroom', 'prawn'],
  Kuzhambu: ['mutton', 'prawn', 'crab', 'mushroom'],
  Pulusu: ['chicken', 'prawn', 'egg', 'crab'],
  Iguru: ['chicken', 'mutton', 'egg', 'mushroom'],
  Moilee: ['prawn', 'egg', 'chicken', 'mushroom'],
  'Chettinad Curry': ['prawn', 'crab', 'paneer', 'fish'],
  Fry: ['chicken', 'mutton', 'prawn', 'paneer', 'mushroom'],
  Mappas: ['chicken', 'fish', 'egg', 'mutton'],
};

const proteinDish = (s: Style, p: Protein): Row => {
  const title = s.name === 'Chettinad Curry' ? `Chettinad ${p.en} Curry` : s.name === 'Fry' ? `Andhra ${p.en} Fry` : `${p.en} ${s.name}`;
  return row({
    title, cuisine: s.cuisine, description: s.desc(p),
    difficulty: p.cookMin >= 45 ? 'Medium' : 'Easy',
    prep: 15, cook: p.cookMin + 10, kcal: p.kcal + 120, macros: [p.protein, s.carbs, p.fat + s.extraFat], emoji: p.emoji,
    ingredients: [...p.ing, ...s.ing, 'salt'], steps: s.steps(p), tip: s.tip,
  });
};

// ---------- Tiffin, rice, snacks, sweets ----------

interface Simple { title: string; cuisine: string; desc: string; ing: string[]; steps: string[]; tip: string; emoji: string; kcal: number; macros: [number, number, number]; prep: number; cook: number; difficulty?: 'Easy' | 'Medium' | 'Hard' }
const simple = (s: Simple): Row => row({ title: s.title, cuisine: s.cuisine, description: s.desc, prep: s.prep, cook: s.cook, kcal: s.kcal, macros: s.macros, emoji: s.emoji, ingredients: s.ing, steps: s.steps, tip: s.tip, difficulty: s.difficulty });

const DOSA_BATTER = ['rice', 'urad dal', 'fenugreek seeds', 'salt'];
const dosa = (name: string, cuisine: string, desc: string, extra: string[], topping: string, tip: string, emoji = '🥞', kcal = 260, protein = 7): Row =>
  simple({ title: name, cuisine, desc, ing: [...DOSA_BATTER, ...extra, 'vegetable oil'], prep: 15, cook: 15, kcal, macros: [protein, 40, 8], emoji, tip,
    steps: ['Use fermented dosa batter made from soaked, ground rice, urad dal and fenugreek seeds.', 'Spread a ladle of batter thin on a hot pan and drizzle oil around the edge.@60', `${cap(topping)}, then cook until the base is golden and crisp and fold.@120`] });

const DOSAS: Row[] = [
  dosa('Onion Dosa', 'Tamil', 'Crisp dosa topped with chopped onion and green chili.', ['onion', 'green chili', 'cilantro'], 'scatter chopped onion, green chili and cilantro over the top', 'Press the onion in gently so it sticks.'),
  dosa('Ghee Roast Dosa', 'Tamil', 'Paper-thin golden dosa roasted in ghee.', ['ghee'], 'brush generously with ghee', 'Spread it as thin as you can.'),
  dosa('Paper Dosa', 'Tamil', 'Huge, wafer-thin crisp dosa.', ['ghee'], 'spread very thin with the back of the ladle and drizzle ghee', 'A well-seasoned pan is the secret.'),
  dosa('Mysore Masala Dosa', 'Karnataka', 'Dosa spread with red garlic chutney and filled with potato masala.', ['garlic', 'chili powder', 'potato', 'onion', 'mustard seeds', 'turmeric', 'butter'], 'spread red garlic chutney on top and add a scoop of potato masala', 'Make the red chutney thick so it does not run.', '🥞', 340, 8),
  dosa('Set Dosa', 'Karnataka', 'Soft, spongy small dosas served in sets of three.', ['poha', 'butter'], 'pour thick and small, do not spread thin, and cover', 'Add soaked poha to the batter for softness.'),
  dosa('Egg Dosa', 'Tamil', 'Dosa with a beaten egg cooked on top.', ['egg', 'onion', 'black pepper'], 'pour a beaten egg with onion and pepper over the dosa and spread', 'Cover for a minute so the egg sets.', '🍳', 320, 13),
  dosa('Cheese Dosa', 'Karnataka', 'Dosa loaded with melting grated cheese.', ['cheddar', 'butter'], 'sprinkle grated cheese and dot with butter', 'Fold as soon as the cheese melts.', '🧀', 360, 12),
  dosa('Paneer Dosa', 'Karnataka', 'Dosa stuffed with spiced crumbled paneer.', ['paneer', 'onion', 'tomato', 'garam masala'], 'spread spiced paneer bhurji on top', 'Keep the paneer filling dry.', '🧀', 360, 15),
  dosa('Podi Dosa', 'Tamil', 'Dosa dusted with spicy idli podi and ghee.', ['chana dal', 'sesame seeds', 'chili powder', 'ghee'], 'sprinkle idli podi and drizzle ghee', 'Tamil temple-street favourite.'),
  dosa('Tomato Onion Uttapam', 'Tamil', 'Thick uttapam topped with tomato and onion.', ['tomato', 'onion', 'green chili', 'cilantro'], 'pour thick, then press tomato, onion and chili into the top', 'Cook on medium heat so the middle cooks through.'),
  dosa('Podi Uttapam', 'Tamil', 'Thick uttapam with gunpowder and ghee.', ['chana dal', 'sesame seeds', 'chili powder', 'ghee'], 'pour thick and sprinkle podi on top', 'Flip once for a crisp top.'),
  dosa('Carrot Uttapam', 'Tamil', 'Thick uttapam topped with grated carrot and coriander.', ['carrot', 'onion', 'cilantro', 'green chili'], 'pour thick and scatter grated carrot, onion and coriander', 'Kids love the colour.'),
  dosa('Cheese Onion Uttapam', 'Karnataka', 'Thick uttapam with onion and melted cheese.', ['onion', 'cheddar', 'green chili'], 'pour thick, add onion and cheese and cover', 'Cover so the cheese melts.', '🧀', 340, 11),
  dosa('Spring Dosa', 'Karnataka', 'Dosa filled with stir-fried noodles and vegetables.', ['noodles', 'cabbage', 'carrot', 'bell pepper', 'soy sauce'], 'spread stir-fried noodles and vegetables on top and roll', 'A Mumbai-Bangalore street favourite.', '🥞', 380, 9),
];

const otherDosas: Row[] = [
  simple({ title: 'Ragi Dosa', cuisine: 'Karnataka', desc: 'Instant finger millet dosa, crisp and earthy.', ing: ['rice flour', 'semolina', 'onion', 'green chili', 'cumin', 'curry leaves', 'buttermilk', 'vegetable oil'], prep: 10, cook: 15, kcal: 220, macros: [6, 36, 6], emoji: '🥞', tip: 'Ragi flour is traditional; pour the batter from a height for lace.',
    steps: ['Mix the flours with buttermilk and water into a thin batter and rest.@900', 'Stir in onion, green chili, cumin and curry leaves.', 'Pour onto a very hot pan, drizzle oil and cook until crisp.@180'] }),
  simple({ title: 'Wheat Dosa', cuisine: 'Tamil', desc: 'Instant whole wheat dosa with onion and cumin.', ing: ['flour', 'rice flour', 'onion', 'green chili', 'cumin', 'curry leaves', 'vegetable oil'], prep: 5, cook: 15, kcal: 230, macros: [7, 38, 6], emoji: '🥞', tip: 'Thin batter makes lacy dosas.',
    steps: ['Whisk the flours with water into a thin batter.', 'Stir in onion, green chili, cumin and curry leaves.', 'Pour onto a hot pan, drizzle oil and cook until crisp.@180'] }),
  simple({ title: 'Oats Dosa', cuisine: 'Karnataka', desc: 'Quick oats and semolina dosa.', ing: ['oats', 'semolina', 'rice flour', 'yogurt', 'onion', 'green chili', 'cumin', 'vegetable oil'], prep: 15, cook: 15, kcal: 230, macros: [8, 34, 7], emoji: '🥞', tip: 'Grind the oats fine first.',
    steps: ['Grind the oats and mix with semolina, rice flour, yogurt and water.@900', 'Stir in onion, green chili and cumin.', 'Pour thin onto a hot pan and cook until crisp.@180'] }),
  simple({ title: 'Moong Dal Dosa', cuisine: 'Andhra', desc: 'High-protein yellow moong dal dosa.', ing: ['lentils', 'ginger', 'green chili', 'cumin', 'onion', 'vegetable oil'], prep: 10, cook: 15, kcal: 220, macros: [13, 30, 5], emoji: '🥞', tip: 'Soak the dal for at least two hours.',
    steps: ['Soak the lentils and grind with ginger, green chili and cumin.@7200', 'Spread thin on a hot pan, sprinkle onion and drizzle oil.@60', 'Cook until crisp and fold.@120'] }),
  simple({ title: 'Rava Onion Dosa', cuisine: 'Tamil', desc: 'Lacy semolina dosa loaded with onion.', ing: ['semolina', 'rice flour', 'flour', 'onion', 'green chili', 'cumin', 'black pepper', 'curry leaves', 'vegetable oil'], prep: 10, cook: 15, kcal: 250, macros: [5, 38, 8], emoji: '🥞', tip: 'Stir the batter before every dosa.',
    steps: ['Mix the flours with water into a thin batter and rest.@1200', 'Pour from a height onto a hot pan and scatter lots of onion.', 'Drizzle oil and cook until golden and crisp.@180'] }),
  simple({ title: 'Kal Dosa', cuisine: 'Tamil', desc: 'Thick, soft village dosa made on a stone griddle.', ing: [...DOSA_BATTER, 'vegetable oil'], prep: 10, cook: 12, kcal: 220, macros: [6, 38, 4], emoji: '🥞', tip: 'Serve with spicy chicken or mutton kuzhambu.',
    steps: ['Use fermented dosa batter.', 'Pour a thick round on a hot pan and do not spread.', 'Cover, cook both sides until soft and spotted.@240'] }),
  simple({ title: 'Godhuma Dosa with Onion Chutney', cuisine: 'Tamil', desc: 'Wheat dosa served with a spicy onion chutney.', ing: ['flour', 'rice flour', 'onion', 'chili powder', 'tamarind', 'vegetable oil', 'salt'], prep: 10, cook: 20, kcal: 260, macros: [7, 40, 8], emoji: '🥞', tip: 'Cook the onion until soft and sweet.',
    steps: ['Fry onion with chili powder and tamarind and grind into a chutney.@420', 'Whisk the flours with water into a thin batter.', 'Make thin dosas on a hot pan with oil.@180'] }),
];

const idli = (name: string, cuisine: string, desc: string, ing: string[], method: string, tip: string, kcal = 200, emoji = '⚪'): Row =>
  simple({ title: name, cuisine, desc, ing: [...ing, 'salt'], prep: 15, cook: 15, kcal, macros: [6, 34, 4], emoji, tip,
    steps: [cap(method), 'Pour into greased idli moulds.', 'Steam until a skewer comes out clean.@720'] });

const IDLIS: Row[] = [
  idli('Kanchipuram Idli', 'Tamil', 'Temple idli spiced with pepper, cumin, ginger and cashews.', ['rice', 'urad dal', 'black pepper', 'cumin', 'ginger', 'cashews', 'ghee', 'curry leaves'], 'stir pepper, cumin, ginger, cashews and curry leaves fried in ghee into fermented idli batter', 'Steam in cups or a large tray as the temple does.'),
  idli('Mini Ghee Idli', 'Tamil', 'Button idlis soaked in sambar and ghee.', ['rice', 'urad dal', 'ghee', 'lentils', 'sambar powder', 'tamarind'], 'make small idlis from fermented batter and float them in hot sambar with ghee', 'Serve in a bowl with plenty of sambar.'),
  idli('Ragi Idli', 'Karnataka', 'Soft finger millet idli.', ['rice flour', 'urad dal'], 'mix millet flour into fermented urad dal batter and rest', 'Ragi flour is traditional; it gives a deep colour.'),
  idli('Oats Idli', 'Karnataka', 'Instant oats and semolina idli.', ['oats', 'semolina', 'yogurt', 'carrot', 'mustard seeds', 'curry leaves'], 'mix ground oats, roasted semolina, yogurt and grated carrot and rest', 'Add a pinch of baking soda just before steaming.'),
  idli('Vegetable Rava Idli', 'Karnataka', 'Semolina idli with carrot, peas and cashews.', ['semolina', 'yogurt', 'carrot', 'peas', 'cashews', 'mustard seeds', 'curry leaves', 'ghee'], 'roast semolina in ghee with mustard seeds, then mix with yogurt and the vegetables and rest', 'Press a cashew into each mould first.'),
  idli('Thatte Idli', 'Karnataka', 'Large flat plate idli from Bidadi.', ['rice', 'urad dal', 'poha', 'butter'], 'pour fermented batter into flat greased plates', 'Serve with a knob of butter.'),
  idli('Masala Idli Fry', 'Tamil', 'Leftover idlis tossed in a spicy onion masala.', ['rice', 'urad dal', 'onion', 'tomato', 'chili powder', 'garam masala', 'curry leaves', 'vegetable oil'], 'cut leftover idlis into pieces and toss with fried onion, tomato and spices', 'Day-old idlis work best.', 260, '🍳'),
  idli('Sambar Idli', 'Tamil', 'Idlis drowned in hot tiffin sambar.', ['rice', 'urad dal', 'lentils', 'onion', 'tamarind', 'sambar powder', 'curry leaves'], 'steam idlis from fermented batter and serve soaked in thin, hot sambar', 'Tiffin sambar is thinner than lunch sambar.', 240, '🥣'),
  idli('Kushboo Idli', 'Tamil', 'Extra-soft Chennai idli, as soft as cotton.', ['rice', 'urad dal', 'poha', 'sago'], 'grind soaked rice, urad dal, poha and sago smooth and ferment overnight', 'Sago and poha make them very soft.'),
];

const UPMAS: Row[] = [
  simple({ title: 'Semiya Upma', cuisine: 'Tamil', desc: 'Vermicelli upma with vegetables and curry leaves.', ing: ['vermicelli', 'onion', 'carrot', 'peas', 'mustard seeds', 'urad dal', 'curry leaves', 'green chili', 'ghee'], prep: 5, cook: 15, kcal: 280, macros: [6, 46, 8], emoji: '🍜', tip: 'Roast the vermicelli golden first so it stays separate.',
    steps: ['Roast the vermicelli in ghee until golden.@180', 'Fry mustard seeds, urad dal, curry leaves, chili, onion and vegetables.@240', 'Add hot water and salt, then the vermicelli, and cook covered until absorbed.@420'] }),
  simple({ title: 'Arisi Upma', cuisine: 'Tamil', desc: 'Broken rice upma with coconut, a Tamil classic.', ing: ['rice', 'lentils', 'coconut', 'mustard seeds', 'urad dal', 'curry leaves', 'black pepper', 'cumin', 'vegetable oil'], prep: 10, cook: 20, kcal: 290, macros: [7, 48, 8], emoji: '🍚', tip: 'Coarsely grind the rice and dal together.',
    steps: ['Coarsely grind rice with a little lentils, pepper and cumin.', 'Fry mustard seeds, urad dal and curry leaves, add water, coconut and salt and boil.@240', 'Add the rice mix and cook covered on low heat until soft.@900'] }),
  simple({ title: 'Oats Upma', cuisine: 'Karnataka', desc: 'Quick vegetable oats upma.', ing: ['oats', 'onion', 'carrot', 'peas', 'mustard seeds', 'urad dal', 'curry leaves', 'green chili', 'lemon', 'vegetable oil'], prep: 5, cook: 12, kcal: 240, macros: [8, 36, 7], emoji: '🥣', tip: 'Roast the oats first so they do not go mushy.',
    steps: ['Dry-roast the oats lightly.@180', 'Fry mustard seeds, urad dal, curry leaves, chili, onion and vegetables.@240', 'Add a little water, the oats and salt and cook until just soft, then add lemon.@240'] }),
  simple({ title: 'Kara Bath', cuisine: 'Karnataka', desc: 'Spicy Bangalore semolina bath with vegetables and vangi bath powder.', ing: ['semolina', 'onion', 'tomato', 'carrot', 'peas', 'green beans', 'coriander powder', 'chili powder', 'mustard seeds', 'curry leaves', 'ghee'], prep: 10, cook: 15, kcal: 300, macros: [7, 46, 10], emoji: '🥣', tip: 'Serve with Kesari Bath for a Chow Chow Bath.',
    steps: ['Roast semolina in ghee.@240', 'Fry mustard seeds, curry leaves, onion, tomato and the vegetables with the spices.@360', 'Add hot water, then the semolina, and stir until thick and fluffy.@300'] }),
  simple({ title: 'Akki Rotti with Dill', cuisine: 'Karnataka', desc: 'Rice flour flatbread with dill, onion and coconut.', ing: ['rice flour', 'onion', 'coconut', 'green chili', 'cumin', 'cilantro', 'vegetable oil'], prep: 15, cook: 15, kcal: 250, macros: [4, 42, 7], emoji: '🫓', tip: 'Pat the dough directly on the pan with wet fingers.',
    steps: ['Mix rice flour, onion, coconut, green chili, cumin, cilantro and salt with warm water to a soft dough.', 'Pat thin rounds onto a greased pan.', 'Cook with oil until spotted on both sides.@300'] }),
  simple({ title: 'Paal Kozhukattai', cuisine: 'Tamil', desc: 'Rice dumplings simmered in sweet coconut milk.', ing: ['rice flour', 'coconut milk', 'jaggery', 'cardamom', 'water'], prep: 15, cook: 20, kcal: 260, macros: [3, 44, 9], emoji: '⚪', tip: 'Roll the dumplings small, like marbles.',
    steps: ['Make a soft dough of rice flour and hot water and roll small balls.', 'Simmer the balls in water until they float.@600', 'Add jaggery and coconut milk and cardamom and warm through.@300'] }),
  simple({ title: 'Ela Ada', cuisine: 'Kerala', desc: 'Rice parcels with coconut and jaggery steamed in banana leaf.', ing: ['rice flour', 'coconut', 'jaggery', 'cardamom', 'banana', 'water'], prep: 20, cook: 15, kcal: 230, macros: [3, 42, 6], emoji: '🍃', tip: 'Banana leaves give the aroma; baking paper works.',
    steps: ['Mix coconut, melted jaggery and cardamom for the filling.@300', 'Spread a thin layer of soft rice dough on a leaf, add filling and fold.', 'Steam until the dough turns translucent.@720'] }),
  simple({ title: 'Kerala Puttu', cuisine: 'Kerala', desc: 'Steamed cylinders of rice flour and coconut.', ing: ['rice flour', 'coconut', 'salt', 'water'], prep: 10, cook: 10, kcal: 230, macros: [4, 42, 6], emoji: '🍚', tip: 'Damp crumbs, not dough: they should hold when squeezed.',
    steps: ['Sprinkle water into rice flour and rub until it forms damp crumbs.', 'Layer with coconut in a puttu maker or steamer.', 'Steam until steam rises through the top.@480'] }),
  simple({ title: 'Wheat Puttu', cuisine: 'Kerala', desc: 'Whole wheat puttu with coconut and banana.', ing: ['flour', 'coconut', 'banana', 'sugar', 'salt'], prep: 10, cook: 10, kcal: 260, macros: [7, 46, 6], emoji: '🍚', tip: 'Roast the flour lightly first.',
    steps: ['Roast the flour, cool and sprinkle with salted water to damp crumbs.@300', 'Layer with coconut in a steamer.', 'Steam and serve with banana and sugar.@480'] }),
  simple({ title: 'Palappam', cuisine: 'Kerala', desc: 'Lacy-edged fermented rice and coconut hoppers.', ing: ['rice', 'coconut', 'yeast', 'sugar', 'salt'], prep: 20, cook: 15, kcal: 210, macros: [3, 38, 5], emoji: '🥞', tip: 'Swirl the pan to get the lacy edge.',
    steps: ['Grind soaked rice with coconut and ferment with yeast and sugar overnight.@28800', 'Pour a ladle into an appam pan and swirl.', 'Cover and cook until the edge is crisp and the centre soft.@120'] }),
  simple({ title: 'Kerala Pathiri', cuisine: 'Kerala', desc: 'Thin, soft Malabar rice flour rotis.', ing: ['rice flour', 'coconut milk', 'water', 'salt'], prep: 20, cook: 15, kcal: 200, macros: [3, 40, 3], emoji: '🫓', tip: 'Dip in coconut milk before serving.',
    steps: ['Make a smooth dough with rice flour and boiling salted water.', 'Roll paper-thin rounds.', 'Cook on a hot pan until puffed and dip in coconut milk.@120'] }),
  simple({ title: 'Pesarattu Upma', cuisine: 'Andhra', desc: 'Green moong crepe stuffed with upma.', ing: ['lentils', 'ginger', 'green chili', 'semolina', 'onion', 'mustard seeds', 'curry leaves', 'vegetable oil'], prep: 15, cook: 20, kcal: 320, macros: [13, 46, 8], emoji: '🥞', tip: 'The Andhra MLA pesarattu.',
    steps: ['Soak moong and grind with ginger and green chili.@7200', 'Make a quick upma with semolina, onion and tempering.@600', 'Spread the batter thin, add upma, fold and cook until crisp.@180'] }),
];

const variety = (name: string, cuisine: string, desc: string, ing: string[], method: string, tip: string, emoji = '🍚', kcal = 340): Row =>
  simple({ title: name, cuisine, desc, ing: ['rice', ...ing, 'salt'], prep: 10, cook: 15, kcal, macros: [6, 56, 9], emoji, tip,
    steps: ['Cook the rice, spread it out to cool so the grains stay separate.@1080', cap(method), 'Fold the rice in gently and rest for ten minutes.@600'] });

const RICES: Row[] = [
  variety('Mango Rice', 'Karnataka', 'Tangy raw mango rice with peanuts.', ['mango', 'peanuts', 'mustard seeds', 'chana dal', 'green chili', 'curry leaves', 'turmeric', 'vegetable oil'], 'fry mustard seeds, chana dal, peanuts, chili and curry leaves, then add grated raw mango and turmeric and cook briefly@240', 'Use sour green mango.'),
  variety('Coriander Rice', 'Tamil', 'Rice tossed in a fresh coriander paste.', ['cilantro', 'green chili', 'ginger', 'cashews', 'mustard seeds', 'ghee'], 'grind coriander, green chili and ginger; fry cashews and mustard seeds in ghee and add the paste@300', 'Use the stems too.'),
  variety('Pudina Rice', 'Tamil', 'Mint rice with whole spices.', ['mint', 'onion', 'green chili', 'cinnamon', 'cloves', 'ghee'], 'fry whole spices and onion in ghee, add ground mint and chili and cook@360', 'Pack it for lunch with potato fry.'),
  variety('Milagu Sadam', 'Tamil', 'Pepper and cumin rice, comforting and warming.', ['black pepper', 'cumin', 'urad dal', 'curry leaves', 'cashews', 'ghee'], 'roast pepper, cumin and urad dal and grind; fry cashews and curry leaves in ghee and add the powder@180', 'Good for a cold.'),
  variety('Ellu Sadam', 'Tamil', 'Sesame rice with roasted dal and chili.', ['sesame seeds', 'urad dal', 'chili powder', 'curry leaves', 'vegetable oil'], 'roast sesame and urad dal and grind with chili; fry curry leaves in oil and add the powder@240', 'Offered on Saturdays in Tamil homes.'),
  variety('Karuveppilai Sadam', 'Tamil', 'Curry leaf rice with a roasted spice powder.', ['curry leaves', 'urad dal', 'chana dal', 'black pepper', 'cumin', 'ghee'], 'roast curry leaves, dals, pepper and cumin and grind; mix into ghee@300', 'Full of iron and flavour.'),
  variety('Vegetable Bath', 'Karnataka', 'Karnataka spiced vegetable rice with bath powder.', ['carrot', 'green beans', 'peas', 'onion', 'tomato', 'coriander powder', 'cinnamon', 'cloves', 'ghee'], 'fry onion, tomato and the vegetables with the spices in ghee until tender@600', 'Serve with raita.'),
  variety('Puliyogare', 'Karnataka', 'Karnataka tamarind rice with jaggery and sesame.', ['tamarind', 'jaggery', 'sesame seeds', 'peanuts', 'chana dal', 'mustard seeds', 'chili powder', 'curry leaves', 'vegetable oil'], 'cook tamarind with jaggery and chili into a paste with fried peanuts and dal, then add roasted sesame powder@900', 'Slightly sweeter than Tamil puliyodharai.'),
  variety('Chitranna', 'Karnataka', 'Lemon rice with peanuts and coconut, Karnataka style.', ['lemon', 'peanuts', 'coconut', 'mustard seeds', 'chana dal', 'green chili', 'curry leaves', 'turmeric', 'vegetable oil'], 'fry mustard seeds, dal, peanuts, chili and curry leaves with turmeric, then add coconut and lemon juice@180', 'Add lemon off the heat.'),
  variety('Kothamalli Pulao', 'Tamil', 'Coriander pulao with peas.', ['cilantro', 'mint', 'peas', 'onion', 'green chili', 'cinnamon', 'cloves', 'ghee'], 'fry whole spices and onion, add ground coriander, mint and chili and the peas@420', 'Pair with onion raita.'),
  variety('Tomato Bath', 'Karnataka', 'Karnataka tomato rice with whole spices.', ['tomato', 'onion', 'green chili', 'ginger garlic paste', 'cinnamon', 'cloves', 'chili powder', 'ghee'], 'fry spices, onion and ginger garlic paste, add tomato and chili and cook to a thick sauce@600', 'A Bangalore breakfast favourite.'),
  variety('Thayir Vadai Rice Bowl', 'Tamil', 'Curd rice topped with fried lentil vadai.', ['yogurt', 'urad dal', 'mustard seeds', 'green chili', 'ginger', 'curry leaves', 'vegetable oil'], 'fry small urad dal vadas and mix the rest of the rice with yogurt and a mustard tempering@480', 'Soak the vadas in yogurt briefly.', '🥣'),
  variety('Ghee Rice', 'Kerala', 'Malabar ghee rice with fried onions and cashews.', ['ghee', 'onion', 'cashews', 'raisins', 'cinnamon', 'cloves', 'cardamom'], 'fry onion, cashews and raisins in ghee, then whole spices@420', 'Serve with chicken curry.'),
  variety('Kerala Matta Rice Kanji', 'Kerala', 'Red rice gruel with green gram and coconut.', ['lentils', 'coconut', 'salt', 'water'], 'cook the rice with lentils in plenty of water until soft and soupy, then add coconut@1800', 'Eat with pickle and papad.', '🥣', 230),
];

const BIRYANIS: Row[] = [
  ['Malabar Chicken Biryani', 'Kerala', 'chicken', 'Fragrant Malabar biryani with short-grain rice, fried onions and cashews.'],
  ['Thalassery Mutton Biryani', 'Kerala', 'mutton', 'Thalassery biryani with kaima rice and a mild, aromatic masala.'],
  ['Malabar Prawn Biryani', 'Kerala', 'prawn', 'Kerala prawn biryani with ghee rice and roasted cashews.'],
  ['Donne Chicken Biryani', 'Karnataka', 'chicken', 'Bangalore military-hotel biryani green with mint and coriander, served in leaf cups.'],
  ['Donne Mutton Biryani', 'Karnataka', 'mutton', 'Green, herby Bangalore mutton biryani.'],
  ['Chettinad Chicken Biryani', 'Chettinad', 'chicken', 'Spicy Chettinad biryani with seeraga samba rice.'],
  ['Andhra Chicken Dum Biryani', 'Andhra', 'chicken', 'Fiery Andhra biryani layered and cooked on dum.'],
  ['Hyderabadi Egg Biryani', 'Hyderabadi', 'egg', 'Dum biryani with boiled eggs and saffron rice.'],
  ['Hyderabadi Prawn Biryani', 'Hyderabadi', 'prawn', 'Kacchi-style prawn biryani with mint and fried onions.'],
  ['Mushroom Biryani', 'Tamil', 'mushroom', 'Tamil-style mushroom biryani with mint and coconut milk.'],
  ['Paneer Dum Biryani', 'Hyderabadi', 'paneer', 'Saffron dum biryani with marinated paneer.'],
  ['Kerala Fish Biryani', 'Kerala', 'fish', 'Kerala fish biryani with fried masala fish and ghee rice.'],
].map(([title, cuisine, key, desc]) => {
  const p = protein(key);
  return row({
    title, cuisine, description: desc, difficulty: 'Hard', prep: 30, cook: p.cookMin + 30, kcal: p.kcal + 380, macros: [p.protein, 62, p.fat + 6], emoji: '🍚',
    ingredients: ['rice', ...p.ing, 'onion', 'tomato', 'yogurt', 'ginger garlic paste', 'mint', 'cilantro', 'garam masala', 'cinnamon', 'cloves', 'cardamom', 'ghee', 'salt'],
    steps: [`${cap(p.prep)} and marinate with yogurt, ginger garlic paste and garam masala.@1800`, 'Fry onions in ghee until golden; keep some for the top.@600', `Cook the ${p.en.toLowerCase()} with tomato, mint and cilantro until nearly done.@${p.cookMin * 60}`, 'Layer with par-boiled rice and fried onions, seal and cook on low heat.@1500'],
    tip: 'Rest the biryani ten minutes before opening.',
  });
});

const SNACKS: Row[] = [
  simple({ title: 'Masala Vadai', cuisine: 'Tamil', desc: 'Crunchy chana dal fritters with fennel and onion.', ing: ['chana dal', 'onion', 'fennel seeds', 'green chili', 'ginger', 'curry leaves', 'vegetable oil', 'salt'], prep: 15, cook: 15, kcal: 240, macros: [10, 26, 11], emoji: '🧆', tip: 'Grind without water and keep it coarse.',
    steps: ['Soak the chana dal and grind coarsely.@7200', 'Mix in onion, fennel, green chili, ginger and curry leaves.', 'Shape flat patties and fry until crisp.@360'] }),
  simple({ title: 'Ulundu Bonda', cuisine: 'Tamil', desc: 'Fluffy urad dal balls with pepper and coconut bits.', ing: ['urad dal', 'black pepper', 'coconut', 'green chili', 'curry leaves', 'vegetable oil', 'salt'], prep: 15, cook: 15, kcal: 230, macros: [9, 22, 12], emoji: '🟤', tip: 'Beat the batter until light.',
    steps: ['Grind soaked urad dal into a fluffy batter.@7200', 'Mix in pepper, coconut bits, chili and curry leaves.', 'Drop balls into hot oil and fry until golden.@300'] }),
  simple({ title: 'Banana Bajji', cuisine: 'Tamil', desc: 'Raw banana slices in spiced gram flour batter.', ing: ['raw banana', 'besan', 'rice flour', 'chili powder', 'asafoetida', 'vegetable oil', 'salt'], prep: 10, cook: 15, kcal: 230, macros: [5, 32, 10], emoji: '🍌', tip: 'Slice the banana thin and lengthways.',
    steps: ['Slice the raw banana thin.', 'Whisk besan, rice flour, chili, asafoetida and salt with water into a thick batter.', 'Dip and fry until golden.@240'] }),
  simple({ title: 'Mirchi Bajji', cuisine: 'Andhra', desc: 'Stuffed long green chili fritters, Andhra street style.', ing: ['green chili', 'besan', 'rice flour', 'tamarind', 'onion', 'chili powder', 'vegetable oil', 'salt'], prep: 15, cook: 15, kcal: 220, macros: [5, 28, 10], emoji: '🌶️', tip: 'Use large, mild chilies.',
    steps: ['Slit the chilies and stuff with tamarind and spices.', 'Dip in thick besan batter.', 'Fry until golden and serve with chopped onion.@300'] }),
  simple({ title: 'Ribbon Pakoda', cuisine: 'Tamil', desc: 'Crisp ribbon-shaped rice and gram flour snack.', ing: ['rice flour', 'besan', 'chili powder', 'sesame seeds', 'butter', 'vegetable oil', 'salt'], prep: 15, cook: 20, kcal: 160, macros: [4, 20, 8], emoji: '🎀', tip: 'Fry on medium heat until the bubbling stops.',
    steps: ['Mix the flours, chili, sesame, butter and salt into a soft dough.', 'Press through a ribbon mould into hot oil.', 'Fry until crisp.@300'] }),
  simple({ title: 'Kara Boondi', cuisine: 'Tamil', desc: 'Spicy fried gram flour pearls with peanuts and curry leaves.', ing: ['besan', 'rice flour', 'chili powder', 'peanuts', 'curry leaves', 'vegetable oil', 'salt'], prep: 10, cook: 20, kcal: 170, macros: [6, 16, 9], emoji: '🟠', tip: 'Tap the ladle so drops fall evenly.',
    steps: ['Whisk besan, rice flour, chili and salt into a flowing batter.', 'Drip through a slotted ladle into hot oil and fry crisp.@300', 'Toss with fried peanuts and curry leaves.'] }),
  simple({ title: 'Parippu Vada', cuisine: 'Kerala', desc: 'Kerala tea-shop lentil fritters.', ing: ['chana dal', 'onion', 'ginger', 'green chili', 'curry leaves', 'coconut oil', 'salt'], prep: 15, cook: 15, kcal: 230, macros: [10, 24, 11], emoji: '🧆', tip: 'Serve with sweet black tea.',
    steps: ['Soak and grind the dal coarsely.@7200', 'Mix in onion, ginger, chili and curry leaves.', 'Shape flat discs and fry in coconut oil until crisp.@360'] }),
  simple({ title: 'Unniyappam', cuisine: 'Kerala', desc: 'Sweet rice, banana and jaggery dumplings.', ing: ['rice flour', 'banana', 'jaggery', 'coconut', 'cardamom', 'ghee'], prep: 15, cook: 20, kcal: 200, macros: [2, 36, 6], emoji: '🟤', tip: 'Cook in an appam pan filled with ghee.',
    steps: ['Mix rice flour, mashed banana, melted jaggery, coconut and cardamom into a thick batter.@900', 'Pour into an appam pan with ghee.', 'Cook, turning, until brown all over.@480'] }),
  simple({ title: 'Mangalore Bajji', cuisine: 'Mangalorean', desc: 'Fluffy yogurt-flour fritters.', ing: ['flour', 'yogurt', 'rice flour', 'green chili', 'ginger', 'coconut', 'curry leaves', 'vegetable oil', 'salt'], prep: 10, cook: 15, kcal: 250, macros: [6, 34, 10], emoji: '🟡', tip: 'Rest the batter for a few hours.',
    steps: ['Mix flour, yogurt and rice flour into a thick batter and rest.@7200', 'Stir in chili, ginger, coconut and curry leaves.', 'Drop small balls into hot oil and fry until golden.@300'] }),
  simple({ title: 'Chegodilu', cuisine: 'Andhra', desc: 'Crunchy Andhra rice flour rings with chana dal.', ing: ['rice flour', 'chana dal', 'sesame seeds', 'chili powder', 'cumin', 'butter', 'vegetable oil', 'salt'], prep: 20, cook: 20, kcal: 150, macros: [3, 20, 7], emoji: '⭕', tip: 'Cook the dough before shaping.',
    steps: ['Boil water with butter, chili, cumin and salt, add rice flour and soaked dal and stir to a dough.@300', 'Roll into thin ropes and shape rings.', 'Fry on low heat until crisp.@480'] }),
  simple({ title: 'Thayir Vadai', cuisine: 'Tamil', desc: 'Soft urad dal vadai soaked in seasoned yogurt.', ing: ['urad dal', 'yogurt', 'ginger', 'green chili', 'mustard seeds', 'curry leaves', 'cilantro', 'carrot', 'vegetable oil'], prep: 20, cook: 15, kcal: 260, macros: [11, 24, 13], emoji: '🥣', tip: 'Soak the vadas in warm water before the yogurt.',
    steps: ['Fry vadas from fluffy urad dal batter.@360', 'Soak them in warm water and squeeze gently.', 'Soak in seasoned yogurt with a mustard tempering, carrot and coriander.'] }),
  simple({ title: 'Sakinalu', cuisine: 'Andhra', desc: 'Telangana sesame rice flour spirals for Sankranti.', ing: ['rice flour', 'sesame seeds', 'cumin', 'vegetable oil', 'salt', 'water'], prep: 30, cook: 20, kcal: 150, macros: [3, 20, 7], emoji: '🌀', tip: 'Shape them on a cloth and let them dry a little.',
    steps: ['Make a stiff dough of rice flour, sesame, cumin, salt and water.', 'Shape spirals on a cloth and air-dry.@1800', 'Fry on low heat until crisp.@480'] }),
];

const SWEETS: Row[] = [
  simple({ title: 'Semiya Payasam', cuisine: 'Tamil', desc: 'Vermicelli milk pudding with cashews and cardamom.', ing: ['vermicelli', 'milk', 'sugar', 'ghee', 'cashews', 'raisins', 'cardamom'], prep: 5, cook: 20, kcal: 300, macros: [8, 44, 10], emoji: '🥣', tip: 'Roast the vermicelli in ghee first.',
    steps: ['Roast vermicelli, cashews and raisins in ghee.@240', 'Add milk and simmer until soft.@600', 'Add sugar and cardamom and simmer until creamy.@300'] }),
  simple({ title: 'Ada Pradhaman', cuisine: 'Kerala', desc: 'Rice flakes in jaggery and coconut milk, the king of sadya payasams.', ing: ['rice', 'jaggery', 'coconut milk', 'ghee', 'cardamom', 'cashews', 'coconut'], prep: 15, cook: 40, kcal: 360, macros: [4, 56, 14], emoji: '🥣', tip: 'Add thick coconut milk last, off the boil.', difficulty: 'Medium',
    steps: ['Cook the rice flakes until soft and drain.@900', 'Simmer in melted jaggery with ghee until thick.@900', 'Add thin, then thick coconut milk and cardamom; top with fried cashews and coconut bits.@300'] }),
  simple({ title: 'Pal Payasam', cuisine: 'Kerala', desc: 'Pink rice pudding slow-cooked in milk.', ing: ['rice', 'milk', 'sugar', 'cardamom', 'ghee'], prep: 5, cook: 60, kcal: 290, macros: [8, 44, 8], emoji: '🥣', tip: 'Long simmering turns it a soft pink.',
    steps: ['Simmer rice in milk, stirring often.@2700', 'Add sugar and keep cooking until pink and thick.@900', 'Finish with cardamom and ghee.'] }),
  simple({ title: 'Chakka Pradhaman', cuisine: 'Kerala', desc: 'Ripe jackfruit and jaggery payasam with coconut milk.', ing: ['jackfruit', 'jaggery', 'coconut milk', 'ghee', 'cardamom', 'cashews'], prep: 15, cook: 30, kcal: 340, macros: [3, 54, 13], emoji: '🍈', tip: 'Use very ripe jackfruit.',
    steps: ['Cook jackfruit in ghee and jaggery until jammy.@900', 'Add coconut milk and simmer gently.@600', 'Add cardamom and fried cashews.'] }),
  simple({ title: 'Kesari Bath', cuisine: 'Karnataka', desc: 'Saffron semolina halwa with pineapple.', ing: ['semolina', 'sugar', 'ghee', 'pineapple', 'saffron', 'cardamom', 'cashews', 'raisins'], prep: 5, cook: 15, kcal: 330, macros: [4, 50, 13], emoji: '🟠', tip: 'Add the pineapple for the Bangalore version.',
    steps: ['Roast semolina in ghee.@240', 'Add hot water with saffron and stir until thick.@180', 'Add sugar, pineapple, cardamom, cashews and raisins and cook until glossy.@300'] }),
  simple({ title: 'Obbattu', cuisine: 'Karnataka', desc: 'Sweet flatbread stuffed with chana dal and jaggery.', ing: ['flour', 'chana dal', 'jaggery', 'cardamom', 'ghee', 'turmeric'], prep: 30, cook: 30, kcal: 320, macros: [8, 54, 8], emoji: '🫓', tip: 'Roll gently so the filling does not burst.', difficulty: 'Medium',
    steps: ['Cook chana dal soft, mash with jaggery and cardamom and cook until thick.@1500', 'Wrap filling in soft dough and roll thin.', 'Cook on a pan with ghee.@240'] }),
  simple({ title: 'Ariselu', cuisine: 'Andhra', desc: 'Jaggery rice flour discs with sesame for Sankranti.', ing: ['rice flour', 'jaggery', 'sesame seeds', 'ghee', 'cardamom', 'vegetable oil'], prep: 30, cook: 20, kcal: 220, macros: [2, 40, 7], emoji: '🟤', tip: 'Press out the extra oil between two ladles.', difficulty: 'Hard',
    steps: ['Cook jaggery to a soft-ball syrup and mix in rice flour and cardamom.@600', 'Pat discs on sesame seeds.', 'Fry and press out the extra oil.@240'] }),
  simple({ title: 'Kozhukattai Modak', cuisine: 'Tamil', desc: 'Sweet coconut-jaggery rice dumplings for Ganesh Chaturthi.', ing: ['rice flour', 'coconut', 'jaggery', 'cardamom', 'ghee'], prep: 30, cook: 15, kcal: 210, macros: [3, 38, 6], emoji: '🥟', tip: 'Grease your fingers with ghee to shape.',
    steps: ['Cook coconut with jaggery and cardamom until sticky.@600', 'Shape cups of soft rice dough, fill and pleat shut.', 'Steam until glossy.@720'] }),
  simple({ title: 'Badam Halwa', cuisine: 'Karnataka', desc: 'Rich almond halwa cooked in ghee.', ing: ['almonds', 'sugar', 'ghee', 'milk', 'saffron', 'cardamom'], prep: 20, cook: 30, kcal: 420, macros: [10, 36, 28], emoji: '🟠', tip: 'Stir constantly; it catches easily.', difficulty: 'Medium',
    steps: ['Blanch, peel and grind the almonds with milk.', 'Cook with sugar and saffron, adding ghee little by little.@1500', 'Stop when it leaves the sides of the pan. Add cardamom.'] }),
  simple({ title: 'Thirunelveli Halwa', cuisine: 'Tamil', desc: 'Glossy wheat halwa dripping with ghee.', ing: ['flour', 'sugar', 'ghee', 'cashews', 'cardamom', 'water'], prep: 30, cook: 60, kcal: 380, macros: [4, 54, 18], emoji: '🟤', tip: 'Caramelise some sugar for the deep colour.', difficulty: 'Hard',
    steps: ['Make wheat milk by soaking and squeezing the flour in water.@3600', 'Cook with sugar and a little caramel, adding ghee slowly.@2700', 'Add cashews and cardamom when glossy.'] }),
  simple({ title: 'Kerala Banana Halwa', cuisine: 'Kerala', desc: 'Chewy banana and jaggery halwa from Kozhikode.', ing: ['banana', 'jaggery', 'ghee', 'cashews', 'cardamom'], prep: 10, cook: 40, kcal: 300, macros: [2, 56, 9], emoji: '🍌', tip: 'Keep stirring until it comes together.',
    steps: ['Mash ripe bananas and cook with jaggery.@1200', 'Add ghee little by little and keep stirring.@1200', 'Add cashews and cardamom and set in a tray.'] }),
];

const RASAMS: Row[] = [
  ['Jeera Rasam', ['cumin', 'black pepper', 'tomato', 'tamarind', 'garlic'], 'Cumin rasam that soothes the stomach.'],
  ['Paruppu Rasam', ['lentils', 'tomato', 'tamarind', 'black pepper', 'cumin'], 'Lentil rasam, light and comforting.'],
  ['Kollu Rasam', ['lentils', 'tomato', 'tamarind', 'black pepper', 'garlic'], 'Horse gram rasam, warming in winter.'],
  ['Inji Rasam', ['ginger', 'tomato', 'tamarind', 'black pepper', 'lemon'], 'Ginger rasam for colds.'],
  ['Mango Rasam', ['mango', 'lentils', 'black pepper', 'cumin', 'jaggery'], 'Sweet-sour raw mango rasam.'],
  ['Kandathippili Rasam', ['black pepper', 'cumin', 'tamarind', 'tomato', 'coriander powder'], 'Long pepper rasam, a traditional remedy.'],
  ['Udupi Rasam', ['lentils', 'tomato', 'tamarind', 'coconut', 'jaggery'], 'Udupi temple rasam with coconut and jaggery.'],
  ['Beetroot Rasam', ['beetroot', 'tomato', 'tamarind', 'black pepper', 'cumin'], 'Ruby-red beetroot rasam.'],
  ['Murungai Keerai Rasam', ['spinach', 'tomato', 'tamarind', 'black pepper', 'garlic'], 'Drumstick-leaf rasam, full of iron.'],
].map(([title, ing, desc]) =>
  row({
    title: title as string, cuisine: title === 'Udupi Rasam' ? 'Karnataka' : 'Tamil', description: desc as string, prep: 5, cook: 15, kcal: 80, macros: [3, 12, 2], emoji: '🥣',
    ingredients: [...(ing as string[]), 'mustard seeds', 'curry leaves', 'asafoetida', 'cilantro', 'ghee', 'salt'],
    steps: [`Crush or grind the ${(ing as string[]).slice(0, 2).join(' and ')}.`, 'Simmer with tamarind water or the lentil water and salt until fragrant.@600', 'Temper with mustard seeds, curry leaves and asafoetida in ghee, take off as it froths, and add cilantro.@60'],
    tip: 'Never let rasam boil hard once it froths.',
  })
);

const CHUTNEYS: Row[] = [
  ['Peanut Chutney', ['peanuts', 'green chili', 'tamarind', 'garlic'], 'Roasted peanut chutney for dosa.', '🥜'],
  ['Mint Chutney South Style', ['mint', 'coconut', 'green chili', 'tamarind'], 'Mint and coconut chutney.', '🌿'],
  ['Inji Chutney', ['ginger', 'tamarind', 'jaggery', 'chili powder'], 'Sweet-hot ginger chutney.', '🫚'],
  ['Kara Chutney', ['tomato', 'onion', 'chili powder', 'garlic'], 'Fiery red onion-tomato chutney.', '🌶️'],
  ['Karuveppilai Chutney', ['curry leaves', 'urad dal', 'tamarind', 'green chili'], 'Curry leaf chutney.', '🌿'],
  ['Poondu Chutney', ['garlic', 'chili powder', 'tamarind', 'onion'], 'Hot garlic chutney.', '🧄'],
  ['Carrot Chutney', ['carrot', 'onion', 'chili powder', 'tamarind'], 'Sweet carrot chutney.', '🥕'],
  ['Pottukadalai Chutney', ['chana dal', 'coconut', 'green chili', 'ginger'], 'Roasted gram and coconut chutney, hotel style.', '🥥'],
  ['Thengai Kara Chutney', ['coconut', 'chili powder', 'garlic', 'tamarind'], 'Red coconut chutney.', '🥥'],
  ['Pudina Thogayal', ['mint', 'urad dal', 'tamarind', 'green chili'], 'Thick mint relish.', '🌿'],
].map(([title, ing, desc, emoji]) =>
  row({
    title: title as string, cuisine: 'Tamil', description: desc as string, prep: 5, cook: 8, kcal: 80, macros: [2, 8, 5], emoji: emoji as string,
    ingredients: [...(ing as string[]), 'mustard seeds', 'urad dal', 'curry leaves', 'vegetable oil', 'salt'],
    steps: [`Roast the ${(ing as string[]).slice(0, 2).join(' and ')} lightly in a little oil.@240`, 'Cool and grind with the rest and salt, adding water as needed.', 'Temper with mustard seeds, urad dal and curry leaves.@60'],
    tip: 'Good with idli, dosa or rice.',
  })
);

// ---------- Vegetable lists per family ----------

const pair = (a: string, b: string): Veg => {
  const x = veg(a);
  const y = veg(b);
  return { ...x, key: `${a}+${b}`, en: `${x.en} ${y.en}`, te: `${x.te} ${y.te}`, ing: [...x.ing, ...y.ing], prep: `${x.prep}, and ${y.prep}`, firm: x.firm || y.firm };
};

export const SOUTH_FAMILY_ROWS: Row[] = [
  ...vegs('cabbage cauliflower okra eggplant pumpkin bottle-gourd bitter-gourd drumstick colocasia jackfruit radish spinach cucumber sweet-potato mushroom capsicum corn methi peas potato').map(poriyal),
  ...[pair('carrot', 'beans'), pair('cabbage', 'peas'), pair('beans', 'peas'), pair('carrot', 'peas'), pair('cabbage', 'carrot'), pair('beetroot', 'carrot')].map(poriyal),
  ...vegs('carrot beetroot beans okra eggplant pumpkin bottle-gourd bitter-gourd drumstick raw-banana colocasia jackfruit radish spinach cucumber cauliflower mushroom capsicum methi peas').map(thoran),
  ...[pair('carrot', 'beans'), pair('cabbage', 'carrot'), pair('beans', 'peas'), pair('beetroot', 'carrot')].map(thoran),
  ...vegs('cabbage carrot beetroot beans okra eggplant pumpkin bottle-gourd raw-banana colocasia radish spinach cauliflower capsicum methi potato sweet-potato corn').map(palya),
  ...[pair('carrot', 'beans'), pair('cabbage', 'peas'), pair('beans', 'peas')].map(palya),
  ...vegs('raw-banana beans potato okra bitter-gourd colocasia cabbage jackfruit pumpkin eggplant').map(mezhukkupuratti),
  ...vegs('bottle-gourd beans carrot spinach cucumber radish eggplant peas drumstick raw-banana jackfruit methi').map(kootu),
  ...vegs('okra eggplant radish pumpkin bottle-gourd carrot beans cucumber potato capsicum cauliflower raw-banana colocasia spinach tomato peas').map(sambar),
  ...vegs('okra eggplant drumstick bitter-gourd raw-banana pumpkin radish colocasia').map(puliKuzhambu),
  ...vegs('okra bottle-gourd raw-banana pumpkin colocasia cucumber').map(morKuzhambu),
  ...vegs('spinach methi tomato bottle-gourd raw-banana').map(kadaiyal),
  thogayal('Brinjal', ['eggplant'], '🍆'), thogayal('Tomato', ['tomato'], '🍅'), thogayal('Ridge Gourd', ['bottle gourd'], '🥒'), thogayal('Coconut', ['coconut'], '🥥'), thogayal('Ginger', ['ginger'], '🫚'), thogayal('Coriander', ['cilantro'], '🌿'),
  keralaPachadi('Cucumber', ['cucumber'], '🥒'), keralaPachadi('Beetroot', ['beetroot'], '🟣'), keralaPachadi('Pineapple', ['pineapple'], '🍍'), keralaPachadi('Mango', ['mango'], '🥭'), keralaPachadi('Okra', ['okra'], '🫛'), keralaPachadi('Bitter Gourd', ['bitter gourd'], '🥒'), keralaPachadi('Carrot', ['carrot'], '🥕'),
  ishtu('Potato', ['potato', 'carrot', 'peas'], '🥔'), ishtu('Egg', ['egg', 'potato'], '🥚', 12), ishtu('Chicken', ['chicken', 'potato'], '🍗', 26), ishtu('Mutton', ['lamb', 'potato'], '🍖', 26), ishtu('Vegetable', ['potato', 'carrot', 'green beans', 'peas'], '🥘'), ishtu('Mushroom', ['mushrooms', 'potato'], '🍄', 4),
  ...vegs('eggplant okra bitter-gourd drumstick raw-banana').map(theeyal),
  ...vegs('pumpkin radish drumstick bottle-gourd okra cucumber eggplant beans carrot potato').map(huli),
  gojju('Pineapple', ['pineapple'], '🍍'), gojju('Bitter Gourd', ['bitter gourd'], '🥒'), gojju('Okra', ['okra'], '🫛'), gojju('Brinjal', ['eggplant'], '🍆'), gojju('Tomato', ['tomato'], '🍅'), gojju('Capsicum', ['bell pepper'], '🫑'), gojju('Mango', ['mango'], '🥭'),
  ...vegs('okra bottle-gourd pumpkin cucumber colocasia').map(majjigeHuli),
  ...vegs('eggplant okra potato cabbage cauliflower bitter-gourd drumstick raw-banana colocasia jackfruit capsicum mushroom beans pumpkin bottle-gourd radish').map(kura),
  ...vegs('okra bitter-gourd potato colocasia raw-banana eggplant beans cabbage jackfruit sweet-potato capsicum cauliflower mushroom').map(vepudu),
  ...vegs('okra eggplant drumstick bottle-gourd pumpkin radish raw-banana tomato colocasia').map(pulusu),
  ...vegs('spinach cucumber methi bottle-gourd drumstick radish carrot cabbage').map(pappu),
  ...vegs('eggplant tomato bottle-gourd cucumber capsicum carrot beetroot radish okra cabbage').map(andhraPachadi),
  ...S_STYLES.flatMap((s) => (S_PAIRS[s.name] || []).map((k) => proteinDish(s, protein(k)))),
  ...DOSAS, ...otherDosas, ...IDLIS, ...UPMAS, ...RICES, ...BIRYANIS, ...SNACKS, ...SWEETS, ...RASAMS, ...CHUTNEYS,
];

export const SOUTH_PROTEINS_USED = PROTEINS.length;
