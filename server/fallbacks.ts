/**
 * Offline answers, used when both Gemini and Groq fail.
 *
 * Every AI route has:
 *   - a plain-language message (sent in the X-AI-Fallback-Message header, shown to the user as a notice)
 *   - an answer in the shape its UI expects, built from the request input wherever that is possible
 *     without a model (ingredient names, dish ideas, household members). Image and audio routes
 *     can't be answered offline, so they say so instead of inventing results.
 */
import type { Request, Response } from 'express';

const MESSAGES: Record<string, string> = {
  'analyze-fridge': "We couldn't analyse your photo right now. Add ingredients by hand below, or try the photo again in a minute.",
  'generate-recipes': 'AI recipes are unavailable right now, so these are simple recipes built from your ingredients.',
  tts: 'AI voice is unavailable, so your browser voice will read the steps instead.',
  'analyze-receipt': "We couldn't read your receipt right now. The items shown are an example, not your receipt.",
  'household-memory-insight': 'Personal insights are offline right now. This summary is based only on your current fridge.',
  'autonomous-decision': "The meal picker is offline, so this pick is based on what's in your fridge and expiring first.",
  'ingredient-substitutes': 'Substitution AI is offline. These swaps come from a standard kitchen reference.',
  'evolve-recipe': 'Recipe variations are offline. These are standard variations, not tailored ones.',
  'chef-persona-recipe': 'Chef personas are offline. This is a stock recipe in that style.',
  'pantry-challenge-score': 'The AI judge is offline, so this score is a rough estimate from your ingredient count.',
  'budget-meal-plan': 'Budget planning is offline. These prices are typical estimates, not live prices.',
  'household-dinner-for-everyone': 'Household planning is offline. This plan uses general adjustments for each member.',
  'conversational-kitchen-agent': "The kitchen assistant can't think right now. Try again in a minute.",
  'analyze-plate-photo': "We couldn't score your plate photo right now. The scores shown are an example, not your dish.",
  'event-catering-plan': 'Event planning is offline. This is a standard plan scaled to your guest count.',
  'autonomous-agent-plan': 'The weekly planner is offline. This is a sample week to show how it works.',
};

const DEFAULT_MESSAGE = 'The AI service is unavailable right now, so you are seeing sample results.';

/** Mark a response as offline data and attach the route's message. */
export const markFallback = (req: Request, res: Response) => {
  const route = req.path.replace(/^\/api\//, '');
  res.set('X-AI-Fallback', '1');
  res.set('X-AI-Fallback-Message', encodeURIComponent(MESSAGES[route] || DEFAULT_MESSAGE));
  res.set('Access-Control-Expose-Headers', 'X-AI-Fallback, X-AI-Fallback-Message');
};

// ---------- Helpers ----------

const names = (list: unknown): string[] =>
  (Array.isArray(list) ? list : [])
    .map((i: any) => (typeof i === 'string' ? i : i?.name))
    .filter((n: unknown): n is string => typeof n === 'string' && !!n.trim())
    .map((n) => n.trim());

const expiringFirst = (list: unknown): string[] => {
  const arr = Array.isArray(list) ? list : [];
  const soon = arr.filter((i: any) => /use soon|expir/i.test(i?.freshness || '')).map((i: any) => i.name);
  return [...new Set([...names(soon), ...names(arr)])];
};

const has = (list: string[], words: string[]) => list.find((n) => words.some((w) => n.toLowerCase().includes(w)));

const MEAT = ['chicken', 'beef', 'lamb', 'mutton', 'pork', 'turkey', 'fish', 'salmon', 'prawn', 'shrimp', 'tuna', 'cod'];
const VEG_PROTEIN = ['paneer', 'tofu', 'egg', 'lentil', 'dal', 'chickpea', 'bean', 'tempeh'];
const GRAINS = ['rice', 'pasta', 'noodle', 'quinoa', 'bread', 'roti', 'oats', 'couscous'];

// ---------- Route builders ----------

export const offlineFridgeAnalysis = () => ({ detectedIngredients: [], suggestedRecipes: [] });

export const offlineTts = () => ({ audioBase64: null, useBrowserVoice: true });

/** Rule-based recipes from the user's own ingredients, in the same shape as AI recipes. */
export const offlineRecipes = (body: any) => {
  const ingredients = names(body?.ingredients);
  const dietary: string[] = Array.isArray(body?.dietary) ? body.dietary : [];
  const vegetarian = dietary.some((d) => /veg/i.test(d));
  const pool = vegetarian ? ingredients.filter((n) => !MEAT.some((m) => n.toLowerCase().includes(m))) : ingredients;

  const protein = has(pool, vegetarian ? VEG_PROTEIN : [...MEAT, ...VEG_PROTEIN]);
  const grain = has(pool, GRAINS);
  const veg = pool.filter((n) => n !== protein && n !== grain).slice(0, 3);
  const vegLabel = veg.length ? veg.slice(0, 2).join(' & ') : 'Seasonal Vegetables';
  const base = (
    title: string,
    matched: string[],
    missing: string[],
    steps: string[],
    extra: { description: string; prepTimeMinutes: number; cookTimeMinutes: number; calories: number; difficulty: string; cuisine: string; dietaryTags?: string[] }
  ) => ({
    title,
    matchedIngredients: matched.filter(Boolean),
    missingIngredients: missing,
    dietaryTags: vegetarian ? ['Vegetarian'] : [],
    servings: 2,
    macros: { protein: '20g', carbs: '35g', fat: '12g' },
    chefTip: 'Taste and adjust salt and acid at the end; it makes the biggest difference.',
    steps: steps.map((instruction, i) => ({ stepNumber: i + 1, instruction })),
    ...extra,
  });

  const recipes = [
    base(
      `${protein || 'Garlic'} & ${vegLabel} Stir-Fry`,
      [protein || '', ...veg],
      ['Garlic', 'Soy sauce'],
      [
        `Cut ${[protein, ...veg].filter(Boolean).join(', ') || 'the vegetables'} into bite-size pieces.`,
        'Heat 1 tbsp oil in a wide pan over high heat until shimmering.',
        `Cook ${protein ? `the ${protein.toLowerCase()} first until browned, then add` : 'add'} the vegetables and stir-fry for 4 to 5 minutes.`,
        'Add a splash of soy sauce and a crushed garlic clove, toss for 1 minute, and serve hot.',
      ],
      { description: `A quick high-heat stir-fry using ${[protein, ...veg].filter(Boolean).join(', ') || 'what you have'}.`, prepTimeMinutes: 10, cookTimeMinutes: 10, calories: 420, difficulty: 'Easy', cuisine: 'Pan-Asian' }
    ),
    base(
      `One-Pot ${grain || 'Rice'} with ${vegLabel}`,
      [grain || '', ...veg],
      grain ? ['Stock cube'] : ['Rice', 'Stock cube'],
      [
        'Soften a chopped onion in 1 tbsp oil for 3 minutes.',
        `Add ${veg.join(', ') || 'the vegetables'} and cook for 2 minutes.`,
        `Stir in 1 cup ${(grain || 'rice').toLowerCase()} and 2 cups water or stock. Simmer covered until tender.`,
        'Rest for 5 minutes off the heat, fluff, and season to taste.',
      ],
      { description: 'A simple one-pot dish that uses up loose vegetables.', prepTimeMinutes: 8, cookTimeMinutes: 20, calories: 450, difficulty: 'Easy', cuisine: 'Home Style' }
    ),
    base(
      `${vegLabel} Masala`,
      veg,
      ['Onion', 'Tomato', 'Garam masala'],
      [
        'Fry a chopped onion in oil until golden, about 6 minutes.',
        'Add 1 tsp each of ginger-garlic paste and garam masala; cook for 1 minute.',
        `Add a chopped tomato and ${veg.join(', ') || 'the vegetables'}, with a splash of water. Simmer for 10 minutes.`,
        'Finish with a squeeze of lemon and serve with rice or bread.',
      ],
      { description: 'A gently spiced curry that suits most vegetables.', prepTimeMinutes: 10, cookTimeMinutes: 20, calories: 380, difficulty: 'Easy', cuisine: 'Indian (North)', dietaryTags: ['Vegetarian'] }
    ),
  ];

  const maxTime = Number(body?.maxPrepTime) || 0;
  const fitting = maxTime > 0 && maxTime < 60 ? recipes.filter((r) => r.prepTimeMinutes + r.cookTimeMinutes <= maxTime) : recipes;
  return { recipes: fitting.length ? fitting : recipes };
};

/** Small per-route adjustments so canned answers reflect what the user sent. */
export const personalise = (route: string, body: any, sample: any) => {
  try {
    switch (route) {
      case 'pantry-challenge-score': {
        const used = names(body?.selectedIngredients);
        const count = used.length;
        return {
          ...sample,
          challengeDishTitle: body?.userDishIdea?.trim() || (count ? `${used.slice(0, 2).join(' & ')} Pantry Skillet` : sample.challengeDishTitle),
          ingredientUtilization: Math.min(98, 50 + count * 8),
          xpEarned: 100 + count * 40,
          feedbackQuote: count
            ? `You used ${count} ingredient${count === 1 ? '' : 's'}: ${used.join(', ')}. Nice work keeping them out of the bin.`
            : sample.feedbackQuote,
        };
      }
      case 'household-memory-insight': {
        const fridge = expiringFirst(body?.currentIngredients);
        if (!fridge.length) return sample;
        return {
          ...sample,
          conversationalGreeting: `You have ${fridge.length} items in the fridge. ${fridge[0]} is the one to use first.`,
          tailoredSuggestion: `Something simple with ${fridge.slice(0, 2).join(' and ')}.`,
          memorySyncStatus: 'Offline summary',
        };
      }
      case 'autonomous-decision': {
        const fridge = expiringFirst(body?.currentIngredients);
        if (!fridge.length) return sample;
        const use = fridge.slice(0, 3);
        return {
          recommendedMeal: {
            ...sample.recommendedMeal,
            title: `${use.join(', ')} Skillet`,
            expiringIngredientsUsed: use,
            briefWhy: `Uses ${use.join(', ')}, which should be eaten first, in one pan.`,
            steps: [
              { stepNumber: 1, instruction: `Chop ${use.join(', ')} into even pieces.`, timerSeconds: 180 },
              { stepNumber: 2, instruction: 'Heat 1 tbsp oil in a skillet over medium-high heat.', timerSeconds: 60 },
              { stepNumber: 3, instruction: 'Cook the firmest items first, then add the rest. Season with salt, pepper and garlic.', timerSeconds: 480 },
              { stepNumber: 4, instruction: 'Finish with lemon or yoghurt and serve with rice or bread.', timerSeconds: 60 },
            ],
          },
        };
      }
      case 'household-dinner-for-everyone': {
        const members = Array.isArray(body?.members) ? body.members : [];
        const shared = names(body?.availableIngredients).slice(0, 6);
        if (!members.length) return { ...sample, sharedBaseIngredients: shared.length ? shared : sample.sharedBaseIngredients };
        return {
          ...sample,
          sharedBaseIngredients: shared.length ? shared : sample.sharedBaseIngredients,
          memberModifications: members.slice(0, 6).map((m: any, i: number) => {
            const tmpl = sample.memberModifications[i % sample.memberModifications.length];
            const diet = [m?.dietary, ...(Array.isArray(m?.restrictions) ? m.restrictions : [])].flat().filter(Boolean).join(' • ');
            return { ...tmpl, memberName: m?.name || tmpl.memberName, memberDietary: diet || tmpl.memberDietary };
          }),
        };
      }
      default:
        return sample;
    }
  } catch {
    return sample;
  }
};
