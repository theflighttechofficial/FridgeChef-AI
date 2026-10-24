import { HouseholdMemoryProfile } from '../types';
import { Account } from '../auth/account';

/** A new household: just the account holder, with what they told us during setup. */
export const blankHousehold = (account: Account | null): HouseholdMemoryProfile => ({
  householdName: account ? `${account.name.split(' ')[0]}'s kitchen` : 'My kitchen',
  members: [
    {
      id: 'self',
      name: account?.name || 'You',
      role: 'Self',
      dislikedIngredients: [],
      allergens: [],
      spiceTolerance: 3,
      favoriteCuisines: account?.regions || [],
      notes: account?.dietary.length ? account.dietary.join(', ') : undefined,
    },
  ],
  overallSpiceTolerance: 3,
  favoriteCuisines: account?.regions || [],
  dislikedIngredients: [],
  typicalMealTimes: { breakfast: '08:00', lunch: '13:00', dinner: '20:00' },
  preferredAppliances: [],
  frequentlyPurchased: [],
  budgetTier: 'Balanced',
  cookingSkillLevel: 'Intermediate',
  lovedRecipes: [],
  dislikedRecipes: [],
  learnedInsights: [],
});
