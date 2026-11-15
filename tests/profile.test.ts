import test from 'node:test';
import assert from 'node:assert/strict';
import { ACCOUNT_KEY, SESSION_KEY, VaultSnapshot, collectVaultData, planRestore } from '../src/state/vaultPlan';
import { DEFAULT_PROFILE, TasteProfile, describeTasteProfile, profileScore, recipeHeat } from '../src/state/tasteProfile';
import { recommend } from '../src/ml/recommender';
import { BY_NAME } from '../src/ml/normalize';
import { corpus } from '../src/ml/data/recipes';

const account = JSON.stringify({ name: 'Uma S', salt: 's', hash: 'h' });
const snapshot = (deviceId: string): VaultSnapshot => ({
  version: 1,
  deviceId,
  savedAt: '2026-11-15T00:00:00Z',
  data: { [ACCOUNT_KEY]: account, 'fridgechef.u.savedRecipes': '[1]' },
});

test('device vault: keeps personal data, leaves out the session flag, other apps and huge photos', () => {
  const data = collectVaultData([
    [ACCOUNT_KEY, account],
    [SESSION_KEY, '{"signedIn":true}'],
    ['fridgechef.u.shoppingList', '[]'],
    ['fridgechef.u.fridgePhoto', 'x'.repeat(300_000)],
    ['other.app', '1'],
  ]);
  assert.deepEqual(Object.keys(data).sort(), [ACCOUNT_KEY, 'fridgechef.u.shoppingList'].sort());
});

test('device vault: a reinstall on the same phone signs the person back in with their data', () => {
  const plan = planRestore(false, snapshot('phone-1'), 'phone-1');
  assert.ok(plan);
  assert.equal(plan.autoSignIn, true);
  assert.equal(plan.name, 'Uma S');
  assert.equal(plan.writes['fridgechef.u.savedRecipes'], '[1]');
  assert.deepEqual(JSON.parse(plan.writes[SESSION_KEY]), { signedIn: true });
});

test('device vault: a copy from another phone is restored but still asks for the password', () => {
  const plan = planRestore(false, snapshot('phone-1'), 'phone-2');
  assert.ok(plan);
  assert.equal(plan.autoSignIn, false);
  assert.deepEqual(JSON.parse(plan.writes[SESSION_KEY]), { signedIn: false });
});

test('device vault: never overwrites an existing account and ignores empty or broken copies', () => {
  assert.equal(planRestore(true, snapshot('phone-1'), 'phone-1'), null);
  assert.equal(planRestore(false, null, 'phone-1'), null);
  assert.equal(planRestore(false, { ...snapshot('phone-1'), data: {} }, 'phone-1'), null);
  assert.equal(planRestore(false, { ...snapshot('phone-1'), data: { [ACCOUNT_KEY]: '{broken' } }, 'phone-1'), null);
});

const groupOf = (n: string) => BY_NAME.get(n)?.group;
const profile = (patch: Partial<TasteProfile>): TasteProfile => ({ ...DEFAULT_PROFILE, completedAt: 'x', ...patch });
const dish = (patch: Partial<Parameters<typeof profileScore>[0]>) => ({
  ingredients: ['rice', 'onion'], tags: [], difficulty: 'Easy' as const, minutes: 20, calories: 400, protein: 10, cuisine: 'Punjabi', ...patch,
});

test('taste profile: avoided ingredients sink a dish, loved ones lift it', () => {
  const p = profile({ loves: ['paneer-cheese'], avoids: ['mushroom'] });
  const plain = profileScore(dish({}), p, groupOf);
  assert.ok(profileScore(dish({ ingredients: ['rice', 'paneer'] }), p, groupOf) > plain);
  assert.ok(profileScore(dish({ ingredients: ['rice', 'paneer', 'mushrooms'] }), p, groupOf) < plain - 3);
  assert.equal(profileScore(dish({}), null, groupOf), 0);
});

test('taste profile: heat, skill and time preferences move the score the right way', () => {
  const hotDish = dish({ ingredients: ['chicken', 'green chili', 'chili powder', 'hot sauce'] });
  assert.equal(recipeHeat(hotDish.ingredients), 3);
  assert.ok(profileScore(hotDish, profile({ spice: 'fiery' }), groupOf) > profileScore(hotDish, profile({ spice: 'mild' }), groupOf));
  assert.ok(profileScore(dish({ difficulty: 'Hard' }), profile({ skill: 'beginner' }), groupOf) < profileScore(dish({ difficulty: 'Easy' }), profile({ skill: 'beginner' }), groupOf));
  assert.ok(profileScore(dish({ minutes: 90 }), profile({ weeknightMinutes: 30 }), groupOf) < profileScore(dish({ minutes: 25 }), profile({ weeknightMinutes: 30 }), groupOf));
});

test('taste profile: the recommender keeps avoided ingredients out of the top picks', () => {
  const pantry = ['Mushrooms', 'Paneer', 'Rice', 'Spinach', 'Tomato', 'Onion', 'Eggs', 'Potato'].map((name, i) => ({ id: String(i), name, quantity: '1', category: 'Produce', freshness: 'Fresh' })) as any;
  const without = recommend(pantry, { limit: 6 }).map((r) => r.recipe);
  const withProfile = recommend(pantry, { limit: 6, profile: profile({ avoids: ['mushroom'], loves: ['paneer-cheese'] }) }).map((r) => r.recipe);
  const usesMushroom = (r: { id: string }) => corpus().find((c) => c.id === r.id)?.ingredients.includes('mushrooms');
  assert.ok(without.some(usesMushroom), 'baseline should include a mushroom dish for this pantry');
  assert.equal(withProfile.filter(usesMushroom).length, 0);
});

test('taste profile: described in one sentence for cloud AI', () => {
  const text = describeTasteProfile(profile({ spice: 'hot', loves: ['chicken'], avoids: ['pork'], weeknightMinutes: 30 }), ['Indian']);
  assert.match(text, /hot heat/);
  assert.match(text, /loves chicken/);
  assert.match(text, /never use pork/);
  assert.match(text, /30 minutes/);
  assert.match(text, /Indian/);
  assert.equal(describeTasteProfile(null), '');
});
