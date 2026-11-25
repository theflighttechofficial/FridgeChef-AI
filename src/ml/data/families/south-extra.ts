/**
 * More South Indian families and regional specials: Kerala olan, erissery and kalan, Chettinad
 * masalas, Tamil kurma, roasts and sevai, Karnataka kosambari, snacks and sweets from all four
 * states, and Andhra, Hyderabadi and Kerala meat and seafood classics.
 */
import { Row } from '../schema';
import { Veg, cap, protein, row, vegs } from './common';

type M = [number, number, number];
const dish = (title: string, cuisine: string, description: string, ingredients: string[], steps: string[], tip: string, emoji: string, kcal: number, macros: M, prep = 10, cook = 20, difficulty?: 'Easy' | 'Medium' | 'Hard'): Row =>
  row({ title, cuisine, description, ingredients: [...ingredients, 'salt'], steps, tip, emoji, kcal, macros, prep, cook, difficulty });

// ---------- Vegetable families ----------

const olan = (v: Veg) =>
  dish(`${v.en} Olan`, 'Kerala', `Delicate sadya stew of ${v.en.toLowerCase()} and black-eyed peas in coconut milk.`,
    [...v.ing, 'black-eyed peas', 'coconut milk', 'green chili', 'curry leaves', 'coconut oil'],
    [`${cap(v.prep)}.`, `Cook the ${v.en.toLowerCase()} and green chili in thin coconut milk until soft, then add cooked black-eyed peas.@900`, 'Pour in thick coconut milk, drizzle raw coconut oil and add curry leaves.@60'],
    'Olan is meant to be mild: no spice powders.', v.emoji, 190, [7, 20, 9]);

const erissery = (v: Veg) =>
  dish(`${v.en} Erissery`, 'Kerala', `${v.en} cooked with lentils and finished with fried coconut.`,
    [...v.ing, 'lentils', 'coconut', 'cumin', 'garlic', 'turmeric', 'chili powder', 'mustard seeds', 'curry leaves', 'coconut oil'],
    [`${cap(v.prep)}.`, `Cook the ${v.en.toLowerCase()} and lentils with turmeric and chili until soft.@1200`, 'Grind coconut with cumin and garlic and stir in.@300', 'Fry more coconut in coconut oil with mustard seeds and curry leaves until brown and pour over.@240'],
    'The fried coconut on top makes it.', v.emoji, 220, [8, 26, 9]);

const kalan = (v: Veg) =>
  dish(`${v.en} Kalan`, 'Kerala', `Thick sour yogurt curry with ${v.en.toLowerCase()} and coconut, from the Onam sadya.`,
    [...v.ing, 'yogurt', 'coconut', 'black pepper', 'green chili', 'turmeric', 'fenugreek seeds', 'mustard seeds', 'curry leaves', 'coconut oil'],
    [`${cap(v.prep)}.`, `Cook the ${v.en.toLowerCase()} with pepper, turmeric and green chili until soft.@900`, 'Add ground coconut, then thick sour yogurt, and reduce until thick, stirring.@600', 'Temper with mustard and fenugreek seeds and curry leaves.@60'],
    'Use sour yogurt; kalan keeps for days.', v.emoji, 200, [6, 20, 10]);

const chettinadMasala = (v: Veg) =>
  dish(`Chettinad ${v.en} Masala`, 'Chettinad', `${v.en} in a peppery Chettinad masala of roasted spices.`,
    [...v.ing, 'black pepper', 'fennel seeds', 'coconut', 'onion', 'tomato', 'ginger garlic paste', 'cinnamon', 'cloves', 'curry leaves', 'vegetable oil'],
    [`${cap(v.prep)}.`, 'Roast pepper, fennel, cinnamon, cloves and coconut and grind.@300', `Fry onion, ginger garlic paste and tomato, add the ${v.en.toLowerCase()} and the paste and cook until thick.@900`],
    'Roast the spices until they darken.', v.emoji, 200, [5, 18, 12]);

const kurma = (name: string, ing: string[], emoji: string, p = 6, kcal = 240) =>
  dish(`${name} Kurma`, 'Tamil', `Hotel-style Tamil ${name.toLowerCase()} kurma with coconut, cashews and fennel.`,
    [...ing, 'coconut', 'cashews', 'fennel seeds', 'onion', 'tomato', 'ginger garlic paste', 'green chili', 'cinnamon', 'cloves', 'mint', 'vegetable oil'],
    ['Grind coconut, cashews, fennel and green chili to a smooth paste.', `Fry whole spices, onion, ginger garlic paste and tomato, add the ${name.toLowerCase()} and water and cook.@900`, 'Add the paste and mint and simmer until creamy.@420'],
    'Serve with parotta, chapati or idiyappam.', emoji, kcal, [p, 18, 16]);

const roast = (v: Veg) =>
  dish(`${v.en} Roast`, 'Tamil', `Crisp spicy ${v.en.toLowerCase()} roast, the best side for curd rice.`,
    [...v.ing, 'chili powder', 'turmeric', 'sambar powder', 'rice flour', 'curry leaves', 'vegetable oil'],
    [`${cap(v.prep)}.`, 'Toss with chili, turmeric, sambar powder, rice flour and salt.', 'Roast in oil on low heat, turning, until crisp.@900'],
    'Low heat and patience give the crust.', v.emoji, 190, [3, 24, 9]);

const kosambari = (v: Veg) =>
  dish(`${v.en} Kosambari`, 'Karnataka', `Fresh Karnataka salad of ${v.en.toLowerCase()} and soaked moong dal.`,
    [...v.ing, 'lentils', 'coconut', 'cilantro', 'lemon', 'green chili', 'mustard seeds', 'vegetable oil'],
    [`${cap(v.prep)}.`, 'Soak the moong dal for an hour and drain.@3600', `Mix with the ${v.en.toLowerCase()}, coconut, cilantro, chili and lemon and temper with mustard seeds.@30`],
    'Served at every Karnataka festival meal.', v.emoji, 120, [6, 14, 4], 15, 2);

const thayirPachadi = (v: Veg) =>
  dish(`${v.en} Thayir Pachadi`, 'Tamil', `Tamil yogurt relish with ${v.en.toLowerCase()} and coconut.`,
    [...v.ing, 'yogurt', 'coconut', 'green chili', 'mustard seeds', 'curry leaves', 'cilantro', 'vegetable oil'],
    [`${cap(v.prep)}.`, `Mix the ${v.en.toLowerCase()} with whisked yogurt, ground coconut and green chili.`, 'Temper with mustard seeds and curry leaves and add cilantro.@60'],
    'Serve chilled with biryani or rice.', v.emoji, 110, [5, 10, 6], 10, 2);

const bajji = (v: Veg) =>
  dish(`${v.en} Bajji`, 'Tamil', `${v.en} slices in spiced gram flour batter, a rainy-day snack.`,
    [...v.ing, 'besan', 'rice flour', 'chili powder', 'asafoetida', 'vegetable oil'],
    [`${cap(v.prep)}.`, 'Whisk besan, rice flour, chili, asafoetida and salt into a thick batter.', 'Dip and deep-fry until golden.@240'],
    'Serve with coconut chutney and filter coffee.', v.emoji, 230, [5, 28, 11], 10, 15);

const sevai = (name: string, ing: string[], method: string) =>
  dish(`${name} Sevai`, 'Tamil', `Rice noodles tossed ${method}.`, ['rice flour', ...ing, 'mustard seeds', 'urad dal', 'curry leaves', 'vegetable oil'],
    ['Steam rice noodles (sevai) and fluff them.@600', `Fry mustard seeds, urad dal and curry leaves, then toss in the noodles ${method}.@240`],
    'Fresh sevai is soft; dried rice noodles work too.', '🍜', 260, [5, 46, 7]);

const payasam = (name: string, cuisine: string, desc: string, ing: string[]) =>
  dish(name, cuisine, desc, [...ing, 'ghee', 'cardamom', 'cashews'],
    [`Cook the ${ing[0]} until soft.@900`, `Add ${ing.slice(1).join(' and ')} and simmer until creamy.@600`, 'Add cardamom and cashews fried in ghee.@60'],
    'Payasam thickens as it cools.', '🥣', 300, [6, 46, 10]);

// ---------- Proteins ----------

// `meat` replaces the protein's own ingredient for meats outside the shared list (duck, beef)
const special = (title: string, cuisine: string, key: string, desc: string, ing: string[], steps: string[], tip: string, carbs = 8, meat?: string) => {
  const p = protein(key);
  return dish(title, cuisine, desc, [...(meat ? [meat] : p.ing), ...ing], steps, tip, p.emoji, p.kcal + 140, [p.protein, carbs, p.fat + 6], 15, p.cookMin + 15, p.cookMin >= 45 ? 'Medium' : 'Easy');
};

export const SOUTH_EXTRA_ROWS: Row[] = [
  ...vegs('pumpkin bottle-gourd raw-banana cucumber').map(olan),
  ...vegs('raw-banana colocasia jackfruit sweet-potato').map(erissery),
  ...vegs('raw-banana colocasia').map(kalan),
  ...vegs('potato cauliflower okra eggplant peas capsicum').map(chettinadMasala),
  kurma('Potato', ['potato'], '🥔'), kurma('Cauliflower', ['cauliflower'], '🥦'), kurma('Peas', ['peas'], '🟢'), kurma('Egg', ['egg'], '🥚', 14, 300), kurma('Chicken', ['chicken'], '🍗', 28, 380), kurma('Mushroom', ['mushrooms'], '🍄'), kurma('Paneer', ['paneer'], '🧀', 16, 360), kurma('Mutton', ['lamb'], '🍖', 28, 420),
  ...vegs('raw-banana sweet-potato cauliflower okra beans').map(roast),
  ...vegs('carrot cucumber beetroot corn').map(kosambari),
  ...vegs('cucumber carrot beetroot okra tomato').map(thayirPachadi),
  ...vegs('potato capsicum cauliflower eggplant bottle-gourd').map(bajji),
  sevai('Lemon', ['lemon', 'peanuts', 'green chili', 'turmeric'], 'with lemon, peanuts and turmeric'),
  sevai('Coconut', ['coconut', 'cashews', 'green chili'], 'with grated coconut and cashews'),
  sevai('Tamarind', ['tamarind', 'sesame seeds', 'chili powder'], 'in a tangy tamarind paste with sesame'),
  sevai('Tomato', ['tomato', 'onion', 'chili powder'], 'with a spicy tomato and onion masala'),
  payasam('Javvarisi Payasam', 'Tamil', 'Sago pearls in sweet milk with cardamom.', ['sago', 'milk', 'sugar']),
  payasam('Carrot Payasam', 'Tamil', 'Grated carrot simmered in milk.', ['carrot', 'milk', 'sugar']),
  payasam('Rava Payasam', 'Karnataka', 'Semolina milk pudding.', ['semolina', 'milk', 'sugar']),
  payasam('Aval Payasam', 'Kerala', 'Rice flakes in milk with jaggery.', ['poha', 'milk', 'jaggery']),
  payasam('Thengai Payasam', 'Tamil', 'Coconut and rice payasam with jaggery.', ['rice', 'coconut', 'jaggery']),
  payasam('Moong Dal Payasam', 'Karnataka', 'Moong dal and jaggery payasam with coconut milk.', ['lentils', 'jaggery', 'coconut milk']),

  // Tiffin and rice
  dish('Aval Upma', 'Tamil', 'Light poha upma with mustard seeds and coconut.', ['poha', 'onion', 'mustard seeds', 'urad dal', 'curry leaves', 'green chili', 'coconut', 'lemon', 'vegetable oil'], ['Rinse the poha and drain.', 'Fry mustard seeds, urad dal, curry leaves, chili and onion, add the poha and salt and toss until hot.@300', 'Finish with coconut and lemon.'], 'Do not oversoak the poha.', '🥣', 230, [5, 40, 6], 5, 10),
  dish('Puli Aval', 'Tamil', 'Tangy tamarind poha with peanuts.', ['poha', 'tamarind', 'peanuts', 'mustard seeds', 'chana dal', 'curry leaves', 'chili powder', 'vegetable oil'], ['Soak the poha in tamarind water briefly.@300', 'Fry mustard seeds, dal, peanuts, curry leaves and chili.@120', 'Toss in the poha and cook until hot.@180'], 'Like puliyodharai, made with poha.', '🍚', 260, [6, 42, 8], 5, 10),
  dish('Inippu Paniyaram', 'Tamil', 'Sweet jaggery paniyaram with banana and cardamom.', ['rice', 'urad dal', 'jaggery', 'banana', 'cardamom', 'coconut', 'ghee'], ['Mix fermented idli batter with melted jaggery, mashed banana, coconut and cardamom.', 'Pour into a greased paniyaram pan.', 'Cook, turning, until golden.@480'], 'Over-ripe bananas are best.', '🟤', 240, [5, 42, 6]),
  dish('Mutta Appam', 'Kerala', 'Lacy appam with an egg cooked in the centre.', ['rice', 'coconut', 'yeast', 'egg', 'black pepper', 'sugar'], ['Pour fermented appam batter into an appam pan and swirl.', 'Crack an egg into the centre and season with pepper.', 'Cover and cook until the egg sets.@180'], 'Serve with stew or curry.', '🍳', 260, [10, 34, 9], 15, 10),
  dish('Pundi', 'Mangalorean', 'Steamed Mangalorean rice dumplings with coconut.', ['rice', 'coconut', 'mustard seeds', 'curry leaves', 'coconut oil'], ['Grind soaked rice coarsely with coconut and cook with a tempering into a dough.@600', 'Shape small balls.', 'Steam until firm.@900'], 'Eat with chicken curry.', '⚪', 210, [4, 40, 4], 20, 25),
  dish('Sanna', 'Mangalorean', 'Fluffy Mangalorean idli made with toddy or yeast.', ['rice', 'urad dal', 'coconut', 'yeast', 'sugar'], ['Grind soaked rice and urad dal with coconut, add yeast and sugar and ferment.@28800', 'Pour into moulds.', 'Steam until spongy.@900'], 'Pair with pork curry or chicken sukka.', '⚪', 200, [6, 36, 4], 20, 15),
  dish('Bagara Rice', 'Hyderabadi', 'Fragrant Hyderabadi rice with whole spices and fried onions.', ['rice', 'onion', 'mint', 'green chili', 'cinnamon', 'cloves', 'cardamom', 'bay leaf', 'ghee'], ['Fry whole spices and onion in ghee until golden.@480', 'Add washed rice, mint and green chili.@60', 'Add water and cook until fluffy.@900'], 'Serve with dalcha or mirchi ka salan.', '🍚', 320, [6, 56, 9]),
  dish('Dalcha', 'Hyderabadi', 'Hyderabadi lentils cooked with mutton and bottle gourd.', ['chana dal', 'lamb', 'bottle gourd', 'tamarind', 'onion', 'ginger garlic paste', 'chili powder', 'turmeric', 'curry leaves', 'vegetable oil'], ['Cook the dal soft.@1500', 'Cook the lamb with onion, ginger garlic paste and spices until tender.@2400', 'Add the dal, bottle gourd and tamarind and simmer. Temper with curry leaves.@900'], 'Serve with bagara rice.', '🥣', 380, [26, 30, 16], 15, 70, 'Medium'),
  dish('Ulavacharu', 'Andhra', 'Thick, smoky Andhra horse gram soup.', ['lentils', 'tamarind', 'onion', 'chili powder', 'cumin', 'garlic', 'curry leaves', 'vegetable oil'], ['Cook the horse gram (or lentils) in plenty of water and keep the stock.@2700', 'Simmer the stock with tamarind, onion and spices until thick and dark.@1800', 'Temper with garlic, cumin and curry leaves.@60'], 'Eat with rice and a spoon of cream.', '🥣', 200, [12, 28, 4], 10, 80),
  dish('Pesara Punugulu', 'Andhra', 'Crisp green moong fritters.', ['lentils', 'ginger', 'green chili', 'onion', 'cumin', 'vegetable oil'], ['Soak and grind moong coarsely with ginger and chili.@7200', 'Mix in onion and cumin.', 'Drop small spoonfuls into hot oil and fry crisp.@300'], 'Serve with ginger chutney.', '🟢', 220, [11, 24, 9], 15, 15),

  // Snacks
  dish('Thenkuzhal', 'Tamil', 'Plain, crunchy rice and urad dal murukku.', ['rice flour', 'urad dal', 'cumin', 'butter', 'vegetable oil'], ['Mix rice flour, roasted urad dal flour, cumin, butter, salt and water into a soft dough.', 'Press spirals into hot oil.', 'Fry until crisp.@300'], 'A Deepavali must.', '🌀', 160, [3, 20, 8], 15, 20),
  dish('Mullu Murukku', 'Tamil', 'Spiky murukku with chana dal flour.', ['rice flour', 'chana dal', 'sesame seeds', 'butter', 'chili powder', 'vegetable oil'], ['Mix the flours, sesame, chili, butter and salt with water into a dough.', 'Press through a star mould into hot oil.', 'Fry until crisp.@300'], 'The spikes make it extra crunchy.', '🌀', 160, [4, 20, 8], 15, 20),
  dish('Omapodi', 'Tamil', 'Thin carom-flavoured gram flour sev.', ['besan', 'rice flour', 'asafoetida', 'vegetable oil'], ['Make a soft dough of besan, rice flour, asafoetida, salt and carom water.', 'Press through the finest mould into hot oil.', 'Fry briefly until crisp.@120'], 'Fry in small batches.', '🍜', 150, [5, 16, 8], 10, 15),
  dish('Nippattu', 'Karnataka', 'Crisp Karnataka rice crackers with peanuts and curry leaves.', ['rice flour', 'peanuts', 'chana dal', 'curry leaves', 'chili powder', 'sesame seeds', 'vegetable oil'], ['Mix rice flour, crushed peanuts, soaked chana dal, curry leaves, chili, sesame and salt into a dough.', 'Pat very thin discs.', 'Fry until crisp.@240'], 'Prick them so they stay flat.', '🍪', 150, [4, 18, 7], 20, 20),
  dish('Kodubale', 'Karnataka', 'Ring-shaped crunchy rice snack.', ['rice flour', 'semolina', 'coconut', 'chili powder', 'cumin', 'butter', 'vegetable oil'], ['Mix the flours, coconut, chili, cumin and butter with hot water into a dough.', 'Roll ropes and form rings.', 'Fry on low heat until crisp.@480'], 'Fry slowly so the inside crisps.', '⭕', 160, [3, 20, 8], 20, 20),
  dish('Kerala Banana Chips', 'Kerala', 'Thin raw banana chips fried in coconut oil.', ['raw banana', 'turmeric', 'coconut oil'], ['Slice raw bananas paper-thin straight into hot coconut oil.', 'Fry until crisp, sprinkling turmeric salt water into the oil.@300', 'Drain and cool.'], 'Slice straight into the oil for the classic shape.', '🍌', 220, [1, 26, 13], 10, 20),
  dish('Jackfruit Chips', 'Kerala', 'Crisp raw jackfruit chips.', ['jackfruit', 'coconut oil'], ['Cut raw jackfruit bulbs into thin strips.', 'Fry in coconut oil until crisp.@420', 'Salt while hot.'], 'Oil your knife before cutting.', '🍈', 220, [2, 26, 12], 15, 20),
  dish('Achappam', 'Kerala', 'Lacy rose cookies of rice flour and coconut milk.', ['rice flour', 'coconut milk', 'egg', 'sugar', 'sesame seeds', 'coconut oil'], ['Whisk rice flour, coconut milk, egg, sugar and sesame into a batter.', 'Heat the mould in oil, dip in batter and lower into the oil.', 'Shake off and fry until crisp.@60'], 'The mould must be hot or the batter will not stick.', '🌸', 150, [3, 18, 7], 15, 30, 'Medium'),
  dish('Pazham Nirachathu', 'Kerala', 'Malabar ripe banana stuffed with coconut and jaggery.', ['banana', 'coconut', 'jaggery', 'cashews', 'raisins', 'cardamom', 'ghee', 'flour'], ['Cook coconut with jaggery, cashews, raisins and cardamom.@300', 'Slit ripe bananas and fill.', 'Dip in a flour batter and fry in ghee until golden.@240'], 'A Ramadan iftar treat.', '🍌', 320, [4, 52, 12]),
  dish('Sukhiyan', 'Kerala', 'Green gram and jaggery balls in crisp batter.', ['lentils', 'jaggery', 'coconut', 'cardamom', 'flour', 'vegetable oil'], ['Cook green gram with jaggery, coconut and cardamom until dry.@1200', 'Shape balls and dip in batter.', 'Fry until golden.@240'], 'A tea-time favourite.', '🟤', 230, [7, 36, 7], 15, 30),

  // Sweets
  dish('Rava Ladoo', 'Tamil', 'Semolina and coconut ladoos with ghee.', ['semolina', 'coconut', 'sugar', 'ghee', 'cardamom', 'cashews', 'raisins'], ['Roast semolina in ghee, then coconut.@480', 'Mix with powdered sugar, cardamom and fried nuts.', 'Shape into balls while warm.'], 'Sprinkle milk if it will not bind.', '🟡', 180, [3, 24, 8], 10, 15),
  dish('Maa Laddu', 'Tamil', 'Roasted gram and sugar ladoos.', ['chana dal', 'sugar', 'ghee', 'cardamom', 'cashews'], ['Grind roasted gram with sugar and cardamom.', 'Mix with hot ghee and cashews.', 'Shape firmly into balls.'], 'Hot ghee helps them bind.', '🟡', 190, [4, 24, 9], 10, 5),
  dish('Pal Kova', 'Tamil', 'Srivilliputhur milk sweet slow-cooked until thick.', ['milk', 'sugar', 'cardamom'], ['Boil milk in a wide pan, stirring, until it thickens.@3000', 'Add sugar and keep cooking until it leaves the pan.@600', 'Cool and shape.'], 'A wide heavy pan saves time.', '⬜', 220, [7, 30, 8], 5, 60, 'Medium'),
  dish('Jangiri', 'Tamil', 'Urad dal flower-shaped sweet in saffron syrup.', ['urad dal', 'sugar', 'saffron', 'cardamom', 'ghee'], ['Grind soaked urad dal into a fluffy batter.@7200', 'Pipe flower shapes into hot ghee and fry.@180', 'Soak in warm saffron syrup.@300'], 'Softer and thicker than jalebi.', '🌼', 240, [4, 40, 8], 20, 30, 'Medium'),
  dish('Badusha', 'Tamil', 'Flaky glazed sweet like a South Indian doughnut.', ['flour', 'ghee', 'yogurt', 'sugar', 'cardamom', 'baking powder'], ['Rub ghee into flour, add yogurt and baking powder and shape discs with a dent.', 'Fry on low heat until golden.@600', 'Soak in thick cardamom syrup.@120'], 'Fry slowly for flaky layers.', '🍩', 280, [3, 38, 13], 20, 25, 'Medium'),
  dish('Dharwad Peda', 'Karnataka', 'Caramelised milk fudge dusted with sugar.', ['milk', 'sugar', 'cardamom', 'ghee'], ['Cook milk down to khoya, stirring.@3000', 'Add sugar and roast until brown.@900', 'Shape and roll in sugar.'], 'Roast until deep brown for the real taste.', '🟤', 210, [6, 30, 8], 5, 70, 'Medium'),
  dish('Kajjikayalu', 'Andhra', 'Crisp half-moon pastries with coconut and jaggery.', ['flour', 'semolina', 'coconut', 'jaggery', 'cardamom', 'ghee', 'vegetable oil'], ['Cook coconut with jaggery and cardamom.@300', 'Roll small rounds of stiff dough, fill and crimp.', 'Fry until golden.@300'], 'Seal well so they do not burst.', '🥟', 240, [3, 34, 10], 25, 25, 'Medium'),

  // Meat and seafood specials
  special('Chicken Thokku', 'Tamil', 'chicken', 'Thick Tamil chicken thokku that clings to the meat.', ['onion', 'tomato', 'ginger garlic paste', 'chili powder', 'coriander powder', 'fennel seeds', 'curry leaves', 'vegetable oil'], ['Fry fennel, curry leaves and onion until golden, add ginger garlic paste.@480', 'Add tomato and spices and cook to a thick masala.@480', 'Add the chicken and cook until dry and coated.@1500'], 'Thokku should be thick enough to scoop.'),
  special('Mutton Thokku', 'Tamil', 'mutton', 'Slow-cooked spicy mutton thokku.', ['onion', 'tomato', 'ginger garlic paste', 'chili powder', 'coriander powder', 'fennel seeds', 'curry leaves', 'vegetable oil'], ['Cook the mutton tender.@2700', 'Fry fennel, onion, ginger garlic paste, tomato and spices.@600', 'Add the mutton and cook until thick and dark.@900'], 'Great with dosa.'),
  special('Egg Thokku', 'Tamil', 'egg', 'Boiled eggs in a thick onion tomato thokku.', ['onion', 'tomato', 'chili powder', 'coriander powder', 'fennel seeds', 'curry leaves', 'vegetable oil'], ['Boil and halve the eggs.@600', 'Cook onion, tomato and spices to a thick masala.@720', 'Add the eggs and toss.@120'], 'Quick lunch-box curry.'),
  special('Mutton Kola Urundai', 'Tamil', 'mutton', 'Spiced minced mutton balls with coconut and fennel.', ['onion', 'coconut', 'fennel seeds', 'chana dal', 'green chili', 'ginger', 'garlic', 'curry leaves', 'vegetable oil'], ['Grind minced mutton with roasted chana dal, coconut, fennel, chili, ginger and garlic.', 'Shape small balls.', 'Deep-fry until brown and cooked through.@600'], 'A Chettinad wedding starter.'),
  special('Chicken Kola Urundai', 'Tamil', 'chicken', 'Fried spiced chicken balls with fennel and coconut.', ['onion', 'coconut', 'fennel seeds', 'chana dal', 'green chili', 'ginger', 'garlic', 'curry leaves', 'vegetable oil'], ['Grind minced chicken with roasted chana dal, coconut, fennel, chili, ginger and garlic.', 'Shape small balls.', 'Deep-fry until golden.@480'], 'Serve with onion and lemon.'),
  special('Mutton Uppu Kari', 'Chettinad', 'mutton', 'Chettinad mutton cooked simply with shallots, chili and salt.', ['onion', 'chili powder', 'curry leaves', 'vegetable oil'], ['Fry shallots and dry chilies in oil.@300', 'Add the mutton and salt and cook covered until tender.@3000', 'Uncover and fry until dry with curry leaves.@600'], 'Few ingredients, big flavour.', 4),
  special('Chicken Uppu Kari', 'Chettinad', 'chicken', 'Simple Chettinad chicken with shallots and dry chili.', ['onion', 'chili powder', 'curry leaves', 'vegetable oil'], ['Fry shallots and dry chilies in oil.@300', 'Add the chicken and salt and cook until done.@1500', 'Fry until dry with curry leaves.@300'], 'Use small shallots if you can.', 4),
  special('Chicken Kothu Parotta', 'Tamil', 'chicken', 'Shredded parotta chopped on the griddle with chicken salna and egg.', ['flatbread', 'egg', 'onion', 'tomato', 'garam masala', 'curry leaves', 'vegetable oil'], ['Cook shredded chicken in a spicy salna.@1200', 'Fry onion, tomato and curry leaves, scramble in egg.@300', 'Add torn flatbread and chicken and chop together until mixed.@300'], 'The clanging spatulas are part of the fun.', 40),
  special('Mutton Kothu Parotta', 'Tamil', 'mutton', 'Madurai kothu parotta with mutton keema.', ['flatbread', 'egg', 'onion', 'tomato', 'garam masala', 'curry leaves', 'vegetable oil'], ['Cook minced mutton with spices until dry.@1500', 'Fry onion, tomato and curry leaves, scramble in egg.@300', 'Add torn flatbread and mutton and chop together.@300'], 'Add a splash of salna for moistness.', 40),
  special('Kerala Duck Roast', 'Kerala', 'chicken', 'Syrian Christian duck roast with black pepper, onions and coconut milk.', ['onion', 'black pepper', 'ginger', 'garlic', 'vinegar', 'coconut milk', 'curry leaves', 'coconut oil'], ['Marinate the duck with pepper, vinegar and salt and cook until tender.@2400', 'Fry onions, ginger, garlic and curry leaves until brown.@600', 'Add the duck and coconut milk and roast until thick.@900'], 'A Syrian Christian Christmas dish.', 10, 'duck'),
  special('Chemmeen Ularthiyathu', 'Kerala', 'prawn', 'Kerala prawns roasted dry with coconut slivers and pepper.', ['coconut', 'onion', 'black pepper', 'ginger', 'garlic', 'chili powder', 'curry leaves', 'coconut oil'], ['Cook prawns with chili, turmeric and salt.@300', 'Fry onion, ginger, garlic, coconut slivers and curry leaves until brown.@480', 'Add the prawns and pepper and roast until dry.@360'], 'Coconut slivers add crunch.'),
  special('Kerala Beef Ularthiyathu', 'Kerala', 'mutton', 'Slow-roasted Kerala beef with coconut slivers and pepper.', ['coconut', 'onion', 'black pepper', 'ginger', 'garlic', 'garam masala', 'curry leaves', 'coconut oil'], ['Pressure-cook the beef with spices until tender.@2400', 'Fry coconut slivers, onion, ginger, garlic and curry leaves.@480', 'Add the beef and roast until dark and dry.@900'], 'Cut the beef small so it roasts evenly.', 8, 'beef steak'),
  special('Nadan Mutta Curry', 'Kerala', 'egg', 'Kerala home-style egg curry with coconut milk.', ['coconut milk', 'onion', 'tomato', 'ginger', 'garlic', 'coriander powder', 'garam masala', 'curry leaves', 'coconut oil'], ['Boil and peel the eggs.@600', 'Fry onion, ginger, garlic and tomato with the spices in coconut oil.@600', 'Add coconut milk and the eggs and simmer.@300'], 'Serve with appam or rice.'),
  special('Gongura Mutton', 'Andhra', 'mutton', 'Andhra mutton cooked with sour sorrel leaves.', ['spinach', 'tamarind', 'onion', 'ginger garlic paste', 'chili powder', 'garam masala', 'vegetable oil'], ['Cook the mutton with onion, ginger garlic paste and chili until tender.@2700', 'Cook the leaves with tamarind to a sour paste.@600', 'Add to the mutton with garam masala and simmer.@600'], 'Gongura (sorrel) is traditional; spinach with tamarind is close.'),
  special('Gongura Chicken', 'Andhra', 'chicken', 'Tangy Andhra chicken with sorrel leaves.', ['spinach', 'tamarind', 'onion', 'ginger garlic paste', 'chili powder', 'garam masala', 'vegetable oil'], ['Cook the chicken with onion, ginger garlic paste and chili.@1200', 'Cook the leaves with tamarind to a sour paste.@600', 'Add and simmer.@600'], 'Sour, hot and addictive.'),
  special('Natu Kodi Pulusu', 'Andhra', 'chicken', 'Country chicken in a spicy, sour Andhra gravy.', ['onion', 'tomato', 'tamarind', 'ginger garlic paste', 'chili powder', 'coriander powder', 'garam masala', 'curry leaves', 'vegetable oil'], ['Fry onion, ginger garlic paste and tomato with the spices.@600', 'Add the chicken and tamarind water and simmer until tender.@2400', 'Finish with garam masala and curry leaves.'], 'Country chicken needs longer cooking.'),
  special('Guntur Chicken', 'Andhra', 'chicken', 'Fiery Guntur chicken fry with green chilies.', ['green chili', 'onion', 'ginger garlic paste', 'chili powder', 'curry leaves', 'lemon', 'vegetable oil'], ['Marinate the chicken with ginger garlic paste, chili powder and lemon.@1200', 'Fry onion, slit green chilies and curry leaves.@300', 'Add the chicken and fry until dry and charred.@1200'], 'Guntur is famous for its chilies.'),
  special('Nellore Chepala Pulusu', 'Andhra', 'fish', 'Nellore fish curry with raw mango and tamarind.', ['tamarind', 'mango', 'onion', 'tomato', 'chili powder', 'coriander powder', 'fenugreek seeds', 'curry leaves', 'vegetable oil'], ['Fry fenugreek seeds, curry leaves and onion, add tomato and spices.@480', 'Add tamarind water and raw mango and simmer.@600', 'Add the fish and cook gently.@600'], 'Raw mango gives the Nellore tang.', 12),
  special('Hyderabadi Keema', 'Hyderabadi', 'mutton', 'Minced mutton cooked with yogurt, mint and spices.', ['onion', 'yogurt', 'ginger garlic paste', 'garam masala', 'chili powder', 'mint', 'cilantro', 'vegetable oil'], ['Brown the onion and ginger garlic paste.@480', 'Add the minced mutton and spices and fry.@600', 'Add yogurt and cook until dry, then mint and cilantro.@900'], 'Serve with sheermal or naan.'),
  special('Talawa Gosht', 'Hyderabadi', 'mutton', 'Fried mutton pieces with fried onion and spices.', ['onion', 'ginger garlic paste', 'chili powder', 'garam masala', 'lemon', 'vegetable oil'], ['Cook the mutton with ginger garlic paste and spices until tender and dry.@2700', 'Fry the pieces with fried onion until crisp.@600', 'Finish with lemon.'], 'A Hyderabadi wedding favourite.'),
  special('Apollo Fish', 'Hyderabadi', 'fish', 'Hyderabadi restaurant-style spicy fried fish in yogurt sauce.', ['cornstarch', 'egg', 'yogurt', 'green chili', 'garlic', 'curry leaves', 'chili powder', 'vegetable oil'], ['Coat fish strips in egg, cornstarch and spices and fry.@360', 'Fry garlic, green chili and curry leaves, add yogurt and chili.@180', 'Toss in the fish.@90'], 'Toss quickly so the coating stays crisp.', 12),
  special('Chicken Majestic', 'Hyderabadi', 'chicken', 'Fried chicken strips tossed in a yogurt and curry leaf sauce.', ['cornstarch', 'egg', 'yogurt', 'green chili', 'garlic', 'curry leaves', 'vegetable oil'], ['Marinate chicken strips with egg and cornstarch and fry.@420', 'Fry garlic, green chili and curry leaves, add yogurt.@180', 'Toss in the chicken.@90'], 'A Hyderabadi bar-snack classic.', 12),
  special('Fish Moilee', 'Kerala', 'fish', 'Kerala fish in mild turmeric coconut milk.', ['coconut milk', 'onion', 'ginger', 'green chili', 'turmeric', 'tomato', 'curry leaves', 'coconut oil'], ['Fry the fish lightly with turmeric.@240', 'Cook onion, ginger, green chili and curry leaves without browning, add coconut milk.@420', 'Slide in the fish and tomato and simmer gently.@480'], 'Serve with appam.', 10),
  dish('Kerala Kadala Curry', 'Kerala', 'Black chickpeas in roasted coconut gravy.', ['chickpeas', 'coconut', 'onion', 'tomato', 'coriander powder', 'chili powder', 'garam masala', 'curry leaves', 'coconut oil'], ['Cook the chickpeas soft.@1800', 'Roast coconut with spices until brown and grind.@480', 'Cook onion and tomato, add chickpeas and the paste and simmer.@600'], 'Classic with puttu.', '🫘', 300, [12, 36, 12], 15, 50),
  dish('Varutharacha Sambar', 'Kerala', 'Kerala sambar with roasted coconut masala.', ['lentils', 'drumstick', 'pumpkin', 'eggplant', 'coconut', 'coriander powder', 'chili powder', 'tamarind', 'mustard seeds', 'curry leaves', 'coconut oil'], ['Cook the lentils soft.@1200', 'Roast coconut with spices and grind.@480', 'Cook the vegetables in tamarind water, add dal and paste and simmer. Temper.@900'], 'Roasted coconut gives the deep colour.', '🥘', 230, [10, 30, 9], 15, 40),
];
