import test from 'node:test';
import assert from 'node:assert/strict';
import { recommend } from '../src/ml/recommender';
import { corpus } from '../src/ml/data/recipes';
import { assumedBasics } from '../src/ml/basics';

// The app always passes the kitchen basics it assumes are at home
const assumed = assumedBasics([]);

const pantryOf = (names: string[]) => names.map((name, i) => ({ id: String(i), name, quantity: '1', category: 'Produce', freshness: 'Fresh' })) as any;
const regionOf = new Map(corpus().map((r) => [r.id, r.region]));
const isIndian = (r: { id: string; region?: string }) => (r.region || regionOf.get(r.id)) === 'Indian';

// A pantry that leans Italian, so Indian dishes only lead when the switch is on
const italian = pantryOf(['Pasta', 'Tomato', 'Basil', 'Mozzarella', 'Parmesan', 'Garlic', 'Olive Oil', 'Zucchini', 'Onion', 'Chicken Breast']);

test('Indian focus: most of the list is Indian and listed first, with a few other cuisines', () => {
  const list = recommend(italian, { limit: 8, indianFocus: true, assumed }).map((r) => r.recipe);
  const indianCount = list.filter(isIndian).length;
  assert.ok(indianCount >= 5, `expected at least 5 Indian dishes, got ${indianCount}`);
  assert.ok(list.length - indianCount >= 1, 'expected at least one dish from another cuisine');
  const firstOther = list.findIndex((r) => !isIndian(r));
  assert.ok(list.slice(0, firstOther).every(isIndian) && firstOther >= 5, 'Indian dishes should come first');
});

test('Indian focus off: the same pantry is not dominated by Indian dishes', () => {
  const list = recommend(italian, { limit: 8, assumed }).map((r) => r.recipe);
  assert.ok(list.filter(isIndian).length <= 3);
});

test('Indian focus: a cuisine chosen in the filters wins over the switch', () => {
  const list = recommend(italian, { limit: 6, indianFocus: true, assumed, filters: { cuisine: 'Italian' } }).map((r) => r.recipe);
  assert.equal(list.filter(isIndian).length, 0);
});

test('Indian focus: Indian picks still use the pantry', () => {
  const pantry = pantryOf(['Paneer', 'Spinach', 'Tomato', 'Onion', 'Rice', 'Lentils', 'Potato', 'Cauliflower']);
  const list = recommend(pantry, { limit: 8, indianFocus: true, assumed }).map((r) => r.recipe).filter(isIndian);
  assert.ok(list.every((r) => r.matchedIngredients.length >= 2), 'every Indian pick should use at least two pantry items');
});

test('corpus covers every Indian region with at least eight dishes', () => {
  const counts: Record<string, number> = {};
  for (const r of corpus()) if (r.region === 'Indian') counts[r.cuisine] = (counts[r.cuisine] || 0) + 1;
  assert.equal(Object.keys(counts).length, 25);
  for (const [cuisine, n] of Object.entries(counts)) assert.ok(n >= 8, `${cuisine} has only ${n}`);
});
