import { Ingredient, PresetFridge, Recipe } from '../types';
import culinaryGourmetBowlImg from '../assets/images/culinary_gourmet_bowl_1790573492014.jpg';
import fridgeFreshProduceImg from '../assets/images/fridge_fresh_produce_1790573466291.jpg';
import fridgeProteinVeggieImg from '../assets/images/fridge_protein_veggie_1790573480832.jpg';

export const INITIAL_PRESET_FRIDGES: PresetFridge[] = [
  {
    id: 'preset-indian-spice',
    title: 'Indian Spice & Fresh Dairy Vault',
    subtitle: 'Fresh Paneer, Ghee, Kasuri Methi, Basmati Rice, Ginger-Garlic Paste, Fresh Cilantro, Turmeric, Tomatoes & Green Chiles',
    imageUrl: fridgeFreshProduceImg,
    ingredients: [
      { id: 'ind-1', name: 'Paneer (Indian Cottage Cheese)', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '400g block' },
      { id: 'ind-2', name: 'Fresh Cilantro (Coriander)', category: 'Produce', freshness: 'Fresh', quantity: '1 big bunch' },
      { id: 'ind-3', name: 'Roma Tomatoes', category: 'Produce', freshness: 'Fresh', quantity: '5 whole' },
      { id: 'ind-4', name: 'Red Onions', category: 'Produce', freshness: 'Fresh', quantity: '4 medium' },
      { id: 'ind-5', name: 'Green Chiles (Hari Mirch)', category: 'Produce', freshness: 'Fresh', quantity: '6 pcs' },
      { id: 'ind-6', name: 'Pure Cow Ghee', category: 'Pantry', freshness: 'Pantry Staple', quantity: '1 jar' },
      { id: 'ind-7', name: 'Aged Basmati Rice', category: 'Grains & Pulses', freshness: 'Pantry Staple', quantity: '1 kg bag' },
      { id: 'ind-8', name: 'Ginger-Garlic Paste', category: 'Condiments', freshness: 'Fresh', quantity: '1 tub' },
      { id: 'ind-9', name: 'Kasuri Methi (Dried Fenugreek)', category: 'Pantry', freshness: 'Pantry Staple', quantity: '1 box' },
      { id: 'ind-10', name: 'Greek Yogurt (Dahi)', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '1 tub (400g)' },
      { id: 'ind-11', name: 'Curry Leaves', category: 'Produce', freshness: 'Fresh', quantity: '1 fresh stalk' },
      { id: 'ind-12', name: 'Yellow Toor Dal / Lentils', category: 'Grains & Pulses', freshness: 'Pantry Staple', quantity: '500g bag' }
    ]
  },
  {
    id: 'preset-thai-asian',
    title: 'Thai & Pan-Asian Fresh Pantry',
    subtitle: 'Coconut Milk, Thai Red Curry Paste, Jasmine Rice, Lemongrass, Snap Peas, Thai Basil, Firm Tofu, Lime & Fish Sauce',
    imageUrl: fridgeProteinVeggieImg,
    ingredients: [
      { id: 'thai-1', name: 'Coconut Milk', category: 'Pantry', freshness: 'Pantry Staple', quantity: '2 cans (400ml)' },
      { id: 'thai-2', name: 'Thai Red Curry Paste', category: 'Condiments', freshness: 'Pantry Staple', quantity: '1 tub' },
      { id: 'thai-3', name: 'Fragrant Jasmine Rice', category: 'Grains & Pulses', freshness: 'Pantry Staple', quantity: '1 bag' },
      { id: 'thai-4', name: 'Lemongrass Stalks', category: 'Produce', freshness: 'Fresh', quantity: '3 stalks' },
      { id: 'thai-5', name: 'Fresh Thai Basil', category: 'Produce', freshness: 'Fresh', quantity: '1 bunch' },
      { id: 'thai-6', name: 'Firm Tofu', category: 'Grains & Pulses', freshness: 'Fresh', quantity: '1 block (400g)' },
      { id: 'thai-7', name: 'Sugar Snap Peas', category: 'Produce', freshness: 'Fresh', quantity: '200g' },
      { id: 'thai-8', name: 'Limes', category: 'Produce', freshness: 'Fresh', quantity: '4 whole' },
      { id: 'thai-9', name: 'Soy Sauce & Fish Sauce', category: 'Condiments', freshness: 'Pantry Staple', quantity: '1 bottle each' }
    ]
  },
  {
    id: 'preset-american-diner',
    title: 'American Classic Grill & Smokehouse',
    subtitle: 'Ground Turkey / Beef, Sharp Cheddar, Sweet Potatoes, Hickory BBQ Sauce, Brioche Buns, Sweet Corn & Bacon',
    imageUrl: fridgeFreshProduceImg,
    ingredients: [
      { id: 'amer-1', name: 'Lean Ground Beef (90/10)', category: 'Meat & Seafood', freshness: 'Fresh', quantity: '500g' },
      { id: 'amer-2', name: 'Chicken Thighs', category: 'Meat & Seafood', freshness: 'Fresh', quantity: '600g pack' },
      { id: 'amer-3', name: 'Sharp Cheddar Slices', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '1 pack (10 slices)' },
      { id: 'amer-4', name: 'Sweet Potatoes', category: 'Produce', freshness: 'Fresh', quantity: '3 large' },
      { id: 'amer-5', name: 'Hickory BBQ Sauce', category: 'Condiments', freshness: 'Pantry Staple', quantity: '1 bottle' },
      { id: 'amer-6', name: 'Sweet Corn on Cob', category: 'Produce', freshness: 'Fresh', quantity: '2 cobs' },
      { id: 'amer-7', name: 'Thick-Cut Bacon', category: 'Meat & Seafood', freshness: 'Fresh', quantity: '6 strips' },
      { id: 'amer-8', name: 'Brioche Buns', category: 'Bakery', freshness: 'Fresh', quantity: '4 pack' },
      { id: 'amer-9', name: 'Dill Pickles', category: 'Condiments', freshness: 'Pantry Staple', quantity: '1 jar' }
    ]
  },
  {
    id: 'preset-fresh-produce',
    title: 'Fresh Harvest & Dairy Stash',
    subtitle: 'Abundant bell peppers, tomatoes, fresh spinach, eggs, cheddar, sourdough & garlic butter',
    imageUrl: fridgeFreshProduceImg,
    ingredients: [
      { id: 'i1', name: 'Eggs', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '8 large' },
      { id: 'i2', name: 'Cherry Tomatoes', category: 'Produce', freshness: 'Fresh', quantity: '1 pint' },
      { id: 'i3', name: 'Baby Spinach', category: 'Produce', freshness: 'Fresh', quantity: '1 bag' },
      { id: 'i4', name: 'Bell Peppers', category: 'Produce', freshness: 'Fresh', quantity: '2 red, 1 yellow' },
      { id: 'i5', name: 'Cheddar Cheese', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '200g block' },
      { id: 'i6', name: 'Garlic', category: 'Produce', freshness: 'Pantry Staple', quantity: '1 bulb' },
      { id: 'i7', name: 'Heavy Cream', category: 'Dairy & Eggs', freshness: 'Use Soon', quantity: '1/2 carton' },
      { id: 'i8', name: 'Butter', category: 'Dairy & Eggs', freshness: 'Pantry Staple', quantity: '1 stick' },
      { id: 'i9', name: 'Sourdough Bread', category: 'Bakery', freshness: 'Fresh', quantity: '4 slices' },
      { id: 'i10', name: 'Greek Yogurt', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '1 tub' }
    ]
  },
  {
    id: 'preset-protein-veggie',
    title: 'High-Protein & Green Power',
    subtitle: 'Fresh salmon fillets, chicken breast, broccoli florets, avocado, Greek yogurt & lemon',
    imageUrl: fridgeProteinVeggieImg,
    ingredients: [
      { id: 'p1', name: 'Salmon Fillets', category: 'Meat & Seafood', freshness: 'Fresh', quantity: '2 fillets (350g)' },
      { id: 'p2', name: 'Chicken Breast', category: 'Meat & Seafood', freshness: 'Fresh', quantity: '2 pieces' },
      { id: 'p3', name: 'Broccoli Florets', category: 'Produce', freshness: 'Fresh', quantity: '1 head' },
      { id: 'p4', name: 'Avocado', category: 'Produce', freshness: 'Use Soon', quantity: '2 ripe' },
      { id: 'p5', name: 'Greek Yogurt', category: 'Dairy & Eggs', freshness: 'Fresh', quantity: '1 large tub' },
      { id: 'p6', name: 'Lemons', category: 'Produce', freshness: 'Fresh', quantity: '3 whole' },
      { id: 'p7', name: 'Soy Sauce', category: 'Condiments', freshness: 'Pantry Staple', quantity: '1 bottle' },
      { id: 'p8', name: 'Honey', category: 'Pantry', freshness: 'Pantry Staple', quantity: '1 jar' },
      { id: 'p9', name: 'Olive Oil', category: 'Pantry', freshness: 'Pantry Staple', quantity: '1 bottle' },
      { id: 'p10', name: 'Fresh Herbs (Dill/Parsley)', category: 'Produce', freshness: 'Use Soon', quantity: '1 bundle' }
    ]
  },
  {
    id: 'preset-asian-fermented',
    title: 'Asian Umami & Fermented Pantry',
    subtitle: 'Tofu, Aged Kimchi, Miso Paste, Shiitake Mushrooms, Sesame Oil, Bok Choy & Edamame',
    imageUrl: fridgeProteinVeggieImg,
    ingredients: [
      { id: 'a1', name: 'Firm Tofu', category: 'Grains & Pulses', freshness: 'Fresh', quantity: '1 block (400g)' },
      { id: 'a2', name: 'Aged Kimchi', category: 'Fermented', freshness: 'Fresh', quantity: '1 jar (300g)' },
      { id: 'a3', name: 'Red Miso Paste', category: 'Fermented', freshness: 'Pantry Staple', quantity: '1 tub' },
      { id: 'a4', name: 'Shiitake Mushrooms', category: 'Produce', freshness: 'Fresh', quantity: '150g' },
      { id: 'a5', name: 'Baby Bok Choy', category: 'Produce', freshness: 'Fresh', quantity: '3 heads' },
      { id: 'a6', name: 'Toasted Sesame Oil', category: 'Condiments', freshness: 'Pantry Staple', quantity: '1 bottle' },
      { id: 'a7', name: 'Edamame Beans', category: 'Grains & Pulses', freshness: 'Frozen', quantity: '1 bag' }
    ]
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  // 🇮🇳 INDIAN CUISINES
  {
    id: 'rec-butter-paneer-masala',
    title: 'North Indian Butter Paneer Tikka Masala',
    description: 'Golden-seared paneer cubes simmered in a velvety, buttery tomato gravy infused with kasuri methi, ginger, and cardamom.',
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    calories: 520,
    difficulty: 'Medium',
    cookingMethod: 'Claypot Braising',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Protein'],
    cuisine: 'Indian (North & South)',
    matchedIngredients: ['Paneer (Indian Cottage Cheese)', 'Roma Tomatoes', 'Red Onions', 'Ginger-Garlic Paste', 'Pure Cow Ghee', 'Kasuri Methi (Dried Fenugreek)', 'Greek Yogurt (Dahi)'],
    missingIngredients: ['Garam Masala', 'Heavy Cream', 'Cashew Paste'],
    macros: { protein: '28g', carbs: '18g', fat: '38g' },
    servings: 3,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Crush dried kasuri methi between your palms right before stirring into the simmering butter sauce to release fragrant essential oils.',
    steps: [
      { stepNumber: 1, instruction: 'Cube paneer into 1-inch pieces. Sear lightly in ghee for 2 minutes until pale golden on edges.', timerSeconds: 120 },
      { stepNumber: 2, instruction: 'Sauté chopped onions and ginger-garlic paste in ghee until golden brown. Add pureed tomatoes and spices.', timerSeconds: 360 },
      { stepNumber: 3, instruction: 'Simmer gravy over low flame for 8 minutes until ghee separates from tomato base.', timerSeconds: 480 },
      { stepNumber: 4, instruction: 'Fold in seared paneer, dollop of cream/yogurt, and crushed kasuri methi. Serve warm with basmati rice.' }
    ]
  },
  {
    id: 'rec-chettinad-pepper-chicken',
    title: 'South Indian Chettinad Pepper Chicken',
    description: 'Fiery and aromatic Karaikudi-style chicken curry infused with freshly roasted black pepper, fennel, mustard seeds, and fresh curry leaves.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 22,
    calories: 460,
    difficulty: 'Medium',
    cookingMethod: 'Pan-Seared',
    dietaryTags: ['High-Protein', 'Gluten-Free', 'Dairy-Free'],
    cuisine: 'Indian (North & South)',
    matchedIngredients: ['Chicken Thighs', 'Red Onions', 'Ginger-Garlic Paste', 'Green Chiles (Hari Mirch)', 'Curry Leaves', 'Roma Tomatoes'],
    missingIngredients: ['Black Peppercorns', 'Fennel Seeds', 'Coconut Oil'],
    macros: { protein: '42g', carbs: '12g', fat: '26g' },
    servings: 3,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Dry roast whole black pepper and fennel seeds before coarse grinding for authentic Chettinad punch.',
    steps: [
      { stepNumber: 1, instruction: 'Marinate chicken in turmeric, ginger-garlic paste, and lemon juice for 10 minutes.', timerSeconds: 600 },
      { stepNumber: 2, instruction: 'Splutter mustard seeds and fresh curry leaves in hot oil. Add sliced onions and sauté until deep mahogany.', timerSeconds: 300 },
      { stepNumber: 3, instruction: 'Add chicken pieces and sear on high flame for 5 minutes to lock in juices.', timerSeconds: 300 },
      { stepNumber: 4, instruction: 'Stir in fresh ground Chettinad pepper masala and simmer covered for 10 minutes until tender.', timerSeconds: 600 }
    ]
  },
  {
    id: 'rec-dal-tadka-jeera-rice',
    title: 'Homestyle Dal Tadka & Fragrant Jeera Rice',
    description: 'Golden yellow lentils simmered with turmeric and garlic, tempered with a sizzling ghee tadka of cumin, dried red chiles, and hing.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    calories: 410,
    difficulty: 'Easy',
    cookingMethod: 'Pressure Cooker / Instant Pot',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Fiber'],
    cuisine: 'Indian (North & South)',
    matchedIngredients: ['Yellow Toor Dal / Lentils', 'Aged Basmati Rice', 'Pure Cow Ghee', 'Garlic', 'Green Chiles (Hari Mirch)', 'Fresh Cilantro (Coriander)'],
    missingIngredients: ['Cumin Seeds (Jeera)', 'Dried Whole Red Chiles', 'Asafoetida (Hing)'],
    macros: { protein: '18g', carbs: '64g', fat: '10g' },
    servings: 3,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Pour the hot tadka (tempering) directly over cooked dal at the very last moment before serving so aromatics linger.',
    steps: [
      { stepNumber: 1, instruction: 'Pressure cook toor dal with water, turmeric, and chopped tomatoes for 4 whistles until soft and creamy.', timerSeconds: 600 },
      { stepNumber: 2, instruction: 'Cook basmati rice with whole cumin seeds and a tsp of ghee until fluffy.', timerSeconds: 720 },
      { stepNumber: 3, instruction: 'Heat 2 tbsp ghee in a tadka pan. Add cumin seeds, sliced garlic, green chiles, and dried red chiles until fragrant.', timerSeconds: 120 },
      { stepNumber: 4, instruction: 'Pour crackling tadka over dal, garnish with cilantro, and serve with hot jeera rice.' }
    ]
  },

  // 🇺🇸 AMERICAN CUISINES
  {
    id: 'rec-american-bbq-chicken-sweetpotato',
    title: 'Smoky BBQ Pulled Chicken & Roasted Sweet Potato',
    description: 'Tender slow-braised shredded chicken breast glazed in hickory BBQ sauce, served alongside caramelized sweet potato wedges.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    calories: 490,
    difficulty: 'Easy',
    cookingMethod: 'Oven Roasted',
    dietaryTags: ['High-Protein', 'Gluten-Free', 'Dairy-Free'],
    cuisine: 'American / BBQ',
    matchedIngredients: ['Chicken Breast', 'Sweet Potatoes', 'Hickory BBQ Sauce', 'Olive Oil', 'Garlic'],
    missingIngredients: ['Smoked Paprika', 'Apple Cider Vinegar'],
    macros: { protein: '44g', carbs: '48g', fat: '12g' },
    servings: 2,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Roast sweet potatoes skin-on at 425°F for caramelized crisp edges and sweet pillowy centers.',
    steps: [
      { stepNumber: 1, instruction: 'Cube sweet potatoes into 3/4-inch wedges. Toss in olive oil, garlic powder, salt, and pepper.', timerSeconds: 180 },
      { stepNumber: 2, instruction: 'Roast sweet potatoes at 425°F (220°C) for 22 minutes until golden and tender.', timerSeconds: 1320 },
      { stepNumber: 3, instruction: 'Poach or sear chicken breasts, then shred with two forks and toss with hickory BBQ sauce.', timerSeconds: 300 },
      { stepNumber: 4, instruction: 'Plate BBQ pulled chicken with hot sweet potato wedges.' }
    ]
  },
  {
    id: 'rec-american-smashburger-bowl',
    title: 'Classic American Smash Cheeseburger Protein Bowl',
    description: 'Crispy-edged seared ground beef patties over crisp iceberg greens, melted sharp cheddar, caramelized onions, pickles, and burger sauce.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    calories: 560,
    difficulty: 'Easy',
    cookingMethod: 'Pan-Seared',
    dietaryTags: ['Keto', 'Low-Carb', 'Gluten-Free', 'High-Protein'],
    cuisine: 'American / BBQ',
    matchedIngredients: ['Lean Ground Beef (90/10)', 'Sharp Cheddar Slices', 'Red Onions', 'Dill Pickles', 'Butter'],
    missingIngredients: ['Iceberg Lettuce', 'Smash Sauce (Mayonnaise & Mustard)', 'Tomato Slices'],
    macros: { protein: '42g', carbs: '8g', fat: '38g' },
    servings: 2,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Smash beef balls firmly onto a roaring hot cast-iron skillet to develop super crisp lacy edges.',
    steps: [
      { stepNumber: 1, instruction: 'Divide beef into 4 small balls. Season liberally with coarse salt and black pepper.', timerSeconds: 120 },
      { stepNumber: 2, instruction: 'Sear in cast iron, smashing flat with a heavy spatula. Cook 3 mins on high heat until edges turn dark lace.', timerSeconds: 180 },
      { stepNumber: 3, instruction: 'Flip patties, top with sharp cheddar, cover pan for 60 seconds to melt cheese.', timerSeconds: 60 },
      { stepNumber: 4, instruction: 'Serve melted patties over bed of shredded greens with caramelized onions, pickles, and special sauce.' }
    ]
  },

  // 🇹🇭 🇯🇵 🇨🇳 PAN-ASIAN CUISINES
  {
    id: 'rec-thai-coconut-red-curry',
    title: 'Thai Coconut Red Curry with Tofu & Jasmine Rice',
    description: 'Fragrant lemongrass, galangal, and red curry coconut broth simmered with firm tofu cubes, snap peas, bell peppers, and fresh Thai basil.',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    calories: 440,
    difficulty: 'Easy',
    cookingMethod: 'Wok Stir-Fry',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Fiber'],
    cuisine: 'Thai Street Food',
    matchedIngredients: ['Coconut Milk', 'Thai Red Curry Paste', 'Fragrant Jasmine Rice', 'Firm Tofu', 'Sugar Snap Peas', 'Limes', 'Fresh Thai Basil'],
    missingIngredients: ['Bamboo Shoots', 'Red Bell Pepper'],
    macros: { protein: '20g', carbs: '42g', fat: '22g' },
    servings: 2,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Fry curry paste in 2 tbsp thick coconut cream first until fragrant and oil separates before pouring remaining coconut milk.',
    steps: [
      { stepNumber: 1, instruction: 'Press and cube firm tofu into 1-inch squares. Fry in wok until lightly golden on sides.', timerSeconds: 300 },
      { stepNumber: 2, instruction: 'Sauté Thai red curry paste in coconut cream for 2 minutes until aromatic.', timerSeconds: 120 },
      { stepNumber: 3, instruction: 'Pour in remaining coconut milk, bring to gentle boil. Add snap peas, bell peppers, and tofu.', timerSeconds: 240 },
      { stepNumber: 4, instruction: 'Simmer 5 minutes. Finish with fresh lime juice and Thai basil leaves. Serve with Jasmine rice.' }
    ]
  },
  {
    id: 'rec-japanese-chicken-katsu-curry',
    title: 'Japanese Golden Chicken Katsu Curry',
    description: 'Golden panko-crusted crispy chicken cutlet sliced over steaming rice and drenched in aromatic, sweet-savory Japanese curry sauce.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    calories: 610,
    difficulty: 'Medium',
    cookingMethod: 'Pan-Seared',
    dietaryTags: ['High-Protein'],
    cuisine: 'Japanese / Izakaya',
    matchedIngredients: ['Chicken Breast', 'Eggs', 'Aged Basmati Rice', 'Red Onions', 'Garlic', 'Butter'],
    missingIngredients: ['Japanese Curry Roux (S&B)', 'Panko Breadcrumbs', 'Carrots'],
    macros: { protein: '46g', carbs: '62g', fat: '20g' },
    servings: 2,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Double dredge chicken cutlet in flour, whisked egg, and Japanese panko for maximum shatter-crisp crunch.',
    steps: [
      { stepNumber: 1, instruction: 'Pound chicken breast thin. Dredge in flour, beaten egg, and panko breadcrumbs.', timerSeconds: 300 },
      { stepNumber: 2, instruction: 'Shallow fry cutlet in 375°F oil for 4 minutes per side until deep golden brown. Drain on wire rack.', timerSeconds: 480 },
      { stepNumber: 3, instruction: 'Sauté onions and carrots in butter; add water and dissolve Japanese curry roux block until smooth.', timerSeconds: 360 },
      { stepNumber: 4, instruction: 'Slice katsu cutlet into strips. Plate over warm rice and ladle rich curry sauce over top.' }
    ]
  },

  // Existing Mediterranean & Asian Recipes
  {
    id: 'recipe-mediterranean-power-bowl',
    title: 'Gourmet Mediterranean Power Bowl',
    description: 'Vibrant pan-seared lemon chicken paired with avocado, blistered tomatoes, baby spinach, and creamy feta tzatziki drizzle.',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    calories: 480,
    difficulty: 'Easy',
    cookingMethod: 'Pan-Seared',
    dietaryTags: ['Keto', 'Gluten-Free', 'Low-Carb'],
    cuisine: 'Mediterranean',
    matchedIngredients: ['Chicken Breast', 'Avocado', 'Baby Spinach', 'Cherry Tomatoes', 'Lemons', 'Greek Yogurt', 'Garlic', 'Olive Oil'],
    missingIngredients: ['Feta Cheese', 'Cucumber', 'Dried Oregano'],
    macros: { protein: '42g', carbs: '14g', fat: '28g' },
    servings: 2,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Blister the cherry tomatoes on high heat in olive oil until they burst to create a naturally sweet, rich dressing base.',
    steps: [
      { stepNumber: 1, instruction: 'Slice chicken breast into 1-inch strips. Season with lemon zest, minced garlic, salt, pepper, and oregano.', timerSeconds: 120 },
      { stepNumber: 2, instruction: 'Heat olive oil in skillet. Sear chicken for 6-8 mins until golden brown (165°F).', timerSeconds: 420 },
      { stepNumber: 3, instruction: 'In same pan, toss tomatoes and spinach for 2 mins until wilted.', timerSeconds: 120 },
      { stepNumber: 4, instruction: 'Whisk Greek yogurt, lemon juice, garlic, and olive oil into tzatziki drizzle.', timerSeconds: 90 },
      { stepNumber: 5, instruction: 'Assemble bowl with chicken, blistered veggies, avocado, and tzatziki.' }
    ]
  },
  {
    id: 'recipe-airfryer-miso-eggplant',
    title: 'Air-Fryer Caramelized Miso Eggplant & Tofu',
    description: 'Ultra-crispy air-fried Japanese eggplant and firm tofu cubes tossed in a sweet-savory red miso glaze.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 14,
    calories: 320,
    difficulty: 'Easy',
    cookingMethod: 'Air Fryer',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Fiber'],
    cuisine: 'Asian Fusion',
    matchedIngredients: ['Firm Tofu', 'Red Miso Paste', 'Toasted Sesame Oil', 'Honey', 'Soy Sauce'],
    missingIngredients: ['Japanese Eggplant', 'White Sesame Seeds', 'Scallions'],
    macros: { protein: '22g', carbs: '28g', fat: '14g' },
    servings: 2,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Air fry at 400°F (200°C) for 12 minutes, shaking basket halfway through for max crispiness.',
    steps: [
      { stepNumber: 1, instruction: 'Press tofu dry and cube into 1-inch pieces. Cut eggplant into bite-sized chunks.' },
      { stepNumber: 2, instruction: 'Whisk miso paste, soy sauce, honey, and sesame oil in a small bowl until smooth.' },
      { stepNumber: 3, instruction: 'Toss tofu and eggplant in half the glaze and load into Air Fryer basket at 400°F.', timerSeconds: 720 },
      { stepNumber: 4, instruction: 'Brush remaining glaze in last 2 mins of air frying until caramelized and bubbling.' }
    ]
  },
  {
    id: 'recipe-wok-shrimp-bokchoy',
    title: 'Wok-Tossed Crispy Garlic Shrimp & Bok Choy',
    description: 'High-heat wok stir-fry featuring juicy black tiger shrimp, baby bok choy, shiitake, and toasted sesame oil.',
    prepTimeMinutes: 8,
    cookTimeMinutes: 5,
    calories: 310,
    difficulty: 'Easy',
    cookingMethod: 'Wok Stir-Fry',
    dietaryTags: ['Keto', 'Low-Carb', 'Gluten-Free'],
    cuisine: 'Cantonese / Asian',
    matchedIngredients: ['Baby Bok Choy', 'Shiitake Mushrooms', 'Garlic', 'Soy Sauce', 'Toasted Sesame Oil'],
    missingIngredients: ['Tiger Shrimp', 'Ginger', 'Shaoxing Wine'],
    macros: { protein: '34g', carbs: '8g', fat: '12g' },
    servings: 2,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Keep wok smoking hot to lock in wok-hei smoky aroma and maintain vegetable crispness.',
    steps: [
      { stepNumber: 1, instruction: 'Heat wok on maximum flame until lightly smoking. Add 1 tbsp oil.' },
      { stepNumber: 2, instruction: 'Add minced garlic and ginger, followed by shrimp. Toss vigorously for 90 seconds.', timerSeconds: 90 },
      { stepNumber: 3, instruction: 'Add sliced shiitake and bok choy halves with soy sauce and splash of water; cover for 60 seconds.', timerSeconds: 60 },
      { stepNumber: 4, instruction: 'Finish with toasted sesame oil and serve steaming hot.' }
    ]
  },
  {
    id: 'recipe-raw-kimchi-probiotic',
    title: 'Gut-Healing Probiotic Kimchi & Avocado Bowl',
    description: 'No-cook raw fermented energy bowl loaded with aged kimchi, creamy avocado, edamame, and toasted sesame.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    calories: 380,
    difficulty: 'Easy',
    cookingMethod: 'Raw Fermented',
    dietaryTags: ['Vegan', 'Probiotic', 'No-Cook'],
    cuisine: 'Korean Clean Eats',
    matchedIngredients: ['Aged Kimchi', 'Avocado', 'Edamame Beans', 'Toasted Sesame Oil'],
    missingIngredients: ['Nori Seaweed Strips', 'Sesame Seeds'],
    macros: { protein: '16g', carbs: '22g', fat: '24g' },
    servings: 1,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Raw fermented kimchi delivers live active cultures that support gut microbiome health.',
    steps: [
      { stepNumber: 1, instruction: 'Arrange aged kimchi, sliced avocado, and thawed edamame in a wide bowl.' },
      { stepNumber: 2, instruction: 'Drizzle with toasted sesame oil and top with crispy nori strips.' }
    ]
  },

  // 🥩 MORE NON-VEG DISHES
  {
    id: 'rec-hyderabadi-lamb-biryani',
    title: 'Hyderabadi Slow-Dum Lamb Biryani',
    description: 'Aromatic, long-grain basmati rice cooked in claypot dum style with tender marinated lamb shoulder, saffron, fried shallots, and fresh mint.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    calories: 680,
    difficulty: 'Medium',
    cookingMethod: 'Claypot Braising',
    dietaryTags: ['High-Protein', 'Gluten-Free'],
    cuisine: 'Indian (North & South)',
    matchedIngredients: ['Aged Basmati Rice', 'Pure Cow Ghee', 'Greek Yogurt (Dahi)', 'Red Onions', 'Garlic', 'Green Chiles (Hari Mirch)', 'Fresh Cilantro (Coriander)'],
    missingIngredients: ['Lamb Shoulder', 'Saffron Threads', 'Shahi Jeera / Whole Spices'],
    macros: { protein: '48g', carbs: '66g', fat: '26g' },
    servings: 4,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Seal the claypot lid with dough rim to trap all steam (dum method) so the rice absorbs rich lamb broths.',
    steps: [
      { stepNumber: 1, instruction: 'Marinate lamb in yogurt, ginger-garlic paste, chili powder, and biryani spices for 30 minutes.', timerSeconds: 1800 },
      { stepNumber: 2, instruction: 'Parboil basmati rice with whole cinnamon, cardamom, and cloves until 70% cooked.', timerSeconds: 420 },
      { stepNumber: 3, instruction: 'Layer marinated lamb, partially cooked rice, fried onions, mint, and saffron milk in a heavy pot.', timerSeconds: 300 },
      { stepNumber: 4, instruction: 'Cover tightly and steam on low heat (dum) for 35 minutes before gently fluffing.' }
    ]
  },
  {
    id: 'rec-panseared-salmon-lemonherb',
    title: 'Pan-Seared Atlantic Salmon & Garlic Asparagus',
    description: 'Crispy skin-on Atlantic salmon fillet pan-seared in garlic herb butter, paired with tender grilled asparagus and lemon quinoa.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    calories: 520,
    difficulty: 'Easy',
    cookingMethod: 'Pan-Seared',
    dietaryTags: ['Keto', 'Gluten-Free', 'Low-Carb', 'High-Protein'],
    cuisine: 'Mediterranean',
    matchedIngredients: ['Salmon Fillets', 'Lemons', 'Butter', 'Garlic', 'Olive Oil'],
    missingIngredients: ['Fresh Asparagus', 'Quinoa', 'Fresh Dill'],
    macros: { protein: '44g', carbs: '12g', fat: '32g' },
    servings: 2,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Press the salmon fillet firmly skin-side down in a smoking hot pan for 4 minutes to achieve glass-like crackling skin.',
    steps: [
      { stepNumber: 1, instruction: 'Pat salmon skin bone-dry. Season skin and flesh liberally with salt and black pepper.', timerSeconds: 120 },
      { stepNumber: 2, instruction: 'Sear salmon skin-side down in olive oil for 4 minutes until skin is golden crisp.', timerSeconds: 240 },
      { stepNumber: 3, instruction: 'Flip fillet, add butter, garlic, and fresh dill. Baste (arroser) continuously for 3 minutes.', timerSeconds: 180 },
      { stepNumber: 4, instruction: 'Sauté asparagus spears in pan drippings and serve alongside salmon with lemon wedges.' }
    ]
  },
  {
    id: 'rec-sichuan-kungpao-chicken',
    title: 'Sichuan Fiery Kung Pao Chicken & Peanuts',
    description: 'High-heat wok stir-fry featuring diced chicken thighs, fragrant Sichuan peppercorns, dried red chiles, scallions, and toasted peanuts.',
    prepTimeMinutes: 12,
    cookTimeMinutes: 8,
    calories: 490,
    difficulty: 'Easy',
    cookingMethod: 'Wok Stir-Fry',
    dietaryTags: ['High-Protein', 'Dairy-Free'],
    cuisine: 'Cantonese / Asian',
    matchedIngredients: ['Chicken Thighs', 'Soy Sauce', 'Toasted Sesame Oil', 'Garlic', 'Red Onions'],
    missingIngredients: ['Roasted Peanuts', 'Sichuan Peppercorns', 'Chili Oil', 'Scallions'],
    macros: { protein: '42g', carbs: '16g', fat: '28g' },
    servings: 2,
    imageUrl: fridgeProteinVeggieImg,
    chefTip: 'Bloom Sichuan peppercorns and dried chiles in oil first until dark maroon before adding chicken.',
    steps: [
      { stepNumber: 1, instruction: 'Dice chicken thighs and velvety marinate in soy sauce, cornstarch, and Shaoxing wine for 10 minutes.', timerSeconds: 600 },
      { stepNumber: 2, instruction: 'Flash fry dried chiles and Sichuan peppercorns in hot oil until aromatic.', timerSeconds: 60 },
      { stepNumber: 3, instruction: 'Add chicken and wok-sear over maximum flame for 4 minutes until lightly charred.', timerSeconds: 240 },
      { stepNumber: 4, instruction: 'Toss in scallion whites, roasted peanuts, and Kung Pao soy-vinegar glaze for 60 seconds.' }
    ]
  },
  {
    id: 'rec-slowcooked-bolognese-tagliatelle',
    title: 'Slow-Simmered Italian Beef Bolognese Tagliatelle',
    description: 'Traditional slow-cooked Emilia-Romagna ragù made with lean ground beef, soffritto, tomato reduction, and silky egg tagliatelle pasta.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    calories: 580,
    difficulty: 'Medium',
    cookingMethod: 'Claypot Braising',
    dietaryTags: ['High-Protein'],
    cuisine: 'Italian',
    matchedIngredients: ['Lean Ground Beef (90/10)', 'Roma Tomatoes', 'Red Onions', 'Garlic', 'Butter', 'Olive Oil'],
    missingIngredients: ['Tagliatelle Pasta', 'Parmesan Reggiano', 'Celery & Carrot Soffritto'],
    macros: { protein: '38g', carbs: '54g', fat: '22g' },
    servings: 3,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Finish boiling pasta 2 minutes early and emulsify directly inside the Bolognese ragù with a splash of starchy pasta water.',
    steps: [
      { stepNumber: 1, instruction: 'Sauté minced onion, celery, and carrot (soffritto) in butter and olive oil until sweet and translucent.', timerSeconds: 300 },
      { stepNumber: 2, instruction: 'Add ground beef, breaking into crumbles until browned. Pour in tomato reduction and garlic.', timerSeconds: 420 },
      { stepNumber: 3, instruction: 'Simmer sauce covered over low heat for 25 minutes until deep, rich, and concentrated.', timerSeconds: 1500 },
      { stepNumber: 4, instruction: 'Toss cooked tagliatelle into hot ragù with freshly grated parmesan.' }
    ]
  },

  // 🥬 MORE VEG DISHES
  {
    id: 'rec-palak-paneer-naan',
    title: 'Silken Garlic Palak Paneer & Warm Naan',
    description: 'Smooth baby spinach puree simmered with minced garlic, cumin, and soft golden paneer cubes, served with garlic butter naan.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    calories: 470,
    difficulty: 'Easy',
    cookingMethod: 'Claypot Braising',
    dietaryTags: ['Vegetarian', 'High-Protein', 'High-Fiber'],
    cuisine: 'Indian (North & South)',
    matchedIngredients: ['Paneer (Indian Cottage Cheese)', 'Baby Spinach', 'Garlic', 'Pure Cow Ghee', 'Greek Yogurt (Dahi)', 'Green Chiles (Hari Mirch)'],
    missingIngredients: ['Garlic Naan Bread', 'Garam Masala'],
    macros: { protein: '32g', carbs: '28g', fat: '26g' },
    servings: 2,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Blanch spinach leaves for just 60 seconds in boiling salted water and plunge into ice bath to preserve vibrant emerald green color.',
    steps: [
      { stepNumber: 1, instruction: 'Blanch baby spinach in boiling water for 60 seconds, shock in cold water, and blend into smooth puree.', timerSeconds: 120 },
      { stepNumber: 2, instruction: 'Sauté minced garlic and green chiles in ghee until golden. Add spices and tomato paste.', timerSeconds: 180 },
      { stepNumber: 3, instruction: 'Pour in spinach puree and paneer cubes; simmer gently for 5 minutes.', timerSeconds: 300 },
      { stepNumber: 4, instruction: 'Finish with a swirl of cream/yogurt and serve hot with warmed garlic naan.' }
    ]
  },
  {
    id: 'rec-chipotle-blackbean-burritobowl',
    title: 'Chipotle Black Bean & Roasted Corn Burrito Bowl',
    description: 'Fiery spiced black beans, char-grilled sweet corn, cilantro-lime brown rice, avocado, pico de gallo, and zesty lime crema.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    calories: 430,
    difficulty: 'Easy',
    cookingMethod: 'Pan-Seared',
    dietaryTags: ['Vegetarian', 'Vegan', 'High-Fiber', 'Gluten-Free'],
    cuisine: 'Mexican',
    matchedIngredients: ['Avocado', 'Cherry Tomatoes', 'Lemons', 'Fresh Cilantro (Coriander)', 'Red Onions', 'Garlic'],
    missingIngredients: ['Black Beans', 'Sweet Corn', 'Chipotle Peppers in Adobo', 'Cilantro-Lime Rice'],
    macros: { protein: '22g', carbs: '62g', fat: '14g' },
    servings: 2,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Char sweet corn kernels in a dry skillet until dark spots appear for smoky street-corn flavor.',
    steps: [
      { stepNumber: 1, instruction: 'Simmer black beans with chipotle pepper, garlic, and cumin for 6 minutes.', timerSeconds: 360 },
      { stepNumber: 2, instruction: 'Char sweet corn in a dry hot skillet for 3 minutes until blistered.', timerSeconds: 180 },
      { stepNumber: 3, instruction: 'Dice tomatoes, red onion, cilantro, and lime juice into fresh pico de gallo salsa.', timerSeconds: 120 },
      { stepNumber: 4, instruction: 'Assemble bowl with cilantro rice, spiced black beans, charred corn, avocado slices, and pico de gallo.' }
    ]
  },
  {
    id: 'rec-crispy-eggplant-parmigiana',
    title: 'Crispy Italian Eggplant Parmigiana',
    description: 'Golden panko-crusted eggplant cutlets layered with herbaceous marinara, melted mozzarella, fresh basil, and aged parmesan.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    calories: 460,
    difficulty: 'Medium',
    cookingMethod: 'Oven Roasted',
    dietaryTags: ['Vegetarian', 'High-Fiber'],
    cuisine: 'Italian',
    matchedIngredients: ['Eggs', 'Roma Tomatoes', 'Garlic', 'Olive Oil', 'Butter'],
    missingIngredients: ['Eggplant', 'Mozzarella Cheese', 'Parmesan Cheese', 'Panko Breadcrumbs', 'Fresh Basil'],
    macros: { protein: '26g', carbs: '38g', fat: '24g' },
    servings: 3,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Salt eggplant rounds 15 minutes before dredging to purge excess moisture and prevent sogginess.',
    steps: [
      { stepNumber: 1, instruction: 'Slice eggplant into 1/2-inch rounds. Salt and rest on paper towels for 15 minutes to purge water.', timerSeconds: 900 },
      { stepNumber: 2, instruction: 'Dredge slices in flour, egg, and seasoned panko. Bake or air-fry at 400°F for 15 minutes until crispy.', timerSeconds: 900 },
      { stepNumber: 3, instruction: 'Layer crispy eggplant in baking dish with marinara, mozzarella, and parmesan.', timerSeconds: 180 },
      { stepNumber: 4, instruction: 'Bake for 10 minutes until cheese is golden and bubbling.' }
    ]
  },
  {
    id: 'rec-middleeastern-falafel-mezze',
    title: 'Crispy Golden Falafel Mezze Platter with Tahini',
    description: 'Air-fried crispy chickpea falafels served with velvet garlic hummus, cucumber-tomato salad, creamy tahini, and warm pita pockets.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    calories: 420,
    difficulty: 'Easy',
    cookingMethod: 'Air Fryer',
    dietaryTags: ['Vegan', 'High-Fiber'],
    cuisine: 'Mediterranean',
    matchedIngredients: ['Garlic', 'Fresh Cilantro (Coriander)', 'Lemons', 'Olive Oil', 'Red Onions'],
    missingIngredients: ['Chickpeas', 'Tahini Sesame Paste', 'Pita Bread', 'Ground Cumin & Coriander'],
    macros: { protein: '24g', carbs: '52g', fat: '16g' },
    servings: 2,
    imageUrl: culinaryGourmetBowlImg,
    chefTip: 'Use soaked dry chickpeas rather than canned chickpeas for falafels to get authentic fluffy centers with super crispy exteriors.',
    steps: [
      { stepNumber: 1, instruction: 'Pulse soaked chickpeas, garlic, onion, herbs, and spices in food processor into coarse mixture.', timerSeconds: 180 },
      { stepNumber: 2, instruction: 'Form into small 1-inch patties and air fry at 390°F (198°C) for 12 minutes until deep golden brown.', timerSeconds: 720 },
      { stepNumber: 3, instruction: 'Whisk tahini paste, lemon juice, ice water, and garlic into silky white dressing.', timerSeconds: 120 },
      { stepNumber: 4, instruction: 'Serve falafels with hummus, diced salad, tahini, and warm pita.' }
    ]
  }
];

export const INITIAL_SHOPPING_LIST = [
  {
    id: 'shop-1',
    name: 'Feta Cheese',
    quantity: '1 block (150g)',
    category: 'Dairy & Eggs',
    addedFromRecipe: 'Gourmet Mediterranean Power Bowl',
    checked: false,
    addedAt: '2026-09-27'
  },
  {
    id: 'shop-2',
    name: 'Kasuri Methi (Dried Fenugreek)',
    quantity: '1 box',
    category: 'Pantry',
    addedFromRecipe: 'North Indian Butter Paneer Tikka Masala',
    checked: false,
    addedAt: '2026-09-27'
  }
];

export const DEFAULT_HOUSEHOLD_MEMORY = {
  householdName: "The Culinary Loft",
  members: [
    {
      id: "mem-1",
      name: "You (Chef)",
      role: "Self" as const,
      dislikedIngredients: ["Bitter Gourd", "Overcooked Cabbage"],
      allergens: [],
      spiceTolerance: 4,
      favoriteCuisines: ["Indian (North & South)", "Thai Street Food", "Mediterranean"],
      notes: "Loves high-protein breakfasts, fresh coriander garnish, and claypot braises."
    },
    {
      id: "mem-2",
      name: "Priya",
      role: "Partner" as const,
      dislikedIngredients: ["Raw Cilantro", "Truffle Oil"],
      allergens: ["Lactose Sensitivity (Mild)"],
      spiceTolerance: 3,
      favoriteCuisines: ["Italian", "Japanese / Izakaya", "American / BBQ"],
      notes: "Prefers oat milk over dairy cream; loves crispy roasted sweet potatoes."
    },
    {
      id: "mem-3",
      name: "Arjun (8yo)",
      role: "Kid" as const,
      dislikedIngredients: ["Spicy Chilies", "Mushrooms", "Raw Onions"],
      allergens: ["Peanuts (Strict)"],
      spiceTolerance: 1,
      favoriteCuisines: ["Homestyle Pasta", "Mild Curries", "Noodles"],
      notes: "Sensitive to crunchy onion bits; loves cheesy mild dishes."
    }
  ],
  overallSpiceTolerance: 3.5,
  favoriteCuisines: ["Indian (North & South)", "Mediterranean", "Thai Street Food", "Japanese / Izakaya"],
  dislikedIngredients: ["Raw Cilantro", "Bitter Gourd", "Truffle Oil"],
  typicalMealTimes: {
    breakfast: "8:00 AM",
    lunch: "1:30 PM",
    dinner: "8:30 PM"
  },
  preferredAppliances: ["Air Fryer", "Induction Wok", "Instant Pot", "Claypot"],
  frequentlyPurchased: ["Paneer", "Baby Spinach", "Farm Eggs", "Firm Tofu", "Greek Yogurt", "Sourdough", "Basmati Rice"],
  budgetTier: "Balanced" as const,
  cookingSkillLevel: "Intermediate" as const,
  lovedRecipes: ["North Indian Butter Paneer Tikka Masala", "Thai Coconut Red Curry", "Smoky BBQ Pulled Chicken"],
  dislikedRecipes: ["Boiled Cabbage Broth", "Extra Bitter Karela Stir-Fry"],
  learnedInsights: [
    "Prefers spicy South Indian breakfasts with curry leaves and mustard seeds.",
    "Avoids raw cilantro for partner dinners while keeping chili oil separate.",
    "Enjoys Thai red curry with fragrant jasmine rice and crispy paneer tikka."
  ]
};
