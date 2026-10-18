/**
 * Shared types and labels for the recipe corpus files (recipes.ts, indian.ts, world.ts).
 *
 * Row format, expanded by `corpus()` in recipes.ts:
 *   [title, cuisine, description, tags, difficulty, prepMin, cookMin, kcal, servings,
 *    [proteinG, carbsG, fatG], emoji, ingredients (canonical names), steps, chefTip]
 * A step may end in "@<seconds>" to attach a timer.
 */
export type Row = [
  string, string, string, string[], 'Easy' | 'Medium' | 'Hard', number, number, number, number,
  [number, number, number], string, string[], string[], string,
];

export const VEG = 'Vegetarian';
export const VG = 'Vegan';
export const GF = 'Gluten-Free';
export const DF = 'Dairy-Free';
export const KETO = 'Keto';
export const LC = 'Low-Carb';
export const HP = 'High-Protein';
export const NF = 'Nut-Free';
export const PALEO = 'Paleo';

/** Every cuisine in the corpus, grouped by region (drives the cuisine filter). */
export const REGIONS: Record<string, string[]> = {
  Indian: [
    'Punjabi', 'North Indian', 'Mughlai', 'Awadhi', 'Kashmiri', 'Rajasthani', 'Gujarati', 'Maharashtrian', 'Goan',
    'Mangalorean', 'Sindhi', 'Parsi', 'Bengali', 'Odia', 'Bihari', 'Northeast Indian', 'Hyderabadi', 'Andhra',
    'Tamil', 'Chettinad', 'Kerala', 'Karnataka', 'Indo-Chinese', 'Indian Street Food', 'Indian Sweets',
  ],
  'South Asian': ['Pakistani', 'Sri Lankan', 'Nepali', 'Tibetan', 'Afghan'],
  'East Asian': ['Chinese', 'Cantonese', 'Sichuan', 'Taiwanese', 'Japanese', 'Korean'],
  'Southeast Asian': ['Thai', 'Vietnamese', 'Indonesian', 'Malaysian', 'Singaporean', 'Filipino', 'Burmese'],
  'Middle Eastern': ['Lebanese', 'Turkish', 'Persian', 'Israeli', 'Arabian'],
  African: ['Moroccan', 'Egyptian', 'Tunisian', 'Ethiopian', 'West African', 'South African'],
  European: [
    'Italian', 'French', 'Spanish', 'Portuguese', 'Greek', 'Mediterranean', 'British', 'Irish', 'German',
    'Hungarian', 'Polish', 'Russian', 'Scandinavian', 'Swiss',
  ],
  Americas: [
    'American', 'Southern & Cajun', 'Tex-Mex', 'Mexican', 'Caribbean', 'Cuban', 'Brazilian', 'Peruvian',
    'Argentine', 'Colombian', 'Canadian',
  ],
  Oceania: ['Australian', 'Hawaiian'],
  Fusion: ['Fusion'],
};

export const REGION_OF: Record<string, string> = Object.fromEntries(
  Object.entries(REGIONS).flatMap(([region, cuisines]) => cuisines.map((c) => [c, region]))
);

/** Region for any cuisine label, including free-text ones from AI ("Thai Street Food"). */
export const regionOfCuisine = (label: string): string | undefined => {
  if (REGION_OF[label]) return REGION_OF[label];
  const text = label.toLowerCase();
  if (text.includes('indian')) return 'Indian';
  const known = Object.keys(REGION_OF).find((c) => text.includes(c.toLowerCase()));
  return known ? REGION_OF[known] : undefined;
};

/** Whether a recipe fits the cuisine filter, which may be a cuisine or a whole region. */
export const cuisineMatches = (recipe: { cuisine: string; region?: string }, selected: string) => {
  if (!selected || selected === 'All') return true;
  if (recipe.cuisine.toLowerCase().includes(selected.toLowerCase())) return true;
  return !!REGIONS[selected] && (recipe.region || regionOfCuisine(recipe.cuisine)) === selected;
};
