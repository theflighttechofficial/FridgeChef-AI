/**
 * Turns a recipe's short method into steps a first-time cook can follow: a "get ready" step
 * with prep for every ingredient, each cooking step expanded with how to do it, the heat to use
 * and how to tell it is done, and a finishing step for tasting, garnish and serving.
 * Rule-based and fully offline, so it works for the bundled corpus and for terse AI recipes.
 */
import { CookingStep } from '../types';
import { BY_NAME, canonicalize } from './normalize';

type Heat = NonNullable<CookingStep['heat']>;

interface Technique {
  test: RegExp;
  // Generic rules only apply when nothing more specific matched
  fallback?: boolean;
  heat?: Heat;
  how: string[];
  cue: string;
}

// Checked in order; the first two that match a step are combined
const TECHNIQUES: Technique[] = [
  {
    test: /\bsoak/,
    heat: 'Off',
    how: ['Cover with at least twice their volume of cold water.', 'Leave at room temperature (or in the fridge if your kitchen is hot).', 'Drain and rinse before cooking.'],
    cue: 'They swell to about double the size.',
  },
  {
    test: /\bmarinat/,
    heat: 'Off',
    how: ['Mix the marinade in a bowl and taste it for salt first.', 'Coat every piece well; massage it in with your hands.', 'Cover and refrigerate. Longer is better, up to overnight.'],
    cue: 'Every piece is evenly coated.',
  },
  {
    test: /pressure cook/,
    heat: 'Medium-high',
    how: ['Add the ingredients with enough water to cover by about 2 cm.', 'Close the lid and cook on medium-high until the first whistle, then lower the heat.', 'Let the pressure drop on its own before opening the lid.'],
    cue: 'They mash easily between your fingers.',
  },
  {
    test: /\b(temper|tadka|tarka|splutter|crackle)|pop (the )?(mustard|cumin|seeds)/,
    heat: 'Medium',
    how: ['Heat the oil or ghee in a small pan until it shimmers.', 'Add the whole spices first and stand back: they pop.', 'Add the rest (curry leaves, chili, garlic) and stir for a few seconds.', 'Pour it over the dish right away while it sizzles.'],
    cue: 'The seeds crackle and the oil smells fragrant. Do not let them turn black.',
  },
  {
    test: /dry roast|toast/,
    heat: 'Medium-low',
    how: ['Use a dry pan with no oil.', 'Keep stirring or shaking the pan so nothing scorches.', 'Tip them onto a plate as soon as they are done; the hot pan keeps cooking them.'],
    cue: 'A shade darker and smells nutty and fragrant.',
  },
  {
    test: /onions?.*(golden|brown|caramel)|(golden|brown).*onions?/,
    heat: 'Medium',
    how: ['Heat the oil first, then add the onions with a pinch of salt (it speeds them up).', 'Stir every minute or so; lower the heat if the edges darken too fast.', 'Add a splash of water if they start to stick.'],
    cue: 'Soft and golden brown all over, about 8 to 10 minutes.',
  },
  {
    test: /oil separates|until (the )?oil|masala|spices?.*tomato|tomato.*spices?/,
    heat: 'Medium',
    how: ['Add the tomato and powdered spices to the pan and stir well.', 'Cook, stirring often and scraping the bottom of the pan.', 'Add a few spoons of water if the masala sticks or the spices smell like they are burning.'],
    cue: 'The masala turns thick and glossy and oil pools at the edges.',
  },
  {
    test: /deep[- ]fr/,
    heat: 'Medium-high',
    how: ['Heat at least 5 cm of oil in a deep, heavy pan.', 'Test with a small piece: it should rise to the top and sizzle at once.', 'Fry in small batches so the oil stays hot.', 'Lift out with a slotted spoon and drain on paper towels.'],
    cue: 'Deep golden and crisp, and it floats.',
  },
  {
    test: /shallow[- ]fr|pan[- ]fr|\bfry\b|\bfried\b/,
    heat: 'Medium-high',
    how: ['Heat a thin layer of oil until it shimmers.', 'Lay the pieces in without crowding the pan.', 'Leave them alone for a minute or two before turning so a crust can form.'],
    cue: 'Golden on both sides and cooked through.',
  },
  {
    test: /stir[- ]fry|wok|toss .*high|high heat/,
    heat: 'High',
    how: ['Have every ingredient chopped and next to the stove before you start: this goes fast.', 'Heat the pan until very hot, then add the oil.', 'Keep everything moving with a spatula; add the quickest-cooking items last.'],
    cue: 'Vegetables are bright and still crunchy, and the sauce coats everything.',
  },
  {
    test: /\b(sear|char|grill|griddle|tandoor|broil|brown|render)/,
    heat: 'High',
    how: ['Pat the pieces dry so they brown instead of steaming.', 'Get the pan or grill really hot before the food goes on.', 'Turn once a deep crust has formed; avoid moving them around.'],
    cue: 'Well browned with a few charred spots.',
  },
  {
    test: /\b(cook|fry|heat)\b.*\b(onions?|garlic|ginger|shallots?|aromatics)\b/,
    heat: 'Medium',
    how: ['Heat the oil first, then add the onion and cook for a few minutes on its own.', 'Add garlic and ginger once the onion softens; they burn faster.', 'Stir often and lower the heat if anything starts to catch.'],
    cue: 'Onion is soft and translucent and the garlic smells sweet, not burnt.',
  },
  {
    test: /\bwilt/,
    heat: 'Medium',
    how: ['Pile the greens on top; they look like a lot but shrink fast.', 'Stir and fold them through for a minute or two.'],
    cue: 'The leaves have just collapsed and are still bright green.',
  },
  {
    test: /\b(saut|soften|sweat)/,
    heat: 'Medium',
    how: ['Heat the oil, then add the ingredients.', 'Stir every so often so they cook evenly.', 'Turn the heat down if anything starts to brown too quickly.'],
    cue: 'Soft, fragrant and turning translucent.',
  },
  {
    test: /\bsimmer|\bstew|\bbraise|gravy/,
    heat: 'Low',
    how: ['Bring it to a boil, then turn the heat down until only small bubbles break the surface.', 'Partly cover the pan and stir every few minutes so nothing catches on the bottom.', 'Add a splash of hot water if it gets too thick.'],
    cue: 'Thickened to a coating consistency and the main ingredient is tender.',
  },
  {
    test: /boil|\bblanch|\bpasta\b|\bnoodles?\b/,
    heat: 'High',
    how: ['Bring a large pot of well-salted water to a rolling boil.', 'Add the food and stir once so nothing sticks together.', 'Drain, keeping a cup of the cooking water in case you need it.'],
    cue: 'Tender, with just a little bite left in the centre.',
  },
  {
    test: /\bsteam|\bpoach/,
    heat: 'Medium',
    how: ['Bring a few centimetres of water to a boil under the steamer.', 'Do not let the water touch the food.', 'Keep the lid on; every peek lets the steam out.'],
    cue: 'Cooked through and springy when pressed.',
  },
  {
    test: /\bdum\b|\blayer/,
    heat: 'Low',
    how: ['Layer evenly and do not press down.', 'Seal the lid tightly (foil under the lid works).', 'Cook on the lowest heat, ideally on a flat tawa under the pot.'],
    cue: 'Steam escapes when you lift the lid and the top layer is fluffy.',
  },
  {
    test: /\bbake|\broast\b|\boven/,
    heat: 'Medium-high',
    how: ['Preheat the oven fully before the tray goes in.', 'Spread everything out in one layer so it roasts rather than steams.', 'Turn the tray halfway through for even colour.'],
    cue: 'Golden at the edges and cooked through in the middle.',
  },
  {
    test: /\bknead|\bdough/,
    heat: 'Off',
    how: ['Add water a little at a time; you can add more but not take it back.', 'Push the dough away with the heel of your hand, fold it back, turn and repeat.', 'Cover and let it rest before rolling.'],
    cue: 'Smooth, soft and springs back slowly when pressed.',
  },
  {
    test: /\broll|\bshape|\bstuff/,
    heat: 'Off',
    how: ['Dust the surface lightly with flour so nothing sticks.', 'Roll from the centre outwards, turning as you go.', 'Keep the rest covered with a damp cloth so it does not dry out.'],
    cue: 'Even thickness all over.',
  },
  {
    test: /\bblend|\bgrind|\bpur[eé]e/,
    heat: 'Off',
    how: ['Let hot ingredients cool a little before blending.', 'Add a splash of water to help the blades turn.', 'Blend in short bursts, scraping down the sides.'],
    cue: 'Completely smooth with no visible bits.',
  },
  {
    test: /\bwhisk|\bbeat\b|\bwhip/,
    heat: 'Off',
    how: ['Use a big enough bowl so nothing splashes out.', 'Whisk in quick circles, lifting to add air.'],
    cue: 'Smooth, with no lumps.',
  },
  {
    test: /\bmash/,
    heat: 'Low',
    how: ['Use the back of a ladle or a masher right in the pan.', 'Leave some texture unless the recipe wants it smooth.'],
    cue: 'Creamy, with a few whole pieces left.',
  },
  {
    test: /\breduce|\bthicken/,
    heat: 'Medium',
    how: ['Cook uncovered so the liquid can evaporate.', 'Stir more often as it thickens so it does not catch.'],
    cue: 'It coats the back of a spoon and a line drawn through it stays.',
  },
  {
    test: /\b(coat|dredge|batter|crumb|bread(ed)?)\b/,
    heat: 'Off',
    how: ['Set up the coating in a wide, shallow dish.', 'Pat the pieces dry first so the coating sticks.', 'Shake off the excess before cooking.'],
    cue: 'Every piece has a thin, even coat.',
  },
  {
    test: /\b(skewer|thread)/,
    heat: 'Off',
    how: ['If using wooden skewers, soak them in water for 20 minutes so they do not burn.', 'Leave a little space between pieces so the heat reaches all sides.'],
    cue: 'Evenly loaded skewers with small gaps.',
  },
  {
    test: /\b(slice|chop|cube|dice|cut|shred|julienne|tear|pound)/,
    heat: 'Off',
    how: ['Use a sharp knife and a board that does not slide (a damp towel under it helps).', 'Curl your fingertips under on the hand holding the food.', 'Keep pieces the same size so they cook evenly.'],
    cue: 'Even pieces, ready to use.',
  },
  {
    test: /\b(season|sprinkle|rub)\b/,
    heat: 'Off',
    how: ['Sprinkle the seasoning from a little height so it lands evenly.', 'Toss or rub it in so every piece is coated.'],
    cue: 'Evenly seasoned all over.',
  },
  {
    test: /\b(dress|vinaigrette|drizzle)/,
    heat: 'Off',
    how: ['Whisk or shake the dressing so it comes together.', 'Add a little at a time, toss, then taste before adding more.'],
    cue: 'Lightly coated and tasting bright and balanced.',
  },
  {
    test: /\b(top|finish|fill|wrap|assemble|spread)\b/,
    heat: 'Off',
    how: ['Have every topping or filling ready before you start assembling.', 'Assemble just before eating so nothing goes soggy.'],
    cue: 'Assembled and ready to serve.',
  },
  {
    test: /\b(caramel|cure|hang|ferment|pickle)/,
    heat: 'Low',
    how: ['This step needs patience; do not rush it with higher heat.', 'Check on it now and then rather than walking away entirely.'],
    cue: 'Deep amber (for caramel) or firm and set (for cured and hung foods).',
  },
  {
    test: /\bmix|\bcombine|\btoss|\bstir|\bfold|\bmake\b|\bwarm\b|\bpour/,
    fallback: true,
    how: ['Add the ingredients and mix gently so nothing breaks up.', 'Taste and adjust salt as you go.'],
    cue: 'Everything is evenly combined.',
  },
  {
    test: /\brest|\bset\b|\bchill|\bcool/,
    heat: 'Off',
    how: ['Leave it undisturbed.', 'Cover loosely so it does not dry out.'],
    cue: 'Firm enough to slice or serve cleanly.',
  },
  {
    test: /\bserve|\bgarnish|\bplate/,
    fallback: true,
    heat: 'Off',
    how: ['Warm the plates or bowls if you can.', 'Spoon the main dish in first, then sides and garnish.'],
    cue: 'Plated and ready to eat.',
  },
  {
    test: /\bcook\b|\badd\b/,
    fallback: true,
    heat: 'Medium',
    how: ['Add the ingredients in the order listed and stir well after each.', 'Keep the heat at medium and stir every minute or two.'],
    cue: 'Everything is heated through and cooked.',
  },
];

// How to prepare one ingredient before cooking, by canonical name or by group
const PREP_BY_NAME: Record<string, string> = {
  onion: 'peel and chop finely',
  garlic: 'peel and mince (or crush)',
  ginger: 'peel with a spoon and grate',
  'ginger garlic paste': 'have it ready in a small bowl',
  'green chili': 'slit lengthways; remove the seeds for less heat',
  cilantro: 'wash, then chop the leaves and tender stems',
  'curry leaves': 'rinse and pat dry so they do not spit in hot oil',
  tomato: 'chop (or blend for a smoother gravy)',
  potato: 'peel and cut into even cubes; keep in water until needed',
  paneer: 'cut into cubes and soak in warm water for 10 minutes so it stays soft',
  tofu: 'press between towels for 10 minutes, then cube',
  rice: 'rinse until the water runs clear, then soak for 20 minutes',
  'basmati rice': 'rinse until the water runs clear, then soak for 20 minutes',
  yogurt: 'whisk until smooth',
  lemon: 'halve, ready to squeeze',
  egg: 'bring to room temperature',
  eggs: 'bring to room temperature',
  'coconut milk': 'shake the can well before opening',
  'bell pepper': 'remove the seeds and cut into squares or strips',
  carrot: 'peel and dice',
  mushroom: 'wipe clean and slice',
};

const PREP_BY_GROUP: Record<string, string> = {
  poultry: 'cut into bite-size pieces and pat dry',
  'red meat': 'trim excess fat, cut into pieces and pat dry',
  pork: 'cut into pieces and pat dry',
  fish: 'pat dry and check for bones',
  shellfish: 'peel, devein and rinse',
  pulse: 'rinse two or three times (soak first if using dried beans)',
  'leafy green': 'wash well in a big bowl of water and chop',
  brassica: 'cut into small florets or shred',
  'fresh veg': 'wash and chop into even pieces',
  'starchy root': 'peel and cut into even pieces',
  root: 'peel and dice',
  squash: 'peel, remove seeds and cube',
  'soft herb': 'wash, dry and chop',
  'soft cheese': 'cut or crumble',
  'hard cheese': 'grate',
  grain: 'rinse well',
  noodle: 'keep ready to cook at the end',
  pasta: 'keep ready to cook at the end',
};

const SPICE_GROUPS = new Set(['warm spice', 'spice blend', 'hot spice', 'sweet spice']);

const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const minutes = (secs?: number) => {
  if (!secs) return '';
  const m = Math.round(secs / 60);
  if (m >= 90) return `about ${Math.round((m / 60) * 2) / 2} hours`;
  return m <= 1 ? 'about a minute' : `about ${m} minutes`;
};

const canon = (raw: string) => canonicalize(raw)[0] || raw.toLowerCase();

export interface ElaborateInput {
  title: string;
  ingredients: string[]; // display or canonical names
  steps: Pick<CookingStep, 'instruction' | 'timerSeconds'>[];
  chefTip?: string;
  assumed?: string[]; // kitchen basics the recipe uses but the fridge scan did not list
}

/** Prep notes for the "get ready" step, one line per ingredient that needs preparing. */
export const prepList = (ingredients: string[]) => {
  const lines: string[] = [];
  const spices: string[] = [];
  for (const raw of ingredients) {
    const c = canon(raw);
    const def = BY_NAME.get(c);
    if (def && SPICE_GROUPS.has(def.group)) {
      spices.push(raw);
      continue;
    }
    const note = PREP_BY_NAME[c] || (def && PREP_BY_GROUP[def.group]);
    if (note) lines.push(`${title(raw)}: ${note}.`);
  }
  if (spices.length) lines.push(`Measure the spices (${spices.join(', ')}) into a small bowl. They cook in seconds, so have them ready.`);
  return lines;
};

const mentioned = (instruction: string, ingredients: string[]) => {
  const text = instruction.toLowerCase();
  return ingredients.filter((raw) => {
    const c = canon(raw);
    return text.includes(c) || text.includes(raw.toLowerCase()) || text.includes(c.split(' ')[0]);
  });
};

/** Expand one step: how to do it, heat and the doneness cue. */
export const elaborateStep = (instruction: string, timerSeconds?: number): Pick<CookingStep, 'details' | 'cue' | 'heat'> => {
  const text = instruction.toLowerCase();
  const all = TECHNIQUES.filter((t) => t.test.test(text));
  const specific = all.filter((t) => !t.fallback);
  const hits = (specific.length ? specific : all).slice(0, 2);
  if (!hits.length) return timerSeconds ? { cue: `Give it ${minutes(timerSeconds)}.` } : {};
  const details = [...new Set(hits.flatMap((h) => h.how))].slice(0, 4);
  const time = minutes(timerSeconds);
  return {
    details,
    heat: hits.find((h) => h.heat)?.heat,
    cue: time ? `${hits[0].cue} Usually ${time}.` : hits[0].cue,
  };
};

/** The full, beginner-friendly method for a recipe. */
export const elaborateRecipe = ({ title: dish, ingredients, steps, chefTip, assumed = [] }: ElaborateInput): CookingStep[] => {
  const all = [...new Set([...ingredients, ...assumed])];
  const planAhead = steps.some((s) => /overnight/i.test(s.instruction)) ? ['Plan ahead: part of this recipe needs to sit overnight.'] : [];
  const prep: CookingStep = {
    stepNumber: 1,
    kind: 'prep',
    title: 'Get everything ready',
    instruction: `Before you turn on the stove, wash, chop and measure everything for ${dish}.`,
    details: [...planAhead, ...prepList(all)].slice(0, 9),
    cue: 'Everything is chopped and within reach of the stove.',
    heat: 'Off',
    keyIngredients: all,
  };

  const cooking: CookingStep[] = steps.map((s, i) => ({
    stepNumber: i + 2,
    kind: 'cook',
    instruction: s.instruction,
    timerSeconds: s.timerSeconds,
    keyIngredients: mentioned(s.instruction, all),
    ...elaborateStep(s.instruction, s.timerSeconds),
  }));

  const hasHerb = all.some((i) => canon(i) === 'cilantro');
  const hasLemon = all.some((i) => canon(i) === 'lemon');
  const finish: CookingStep = {
    stepNumber: steps.length + 2,
    kind: 'serve',
    title: 'Taste, finish and serve',
    instruction: 'Taste before serving and adjust until it tastes right to you.',
    details: [
      'Add salt a pinch at a time, stirring and tasting after each.',
      hasLemon ? 'If it tastes flat, a squeeze of lemon brightens it.' : 'If it tastes flat, a little acid (lemon, vinegar) or a pinch of salt usually fixes it.',
      hasHerb ? 'Scatter chopped coriander leaves over the top.' : 'Garnish just before serving so it stays fresh.',
      'Serve hot.',
    ],
    cue: 'Seasoned to your taste and steaming hot.',
    heat: 'Off',
    chefTip,
  };
  return [prep, ...cooking, finish];
};
