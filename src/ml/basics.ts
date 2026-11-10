/**
 * Kitchen basics: things almost every home kitchen already has, so recipes may use them even
 * when they are not in the fridge scan. A person can report one they have run out of; from then
 * on it counts as missing like any other ingredient.
 * Names are canonical vocabulary entries (src/ml/data/ingredients.ts).
 */
export interface KitchenBasic {
  name: string;
  label: string;
  kind: 'Essentials' | 'Spices' | 'Fresh basics';
}

export const KITCHEN_BASICS: KitchenBasic[] = [
  { name: 'salt', label: 'Salt', kind: 'Essentials' },
  { name: 'black pepper', label: 'Black pepper', kind: 'Essentials' },
  { name: 'sugar', label: 'Sugar', kind: 'Essentials' },
  { name: 'vegetable oil', label: 'Cooking oil', kind: 'Essentials' },
  { name: 'water', label: 'Water', kind: 'Essentials' },
  { name: 'flour', label: 'Flour / atta', kind: 'Essentials' },
  { name: 'turmeric', label: 'Turmeric', kind: 'Spices' },
  { name: 'chili powder', label: 'Red chili powder', kind: 'Spices' },
  { name: 'cumin', label: 'Cumin seeds', kind: 'Spices' },
  { name: 'coriander powder', label: 'Coriander powder', kind: 'Spices' },
  { name: 'garam masala', label: 'Garam masala', kind: 'Spices' },
  { name: 'mustard seeds', label: 'Mustard seeds', kind: 'Spices' },
  { name: 'onion', label: 'Onion', kind: 'Fresh basics' },
  { name: 'garlic', label: 'Garlic', kind: 'Fresh basics' },
  { name: 'ginger', label: 'Ginger', kind: 'Fresh basics' },
  { name: 'green chili', label: 'Green chili', kind: 'Fresh basics' },
  { name: 'cilantro', label: 'Coriander leaves', kind: 'Fresh basics' },
  { name: 'lemon', label: 'Lemon', kind: 'Fresh basics' },
];

export const BASIC_NAMES = new Set(KITCHEN_BASICS.map((b) => b.name));

export const basicLabel = (name: string) => KITCHEN_BASICS.find((b) => b.name === name)?.label || name;

/** Basics the person still has: everything except the ones they reported missing. */
export const assumedBasics = (missing: Iterable<string>) => {
  const out = new Set(missing);
  return KITCHEN_BASICS.map((b) => b.name).filter((n) => !out.has(n));
};
