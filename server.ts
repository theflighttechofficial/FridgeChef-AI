import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const GEMINI_TTS_MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-lite-tts';

app.disable('x-powered-by');
app.use(express.json({ limit: '20mb' }));

// Shared Gemini client, created once and reused across requests.
// Without a real key, throwing here lets each route's catch return its offline fallback
// immediately instead of waiting on a doomed network round-trip.
let geminiClient: GoogleGenAI | null = null;
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
};

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is missing; AI routes will serve offline fallback data.');
}

// Route: Analyze Fridge Photo / Image
app.post('/api/analyze-fridge', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', extraPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    const ai = getGeminiClient();

    // Clean base64 string if it contains data prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `Analyze this fridge interior photo carefully as a professional culinary master and nutritionist.
Identify all visible ingredients, fresh produce, condiments, dairy, proteins, leftovers, or pantry items.
Also assess freshness (Fresh, Use Soon, Pantry Staple).

Draw recipe suggestions from a diverse regional taxonomy (North/South Indian curries & biryanis, American smokehouse & smash bowls, Thai/Japanese/Sichuan wok dishes, Mediterranean, etc.), featuring creative vegetarian or non-vegetarian pairings based on detected ingredients.

Generate a structured JSON response containing:
1. "detectedIngredients": Array of objects with keys: name (string), category ('Produce'|'Dairy & Eggs'|'Meat & Seafood'|'Pantry'|'Condiments'|'Spices'|'Beverages'|'Other'), freshness ('Fresh'|'Use Soon'|'Frozen'|'Pantry Staple'), quantity (string), confidence (number 0.5-1.0).
2. "suggestedRecipes": Array of 3 creative recipes based primarily on these detected ingredients. Each recipe must contain:
   - title (string)
   - description (string)
   - prepTimeMinutes (number)
   - cookTimeMinutes (number)
   - calories (number)
   - difficulty ('Easy' | 'Medium' | 'Hard')
   - dietaryTags (array of strings, e.g., ['Vegetarian', 'Keto', 'Gluten-Free'])
   - cuisine (string, e.g. "Indian (North & South)", "Thai Street Food", "American / BBQ", "Japanese / Izakaya")
   - matchedIngredients (array of strings from detected ingredients)
   - missingIngredients (array of 2-4 common pantry/pantry items needed)
   - macros ({ protein: string, carbs: string, fat: string })
   - nutritionRadarData (array of 6 objects for attributes: 'Protein', 'Fats', 'Carbs', 'Fiber', 'Vitamins', 'Minerals' with relative percentage scores 0-100)
   - servings (number)
   - chefTip (string)
   - steps: Array of objects ({ stepNumber: number, instruction: string, timerSeconds: optional number, keyIngredients: optional array of strings, chefTip: optional string })
${extraPrompt ? `Additional note from user: ${extraPrompt}` : ''}`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedIngredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  freshness: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                },
                required: ['name', 'category'],
              },
            },
            suggestedRecipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prepTimeMinutes: { type: Type.NUMBER },
                  cookTimeMinutes: { type: Type.NUMBER },
                  calories: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING },
                  dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cuisine: { type: Type.STRING },
                  matchedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      protein: { type: Type.STRING },
                      carbs: { type: Type.STRING },
                      fat: { type: Type.STRING },
                    },
                  },
                  nutritionRadarData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        attribute: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                      },
                      required: ['attribute', 'score'],
                    },
                  },
                  servings: { type: Type.NUMBER },
                  chefTip: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.NUMBER },
                        instruction: { type: Type.STRING },
                        timerSeconds: { type: Type.NUMBER },
                        keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        chefTip: { type: Type.STRING },
                      },
                      required: ['stepNumber', 'instruction'],
                    },
                  },
                },
                required: ['title', 'description', 'prepTimeMinutes', 'cookTimeMinutes', 'calories', 'difficulty', 'steps'],
              },
            },
          },
          required: ['detectedIngredients', 'suggestedRecipes'],
        },
      },
    });

    const textOutput = response.text || '{}';
    const parsedData = JSON.parse(textOutput);
    res.json(parsedData);
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error analyzing fridge:', err);
    res.status(500).json({
      error: 'Failed to analyze fridge image',
      details: err.message || 'Unknown error',
    });
  }
});

const CUISINE_TAXONOMY_INSTRUCTIONS = `
CUISINE & PAIRING TAXONOMY GUIDE:
When generating or suggesting recipes, draw from an authentic, rich taxonomy of regional Indian, American, and Asian culinary styles, ensuring support for diverse vegetarian and non-vegetarian ingredient pairings:

1. REGIONAL INDIAN TAXONOMY:
   - North Indian: Mughlai, Punjabi butter/kadai tomato gravies, korma, palak paneer, dal tadka/makhani, tandoori/tikka marinades.
   - South Indian: Chettinad pepper roasts, Malabar coconut curries, Keralite stew, Andhra spicy chiles, Hyderabadi dum biryanis, sambar/rasam.
   - West Indian: Maharashtrian kolhapuri/misal, Goan vindaloo/cafreal, Gujarati dhokla/khichdi.
   - East Indian: Bengali mustard-shorshe fish/paneer, Assamese pitika/curries.

2. REGIONAL AMERICAN TAXONOMY:
   - Southern Smokehouse & BBQ: Hickory pulled meats, honey mustard glazes, sweet potato smashes, cornbread, collard greens.
   - New England Coastal: Lemon-dill butter seafood, pan-seared catches, clam/corn chowder style reductions.
   - Tex-Mex & Southwest: Chipotle adobo braises, char-grilled fajitas, street-corn bowls, pico de gallo, poblano cremas.
   - Classic American Diner & Smash: Seared burger protein bowls, melted cheddar glazes, caramelized onions, crisp pickle relishes.
   - Pacific Northwest & California Clean: Herb-crusted salmon/poultry, ancient grain bowls, avocado citrus vinaigrettes.

3. REGIONAL ASIAN TAXONOMY:
   - Thai Street Food: Lemongrass & coconut red/green/massaman curries, Pad Kra Pao holy basil wok fry, Tom Yum chili lime broths.
   - Japanese Washoku & Izakaya: Panko katsu curry, caramelized miso glazes, teriyaki, yakitori, ramen broths, edamame bowls.
   - Chinese & Sichuan: Fiery Kung Pao with peppercorns, Mapo Tofu numbing chili paste, Cantonese wok-hei garlic stir-fries.
   - Korean Bunsik & Clean: Aged Kimchi jjigae, Gochujang glazes, Bulgogi marinades, Bibimbap grain bowls, Tteokbokki.
   - Vietnamese & Southeast Asian: Pho star-anise broths, Lemongrass vermicelli, charbroiled nuoc cham bowls.

4. VEGETARIAN & NON-VEGETARIAN PAIRING RULES:
   - Non-Vegetarian Pairings: Poultry (chicken breast/thighs, turkey, duck), Seafood (salmon, tiger shrimp, cod, tuna), Lamb/Mutton, Beef, Pork. Pair with regional dry-rub roasts, velvety gravies, wok-sear wok-hei, or claypot slow braises.
   - Vegetarian & Vegan Pairings: High-protein plant foundations (paneer, firm/silken tofu, edamame, lentils/toor dal/chana, black beans, chickpeas, tempeh, mushrooms like shiitake/king oyster). Elevate with cold-pressed oils, pure cow ghee, coconut milk, tahini, red miso, or regional tempered tadkas.
   - Strictly honor any user dietary restriction (e.g. Vegetarian, Vegan, Keto, Gluten-Free, Low-Carb, Nut-Free) when provided.
`;

// Route: Generate Recipes from custom ingredient list & filters
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const {
      ingredients,
      dietary = [],
      maxPrepTime,
      difficulty,
      cuisine,
      mealType,
      regionalTaxonomy,
      taxonomyRequirement
    } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are an elite Michelin-star chef, master culinary taxonomist, and nutritionist.
Given these available ingredients: [${(ingredients || []).join(', ')}]

User Preferences & Restrictions:
- Dietary Restrictions: ${dietary.length > 0 ? dietary.join(', ') : 'None'}
- Max Prep Time: ${maxPrepTime ? `${maxPrepTime} minutes` : 'Any'}
- Difficulty Preference: ${difficulty || 'Any'}
- Cuisine Style: ${cuisine || 'Any'}
- Meal Type: ${mealType || 'Any'}

FORMAL REGIONAL TAXONOMY LAYER:
${regionalTaxonomy && Array.isArray(regionalTaxonomy) ? `Required Taxonomy Buckets:\n${regionalTaxonomy.map(t => `- ${t}`).join('\n')}` : ''}
${taxonomyRequirement ? `Taxonomy Directive: ${taxonomyRequirement}` : ''}

${CUISINE_TAXONOMY_INSTRUCTIONS}

MANDATORY TAXONOMY BALANCING RULE:
Categorize generated recipes into formal regional taxonomy buckets:
1. North Indian (Mughlai, Butter/Kadai Gravies, Palak Paneer, Dal Makhani)
2. South Indian (Chettinad Pepper Fry, Malabar Coconut, Keralite Stew, Hyderabadi Dum)
3. American (Southern BBQ, New England Coastal, Tex-Mex Smash & Diner Bowls)
4. Pan-Asian (Japanese Washoku/Katsu, Thai Street Red/Green Curry, Chinese Sichuan, Korean Bunsik)

Ensure balanced cross-cultural cuisine discovery spanning both vegetarian and non-vegetarian ingredient pairings.

Return a structured JSON object with key "recipes" containing an array of recipe objects.
Each recipe must strictly contain:
- id (string, unique e.g., 'gen-1')
- title (string)
- description (string)
- prepTimeMinutes (number)
- cookTimeMinutes (number)
- calories (number)
- difficulty ('Easy' | 'Medium' | 'Hard')
- dietaryTags (array of strings)
- cuisine (string, e.g., "Indian (North & South)", "Thai Street Food", "American / BBQ", "Japanese / Izakaya", "Mexican")
- matchedIngredients (array of strings matching available ingredients)
- missingIngredients (array of strings for 1-3 minor staples user might need to buy)
- macros ({ protein: string, carbs: string, fat: string })
- servings (number)
- chefTip (string)
- steps: Array of detailed objects ({ stepNumber: number, instruction: string, timerSeconds: optional number, keyIngredients: optional array of strings, chefTip: optional string })
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prepTimeMinutes: { type: Type.NUMBER },
                  cookTimeMinutes: { type: Type.NUMBER },
                  calories: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING },
                  dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cuisine: { type: Type.STRING },
                  matchedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      protein: { type: Type.STRING },
                      carbs: { type: Type.STRING },
                      fat: { type: Type.STRING },
                    },
                  },
                  nutritionRadarData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        attribute: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                      },
                      required: ['attribute', 'score'],
                    },
                  },
                  servings: { type: Type.NUMBER },
                  chefTip: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.NUMBER },
                        instruction: { type: Type.STRING },
                        timerSeconds: { type: Type.NUMBER },
                        keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        chefTip: { type: Type.STRING },
                      },
                      required: ['stepNumber', 'instruction'],
                    },
                  },
                },
                required: ['title', 'description', 'prepTimeMinutes', 'cookTimeMinutes', 'calories', 'difficulty', 'steps'],
              },
            },
          },
          required: ['recipes'],
        },
      },
    });

    const textOutput = response.text || '{"recipes":[]}';
    const parsedData = JSON.parse(textOutput);
    res.json(parsedData);
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error generating recipes:', err);
    res.status(500).json({
      error: 'Failed to generate recipes',
      details: err.message || 'Unknown error',
    });
  }
});

// Route: Gemini TTS for voice read-aloud
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    const ai = getGeminiClient();

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const response = await ai.models.generateContent({
      model: GEMINI_TTS_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: 'Warm, clear culinary assistant chef voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio, mimeType: 'audio/pcm' });
    } else {
      return res.status(500).json({ error: 'No audio generated' });
    }
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error with TTS:', err);
    res.status(500).json({ error: 'TTS failed', details: err.message });
  }
});

// Route: Analyze Supermarket Receipt (Receipt -> Pantry AI)
app.post('/api/analyze-receipt', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', receiptText } = req.body;
    const ai = getGeminiClient();

    let parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
    }

    const promptText = `You are an expert grocery logistics and culinary AI.
Analyze this supermarket receipt ${receiptText ? `with OCR text: "${receiptText}"` : 'image'}.
Extract all purchased edible food items, groceries, and ingredients.
For each item, determine:
- name: clean ingredient name (e.g., "Chicken Breast", "Baby Spinach", "Whole Milk")
- category: one of 'Produce' | 'Dairy & Eggs' | 'Meat & Seafood' | 'Pantry' | 'Condiments' | 'Spices' | 'Beverages' | 'Bakery' | 'Grains & Pulses' | 'Fermented' | 'Other'
- quantity: formatted string (e.g., "500 g", "1 L", "12 pcs", "250 g", "5 kg")
- estimatedWeightGrams: number in grams
- price: string or number as shown on receipt (e.g., "₹240" or "$4.99")
- estimatedShelfLifeDays: estimated days before expiration if stored properly in fridge/pantry
- storageLocation: one of 'Crisper Drawer' | 'Top Shelf' | 'Middle Shelf' | 'Door Rack' | 'Deep Freeze' | 'Pantry Cupboard'

Also calculate overall receipt insights:
- storeName: string (e.g., "DMart Supermarket", "Trader Joe's", "Local Market")
- totalCost: formatted string (e.g. "₹1,842" or "$48.50")
- totalWeightKg: number (e.g. 6.2)
- estimatedPantryUtilizationPercent: number 70-98 (e.g., 91)
- immediateUseItems: array of item names that should be cooked within 3-4 days
- mealSuggestions: array of 3 quick recipe titles that can be made with these newly purchased items.

Return strictly JSON matching this schema.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error analyzing receipt:', err);
    // Robust fallback for testing/offline receipts
    return res.json({
      storeName: 'DMart Supercenter',
      totalCost: '₹1,842',
      totalWeightKg: 6.2,
      estimatedPantryUtilizationPercent: 91,
      items: [
        { name: 'Chicken Breast', category: 'Meat & Seafood', quantity: '500 g', estimatedWeightGrams: 500, price: '₹220', estimatedShelfLifeDays: 3, storageLocation: 'Middle Shelf' },
        { name: 'Whole Milk', category: 'Dairy & Eggs', quantity: '1 L', estimatedWeightGrams: 1000, price: '₹66', estimatedShelfLifeDays: 6, storageLocation: 'Top Shelf' },
        { name: 'Cherry Tomatoes', category: 'Produce', quantity: '6 pcs (250g)', estimatedWeightGrams: 250, price: '₹40', estimatedShelfLifeDays: 5, storageLocation: 'Crisper Drawer' },
        { name: 'Farm Fresh Eggs', category: 'Dairy & Eggs', quantity: '12 pcs', estimatedWeightGrams: 600, price: '₹84', estimatedShelfLifeDays: 21, storageLocation: 'Top Shelf' },
        { name: 'Tender Baby Spinach', category: 'Produce', quantity: '250 g', estimatedWeightGrams: 250, price: '₹35', estimatedShelfLifeDays: 4, storageLocation: 'Crisper Drawer' },
        { name: 'Basmati Rice', category: 'Grains & Pulses', quantity: '5 kg', estimatedWeightGrams: 5000, price: '₹550', estimatedShelfLifeDays: 365, storageLocation: 'Pantry Cupboard' }
      ],
      immediateUseItems: ['Chicken Breast', 'Tender Baby Spinach', 'Cherry Tomatoes'],
      mealSuggestions: [
        'Garlic Chicken & Wilted Spinach Rice Bowl',
        'Creamy Spinach & Tomato Scrambled Eggs',
        'Herbed Pan-Seared Chicken with Sautéed Greens'
      ]
    });
  }
});

// Route: Household Memory Engine Insight
app.post('/api/household-memory-insight', async (req, res) => {
  try {
    const { memoryProfile, currentIngredients } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are the FridgeChef Personal Culinary Model with persistent household memory.
Current Household Memory Profile:
${JSON.stringify(memoryProfile || {}, null, 2)}

Current Fridge Inventory:
${JSON.stringify((currentIngredients || []).map((i: any) => ({ name: i.name, freshness: i.freshness, category: i.category })), null, 2)}

Analyze this household context and generate:
1. "conversationalGreeting": A warm, deeply personal 1-2 sentence culinary observation. (e.g. "You usually prefer spicy South Indian breakfasts and you haven't used the spinach you bought 4 days ago.")
2. "householdAlerts": Array of 2 personalized notes (e.g. mentioning member dislikes, allergens, or appliance preferences).
3. "tailoredSuggestion": A specific meal idea calibrated directly to their spice tolerance, favorite cuisines, and urgency of expiring items.
4. "memorySyncStatus": "Memory Synced • 14 Insights Active"

Return strictly valid JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in memory insight:', err);
    return res.json({
      conversationalGreeting: "You usually prefer spicy South Indian breakfasts and you haven't used the spinach you bought 4 days ago.",
      householdAlerts: [
        "Arjun's profile: Strictly exclude raw cilantro from tonight's prep.",
        "Air Fryer preference detected: 68% energy savings compared to conventional oven."
      ],
      tailoredSuggestion: "Spiced Spinach & Egg Bhurji with Toasted Sourdough (Ready in 14 mins, Spice Level 4/5)",
      memorySyncStatus: "Memory Synced • 14 Household Data Nodes Active"
    });
  }
});

// Route: Autonomous Meal Decision Engine (Determines what to cook RIGHT NOW)
app.post('/api/autonomous-decision', async (req, res) => {
  try {
    const { currentIngredients, memoryProfile, context = {} } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are the FridgeChef Autonomous Meal Decision Engine.
Do not ask what the user wants to cook. Determine what should be cooked RIGHT NOW.

Input Variables:
- Available Ingredients: ${JSON.stringify(currentIngredients || [])}
- Household Memory & Preferences: ${JSON.stringify(memoryProfile || {})}
- Ambient Context: ${JSON.stringify(context)} (e.g., current time: ${context.time || 'Dinner'}, weather: ${context.weather || '21°C Cool'}, available time: ${context.timeAvailable || '30 mins'})

Run the multi-variable weighted decision algorithm:
1. Urgency of Expiring Ingredients (weight 35%)
2. Household Preferences & Spice Tolerance (weight 25%)
3. Available Time & Evening Energy (weight 15%)
4. Nutritional Targets (High Protein, Balanced) (weight 15%)
5. Ambient Temperature / Weather Comfort (weight 10%)

Produce a single definitive recommendation JSON:
{
  "recommendedMeal": {
    "title": "Spiced Chicken, Spinach & Basmati Bowl",
    "cookTimeMinutes": 24,
    "difficulty": "Easy",
    "cuisine": "Fusion Indo-Mediterranean",
    "spiceLevel": "Medium-High (3.5/5)",
    "estimatedCost": "₹68 per serving",
    "preventedWasteGrams": 180,
    "proteinGrams": 31,
    "calories": 485,
    "expiringIngredientsUsed": ["Chicken Breast", "Baby Spinach", "Cherry Tomatoes"],
    "decisionFactors": [
      { "factor": "Expiring Items", "detail": "Rescues spinach (day 4) and fresh chicken before spoilage threshold", "impact": "High" },
      { "factor": "Household Taste", "detail": "Aligns with spicy palate and avoids family allergens", "impact": "High" },
      { "factor": "Time & Effort", "detail": "One-pan skillet meal completed in 24 mins", "impact": "Medium" },
      { "factor": "Weather Context", "detail": "Warming aromatic spices complement 21°C cool evening", "impact": "Medium" },
      { "factor": "Energy Efficiency", "detail": "Induction cooktop saves 72% kWh vs preheating oven", "impact": "High" }
    ],
    "briefWhy": "Tonight's choice rescues 180g of tender greens and poultry nearing expiration, delivers 31g clean protein, and satisfies your household spice preference in under 25 minutes.",
    "steps": [
      { "stepNumber": 1, "instruction": "Season chicken cubes with chili flakes, cracked pepper, garlic, and sea salt.", "timerSeconds": 180 },
      { "stepNumber": 2, "instruction": "Sear chicken in olive oil over medium-high heat for 6 minutes until golden browned.", "timerSeconds": 360 },
      { "stepNumber": 3, "instruction": "Toss in cherry tomatoes and baby spinach; sauté for 3 minutes until spinach wilts gently.", "timerSeconds": 180 },
      { "stepNumber": 4, "instruction": "Fold into warm steamed basmati rice and garnish with toasted sesame oil.", "timerSeconds": 60 }
    ]
  }
}
Return valid JSON only.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in autonomous decision:', err);
    return res.json({
      recommendedMeal: {
        title: "Spiced Chicken & Wilted Spinach Rice Skillet",
        cookTimeMinutes: 24,
        difficulty: "Easy",
        cuisine: "Aromatic Coastal Fusion",
        spiceLevel: "Spiced (4/5)",
        estimatedCost: "₹68 per serving ($1.80)",
        preventedWasteGrams: 180,
        proteinGrams: 31,
        calories: 485,
        expiringIngredientsUsed: ["Chicken Breast", "Baby Spinach", "Cherry Tomatoes"],
        decisionFactors: [
          { factor: "Expiring Ingredients Urgency", detail: "Rescues spinach (day 4) & poultry within safe freshness window", impact: "Critical" },
          { factor: "Household Taste Calibration", detail: "Honors spicy flavor profile; zero prohibited cilantro", impact: "High" },
          { factor: "Time Budget", detail: "One-skillet prep completed in exactly 24 minutes", impact: "High" },
          { factor: "Weather Comfort", detail: "Warm aromatic turmeric & cumin ideal for 21°C evening", impact: "Medium" },
          { factor: "Energy Efficiency", detail: "Induction cooktop uses only 0.38 kWh ($0.04 energy cost)", impact: "High" }
        ],
        briefWhy: "Rescues 180g of tender spinach and chicken nearing expiration date, provides 31g protein, and matches your household preference for aromatic spices in 24 minutes.",
        steps: [
          { stepNumber: 1, instruction: "Dice chicken breast into 1-inch bite pieces and toss with crushed garlic, black pepper, and chili flakes.", timerSeconds: 120 },
          { stepNumber: 2, instruction: "Heat skillet with 1 tsp oil over medium-high. Sear chicken for 6-7 minutes until caramelized.", timerSeconds: 420 },
          { stepNumber: 3, instruction: "Add cherry tomatoes and whole spinach leaves. Cover with lid for 2 minutes to let spinach steam-wilt.", timerSeconds: 120 },
          { stepNumber: 4, instruction: "Stir in pre-cooked basmati rice, drizzle a splash of soy or lime juice, and serve immediately.", timerSeconds: 60 }
        ]
      }
    });
  }
});

// Route: Ingredient Substitution Intelligence
app.post('/api/ingredient-substitutes', async (req, res) => {
  try {
    const { targetIngredient, availableIngredients = [], dietary = [] } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are a culinary chemist and molecular gastronomy chef.
Analyze the target ingredient: "${targetIngredient}".
Available ingredients in user's kitchen: ${JSON.stringify(availableIngredients)}
User dietary preferences: ${JSON.stringify(dietary)}

Generate an intelligent ingredient substitution matrix:
1. Target ingredient culinary profile (Flavor profile, Texture role, Moisture & Acidity contribution)
2. 4 best alternative substitutes with:
   - name: string
   - flavorSimilarityPercent: number (0-100)
   - textureSimilarityPercent: number (0-100)
   - culinaryRole: string (e.g. "Umami binder & salt provider", "Fat & emulsion emulsifier")
   - ratio: string (e.g. "1:1 ratio", "Use 3/4 amount + 1 tsp lemon juice")
   - dietaryTags: array (e.g. ["Vegan", "Dairy-Free", "Keto", "Nut-Free"])
   - isAvailableInFridge: boolean (check if in available ingredients)
   - chefTechniqueNote: actionable advice for swapping this ingredient.

Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in substitutes:', err);
    // Return high quality fallback
    return res.json({
      targetIngredient: req.body.targetIngredient || 'Parmesan Cheese',
      culinaryRole: 'Aged umami depth, crystalline texture, salinity & fat binding',
      substitutes: [
        {
          name: 'Nutritional Yeast',
          flavorSimilarityPercent: 87,
          textureSimilarityPercent: 74,
          culinaryRole: 'Savory cheesy umami & yellow hue',
          ratio: '1:1 ratio (add pinch of salt)',
          dietaryTags: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
          isAvailableInFridge: false,
          chefTechniqueNote: 'Whisk into warm sauces or sprinkle dry over pasta for an instant umami blast without dairy lactose.'
        },
        {
          name: 'Grana Padano or Pecorino',
          flavorSimilarityPercent: 95,
          textureSimilarityPercent: 96,
          culinaryRole: 'Hard aged cheese grating, crystalline crunch & rich fat',
          ratio: '1:1 exact replacement',
          dietaryTags: ['Keto', 'Nut-Free'],
          isAvailableInFridge: false,
          chefTechniqueNote: 'Pecorino is slightly saltier (sheep milk); reduce added salt by 15%.'
        },
        {
          name: 'Sharp Aged Cheddar',
          flavorSimilarityPercent: 82,
          textureSimilarityPercent: 79,
          culinaryRole: 'Sharp tang, melts smoothly into pan sauces',
          ratio: '1:1 finely grated',
          dietaryTags: ['Keto', 'Gluten-Free'],
          isAvailableInFridge: true,
          chefTechniqueNote: 'Grate finely on a microplane to mimic the dry powdery consistency of aged parmesan.'
        },
        {
          name: 'Toasted Cashew + Garlic Powder + Salt',
          flavorSimilarityPercent: 84,
          textureSimilarityPercent: 78,
          culinaryRole: 'Creamy nut fat, savory punch & crumbly topping',
          ratio: 'Pulse 1/2 cup raw cashews with 1/4 tsp salt & garlic powder',
          dietaryTags: ['Vegan', 'Paleo', 'Dairy-Free'],
          isAvailableInFridge: false,
          chefTechniqueNote: 'Pulse in a food processor until it reaches coarse sand texture. Outstanding on roasted vegetables.'
        }
      ]
    });
  }
});

// Route: Recipe Evolution Engine (Higher Protein, Lower Calorie, More Spicy, Restaurant, Budget, 15-Min)
app.post('/api/evolve-recipe', async (req, res) => {
  try {
    const { baseRecipe } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are a world-class culinary scientist and R&D test kitchen chef.
Given this base recipe:
Title: ${baseRecipe?.title || 'Skillet Chicken & Vegetables'}
Description: ${baseRecipe?.description || ''}
Ingredients: ${JSON.stringify(baseRecipe?.matchedIngredients || [])}
Cook Time: ${baseRecipe?.cookTimeMinutes || 25} mins
Calories: ${baseRecipe?.calories || 450}
Macros: ${JSON.stringify(baseRecipe?.macros || {})}

Generate 6 evolutionary versions of this recipe:
1. "Higher Protein" (re-engineered to hit 40-50g+ protein, swaps carbs for high-protein alternatives)
2. "Lower Calorie" (lightened, volume eating, cut calories by 30-40% while preserving flavor)
3. "More Spicy" (intensified heat profile with complementary chiles, peppercorns, aromatic oils)
4. "Restaurant Style" (Michelin/fine-dining elevation with pan reduction, emulsion, refined garnishes)
5. "Budget Version" (replaces premium ingredients with ultra-economical staples to cut cost by 50%+)
6. "15-Minute Flash" (streamlined one-pan high heat technique, preps in under 15 minutes)

Return JSON with format:
{
  "original": {
    "title": string,
    "calories": number,
    "protein": string,
    "cookTime": number,
    "keyHighlight": string
  },
  "evolutions": [
    {
      "id": "higher-protein",
      "name": "Higher Protein",
      "title": string,
      "tagline": string,
      "cookTimeMinutes": number,
      "calories": number,
      "macros": { "protein": string, "carbs": string, "fat": string },
      "costEstimate": string,
      "modifications": [string],
      "secretIngredient": string,
      "chefNote": string,
      "steps": [
        { "stepNumber": number, "instruction": string, "timerSeconds": number }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in recipe evolution:', err);
    // Robust high-fidelity fallbacks
    const title = req.body?.baseRecipe?.title || 'Skillet Mediterranean Bowl';
    return res.json({
      original: {
        title: title,
        calories: 520,
        protein: '28g',
        cookTime: 25,
        keyHighlight: 'Balanced everyday homestyle preparation'
      },
      evolutions: [
        {
          id: 'higher-protein',
          name: 'Higher Protein',
          title: `Double-Protein Power ${title}`,
          tagline: '+18g clean protein boost with whipped Greek yogurt & egg whites',
          cookTimeMinutes: 22,
          calories: 540,
          macros: { protein: '46g', carbs: '28g', fat: '12g' },
          costEstimate: '₹95 / $2.40',
          modifications: [
            'Boost protein portion by 50%',
            'Swap white rice with seasoned edamame and quinoa',
            'Fold in a lemon-whipped garlic Greek yogurt dressing'
          ],
          secretIngredient: 'Whipped Garlic Greek Yogurt & Edamame',
          chefNote: 'Folding Greek yogurt into the warm skillet right off heat creates a velvety high-protein sauce without curdling.',
          steps: [
            { stepNumber: 1, instruction: 'Increase protein to 250g, dice finely, and season with smoked paprika and sea salt.', timerSeconds: 120 },
            { stepNumber: 2, instruction: 'Sear over high heat for 5 minutes until deeply caramelized.', timerSeconds: 300 },
            { stepNumber: 3, instruction: 'Toss in edamame and vegetables; steam for 3 minutes.', timerSeconds: 180 },
            { stepNumber: 4, instruction: 'Kill heat, dollop Greek yogurt garlic crema, and serve immediately.', timerSeconds: 60 }
          ]
        },
        {
          id: 'lower-calorie',
          name: 'Lower Calorie',
          title: `Light & Crisp Zero-Guilt ${title}`,
          tagline: '-35% calories through cauliflower rice swap and air-fry searing',
          cookTimeMinutes: 18,
          calories: 310,
          macros: { protein: '32g', carbs: '14g', fat: '7g' },
          costEstimate: '₹75 / $1.90',
          modifications: [
            'Swap grains with riced cauliflower & shaved cabbage',
            'Use light olive oil spray instead of free-pour cooking oil',
            'Double the fresh leafy greens for maximum satiety and fiber'
          ],
          secretIngredient: 'Charred Shaved Cabbage & Lemon Zest',
          chefNote: 'Dry-char the cauliflower rice in a smoking hot dry skillet to remove moisture and lock in nutty flavors.',
          steps: [
            { stepNumber: 1, instruction: 'Spritz skillet with minimal olive oil spray and sear seasoned protein over medium-high.', timerSeconds: 300 },
            { stepNumber: 2, instruction: 'Add cauliflower rice and shredded vegetables; flash-sauté for 4 minutes.', timerSeconds: 240 },
            { stepNumber: 3, instruction: 'Finish with fresh lemon juice and sea salt flakes.', timerSeconds: 60 }
          ]
        },
        {
          id: 'more-spicy',
          name: 'More Spicy',
          title: `Fiery Aromatic Pepper-Blasted ${title}`,
          tagline: 'Infused with Sichuan chili oil, crushed bird’s eye chiles & cracked black pepper',
          cookTimeMinutes: 20,
          calories: 490,
          macros: { protein: '30g', carbs: '38g', fat: '16g' },
          costEstimate: '₹82 / $2.10',
          modifications: [
            'Bloom whole cumin, mustard seeds, and dried red chiles in hot oil first',
            'Drizzle with scallion-infused chili crisp',
            'Add sliced fresh bird’s eye chiles at the final 60 seconds'
          ],
          secretIngredient: 'Bloomed Whole Spices & Sichuan Chili Crisp',
          chefNote: 'Blooming the spices in oil first dissolves the capsaicin lipids, distributing heat evenly throughout the dish.',
          steps: [
            { stepNumber: 1, instruction: 'Heat 1 tbsp oil, add crushed chiles and cumin seeds until they sputter and become fragrant.', timerSeconds: 90 },
            { stepNumber: 2, instruction: 'Toss protein into the infused oil and sear vigorously for 6 minutes.', timerSeconds: 360 },
            { stepNumber: 3, instruction: 'Add greens, vegetables, and 1 tsp chili crisp; toss over blazing heat for 2 minutes.', timerSeconds: 120 }
          ]
        },
        {
          id: 'restaurant-style',
          name: 'Restaurant Style',
          title: `Michelin-Grade Pan-Basted ${title}`,
          tagline: 'Finished with foaming thyme butter, shallot pan reduction & micro-herbs',
          cookTimeMinutes: 28,
          calories: 580,
          macros: { protein: '34g', carbs: '32g', fat: '22g' },
          costEstimate: '₹140 / $3.50',
          modifications: [
            'French arroser technique: continuous basting with foaming butter & fresh herbs',
            'Deglaze skillet with a splash of dry white wine or vegetable reduction stock',
            'Rest protein for 4 minutes before carving against the grain'
          ],
          secretIngredient: 'Foaming Cultured Butter & Fresh Thyme Sprigs',
          chefNote: 'Basting with foaming butter coats every surface in browned milk solids (hazelnut notes) for luxury mouthfeel.',
          steps: [
            { stepNumber: 1, instruction: 'Sear protein until golden. Tilt skillet, add 1 tbsp butter, crushed garlic, and thyme. Spoon foaming butter over continuously for 3 mins.', timerSeconds: 240 },
            { stepNumber: 2, instruction: 'Rest protein on warm board. Deglaze pan with a splash of broth and reduce to glossy glaze.', timerSeconds: 180 },
            { stepNumber: 3, instruction: 'Layer vegetables with golden ratio plating, slice protein, and spoon pan reduction over top.', timerSeconds: 120 }
          ]
        },
        {
          id: 'budget-version',
          name: 'Budget Version',
          title: `Frugal Pantry Hero ${title}`,
          tagline: '58% cost reduction using lentils, chickpeas, and hearty root staples',
          cookTimeMinutes: 22,
          calories: 460,
          macros: { protein: '26g', carbs: '58g', fat: '9g' },
          costEstimate: '₹34 / $0.85 per serving',
          modifications: [
            'Stretch protein 1:1 with cooked brown lentils or chickpeas',
            'Use whole seasonal root vegetables and hearty pantry staples',
            'Make a simple scratch pan gravy from flour and vegetable water'
          ],
          secretIngredient: 'Brown Lentils & Toasted Cumin Gravy',
          chefNote: 'Cooked lentils absorb the savory fond from the pan bottom, making the dish taste twice as rich for a fraction of the cost.',
          steps: [
            { stepNumber: 1, instruction: 'Sauté diced onions and root vegetables in oil until sweet and caramelized.', timerSeconds: 240 },
            { stepNumber: 2, instruction: 'Add cooked lentils and sliced protein; season with cumin, turmeric, and garlic powder.', timerSeconds: 180 },
            { stepNumber: 3, instruction: 'Simmer with 1/2 cup water to create a rich natural pan sauce. Serve over steamed grains.', timerSeconds: 300 }
          ]
        },
        {
          id: '15-minute',
          name: '15-Minute Flash',
          title: `Flash-Wok Express ${title}`,
          tagline: 'Ultra-fast high heat prep from cutting board to table in 14 minutes',
          cookTimeMinutes: 14,
          calories: 440,
          macros: { protein: '30g', carbs: '35g', fat: '11g' },
          costEstimate: '₹72 / $1.80',
          modifications: [
            'Cut ingredients into thin 1/4-inch bite-sized slivers for instant cooking',
            'Pre-mix all sauce ingredients into a single quick slurry',
            'Flash cook at maximum heat in a pre-heated wok or heavy skillet'
          ],
          secretIngredient: 'Pre-mixed 30-Second Soy-Garlic Slurry',
          chefNote: 'Keep heat at maximum and never overcrowd the skillet so the ingredients blister rather than steam.',
          steps: [
            { stepNumber: 1, instruction: 'Slice ingredients paper-thin. Mix 1 tbsp soy, 1 tsp cornstarch, and garlic in a ramekin.', timerSeconds: 120 },
            { stepNumber: 2, instruction: 'Blaze skillet. Flash sear protein and vegetables together for 4 minutes with continuous tossing.', timerSeconds: 240 },
            { stepNumber: 3, instruction: 'Pour slurry over hot pan, toss for 30 seconds until glossy, and plate immediately.', timerSeconds: 60 }
          ]
        }
      ]
    });
  }
});

// Route: Chef Persona Engine (Radically morphs dishes by culinary master style)
app.post('/api/chef-persona-recipe', async (req, res) => {
  try {
    const { persona, ingredients = [], dietary = [] } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are an iconic master chef with this exact culinary persona: "${persona}".
Culinary styles:
- Indian (Aromatic tadka, mustard seeds, curry leaves, layered garam masala, claypot braising)
- Japanese (Washoku precision, dashi broth, mirin, soy umami, delicate sashimi/steaming)
- Italian (Nonna trattoria, high-acid San Marzano, olive oil emulsification, al dente mastery)
- French (Haute cuisine, mirepoix, butter pan-basting, velouté, classic brigade refinement)
- Korean (Hansik pojangmacha, gochujang fermentation, sesame oil, kimchi tang, sizzling hot pot)
- Mexican (Abuela taqueria, charred fire-roasted chiles, lime acid punch, cumin, epazote)
- Molecular (Modernist lab, agar spherification, savory espumas, precision immersion cooking)
- Fitness (Macro coach, lean protein maximization, clean carb loading, zero seed oils)
- Budget (Frugal wizard, maximum calorie & protein volume per penny, scrap utilization)
- Homestyle (One-pot nostalgia, zero fuss, comfort warmth, easy 1-pan cleanup)

Available ingredients: ${JSON.stringify(ingredients)}
Dietary tags: ${JSON.stringify(dietary)}

Generate a signature dish from this chef persona using these ingredients.
Return JSON with:
{
  "persona": "${persona}",
  "dishTitle": string,
  "personaGreeting": string,
  "tagline": string,
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "calories": number,
  "macros": { "protein": string, "carbs": string, "fat": string },
  "signatureTechnique": string,
  "flavorProfile": string,
  "chefTip": string,
  "steps": [
    { "stepNumber": number, "instruction": string, "timerSeconds": number }
  ]
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in chef persona:', err);
    const p = req.body?.persona || 'Indian';
    return res.json({
      persona: p,
      dishTitle: `${p} Master Chef Creation`,
      personaGreeting: `Namaste! In my kitchen, we turn simple pantry staples into a fragrant feast.`,
      tagline: 'Aromatic layered spice infusion with tempered mustard seeds & curry leaves',
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      calories: 460,
      macros: { protein: '28g', carbs: '36g', fat: '14g' },
      signatureTechnique: 'Aromatic Tadka Blooming in Cold-Pressed Oil',
      flavorProfile: 'Spiced, savory, deeply aromatic with gentle citrus brightness',
      chefTip: 'Never rush the onions: browning them until deep hazelnut gives your curry its golden sweetness.',
      steps: [
        { stepNumber: 1, instruction: 'Sputter mustard seeds and fresh curry leaves in hot oil until crackling.', timerSeconds: 60 },
        { stepNumber: 2, instruction: 'Add minced ginger, garlic, and sliced onions; sauté until rich golden brown.', timerSeconds: 300 },
        { stepNumber: 3, instruction: 'Fold in ground coriander, turmeric, and proteins with 1/4 cup warm water; simmer on low.', timerSeconds: 360 },
        { stepNumber: 4, instruction: 'Garnish with fresh cilantro leaves and a squeeze of fresh lime juice.', timerSeconds: 60 }
      ]
    });
  }
});

// Route: Pantry Challenge Scoring Engine
app.post('/api/pantry-challenge-score', async (req, res) => {
  try {
    const { selectedIngredients = [], userDishIdea = '' } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are the judge of the "Cook With What You Have" Pantry Challenge.
Selected Pantry Items: ${JSON.stringify(selectedIngredients)}
Dish Idea or Concept: "${userDishIdea || 'Spontaneous Pantry Stir-Fry'}"

Evaluate and score this pantry meal strictly on 5 criteria (0-100 score):
1. ingredientUtilization (percentage of chosen ingredients utilized effectively)
2. creativity (originality of culinary combination)
3. nutrition (macro balance, micronutrients, satiety)
4. wasteReduction (rescue of vulnerable or perishable items)
5. difficulty (culinary execution complexity)

Also calculate:
- xpEarned: number (between 250 and 500)
- badgeUnlocked: string (e.g. "Zero-Waste Prodigy", "Scrappy Gourmet", "Pantry Alchemist")
- feedbackQuote: string (encouraging chef praise)
- challengeDishTitle: string
- cookTimeMinutes: number

Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in pantry challenge:', err);
    return res.json({
      challengeDishTitle: 'Crispy Pan-Seared Pantry Medley',
      ingredientUtilization: 94,
      creativity: 87,
      nutrition: 82,
      wasteReduction: 96,
      difficulty: 61,
      xpEarned: 380,
      badgeUnlocked: 'Zero-Waste Prodigy',
      feedbackQuote: 'Outstanding pantry arbitrage! You turned 5 separate staples into a cohesive, high-protein skillet in under 20 minutes.',
      cookTimeMinutes: 18
    });
  }
});

// Route: Grocery Price Intelligence & Budget Mode ("Feed 4 people under ₹500")
app.post('/api/budget-meal-plan', async (req, res) => {
  try {
    const { targetBudget = 500, currency = '₹', partySize = 4, availableIngredients = [] } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are a culinary economist and budget nutrition strategist.
Target Budget: ${currency}${targetBudget}
Party Size: ${partySize} people
Available Pantry Items: ${JSON.stringify(availableIngredients)}

Build a complete, highly nutritious meal plan that strictly stays under ${currency}${targetBudget} (or equivalent in USD/INR).
Calculate:
- recipeTitle: string
- totalEstimatedCost: string (e.g. "${currency}380")
- costPerServing: string (e.g. "${currency}95")
- proteinPerServingGrams: number (e.g. 38)
- caloriesPerServing: number (e.g. 560)
- costPer10gProtein: string (e.g. "${currency}25.0")
- groceryBreakdown: array of objects ({ item: string, qty: string, cost: string, source: 'Pantry (Free)' | 'To Buy' })
- strategyHighlight: string
- steps: array of objects ({ stepNumber: number, instruction: string, timerSeconds: number })

Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in budget meal plan:', err);
    const curr = req.body?.currency || '₹';
    return res.json({
      recipeTitle: 'Spiced Lentil, Chicken & Spinach Family Skillet',
      totalEstimatedCost: `${curr}368`,
      costPerServing: `${curr}92`,
      proteinPerServingGrams: 42,
      caloriesPerServing: 618,
      costPer10gProtein: `${curr}21.9`,
      groceryBreakdown: [
        { item: 'Chicken Breast (400g)', qty: '400g', cost: `${curr}180`, source: 'To Buy' },
        { item: 'Baby Spinach', qty: '1 bunch', cost: `${curr}30`, source: 'Pantry (Free)' },
        { item: 'Brown Lentils', qty: '200g', cost: `${curr}38`, source: 'To Buy' },
        { item: 'Basmati Rice', qty: '400g', cost: `${curr}60`, source: 'Pantry (Free)' },
        { item: 'Tomatoes & Onions', qty: '4 pcs', cost: `${curr}40`, source: 'To Buy' },
        { item: 'Cooking Spices & Oil', qty: 'Staple', cost: `${curr}20`, source: 'Pantry (Free)' }
      ],
      strategyHighlight: 'Stretches poultry 1:1 with nutritious brown lentils to deliver 42g protein per person for under ₹95 per plate.',
      steps: [
        { stepNumber: 1, instruction: 'Rinse lentils and simmer in 3 cups water until tender (15 mins).', timerSeconds: 900 },
        { stepNumber: 2, instruction: 'Sauté chopped onions and diced chicken in oil until browned.', timerSeconds: 360 },
        { stepNumber: 3, instruction: 'Combine cooked lentils, chicken, tomatoes, and spinach in one large pot; simmer for 6 minutes.', timerSeconds: 360 },
        { stepNumber: 4, instruction: 'Serve warm over steamed fluffy rice with fresh lime wedges.', timerSeconds: 60 }
      ]
    });
  }
});

// Route: Multi-Person Household "Dinner for Everyone" Synthesizer
app.post('/api/household-dinner-for-everyone', async (req, res) => {
  try {
    const { members = [], availableIngredients = [] } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are a culinary diplomat specializing in resolving complex household dinner conflicts.
Household Members:
${JSON.stringify(members, null, 2)}

Available Ingredients:
${JSON.stringify(availableIngredients)}

Design "Dinner for Everyone":
1. Choose ONE harmonious, unified base recipe that cooks together in 1-2 pans.
2. Provide specific modular modifications for EACH member (e.g., Varun: add seared chili chicken skewers, Mom: swap with grilled paneer, Dad: reserve un-salted portion seasoned with lemon zest & fresh dill).
3. Ensure all dietary restrictions, spice levels, and dislikes are strictly satisfied without forcing the cook to make 3 separate meals.

Return JSON:
{
  "baseRecipeTitle": string,
  "tagline": string,
  "cookTimeMinutes": number,
  "baseTechnique": string,
  "sharedBaseIngredients": [string],
  "harmonyScore": number (85-99),
  "harmonyReason": string,
  "memberModifications": [
    {
      "memberName": string,
      "memberDietary": string,
      "personalizedDishName": string,
      "modifications": [string],
      "spiceAdjustment": string,
      "macros": { "protein": string, "carbs": string, "fat": string },
      "chefNote": string
    }
  ],
  "steps": [
    { "stepNumber": number, "instruction": string, "timerSeconds": number }
  ]
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in household dinner:', err);
    return res.json({
      baseRecipeTitle: 'Fragrant Turmeric Rice & Roasted Mediterranean Veg Base',
      tagline: 'A flexible, golden spiced one-pot foundation with customized protein and seasoning modules',
      cookTimeMinutes: 28,
      baseTechnique: 'Aromatic one-skillet steaming with split pan finishing',
      sharedBaseIngredients: ['Basmati Rice', 'Baby Spinach', 'Tomatoes', 'Onions', 'Garlic', 'Turmeric'],
      harmonyScore: 94,
      harmonyReason: 'Zero allergen crossover. Base is vegetarian and zero-added-salt, allowing individual customization in the final 4 minutes.',
      memberModifications: [
        {
          memberName: 'Varun',
          memberDietary: 'High Protein • Spicy • No Mushrooms',
          personalizedDishName: 'Chili-Charred Chicken & Turmeric Skillet',
          modifications: ['Sear 200g diced chicken breast in a mini side-skillet with crushed bird’s eye chiles and smoked paprika', 'Fold into Varun’s bowl for +36g protein'],
          spiceAdjustment: 'Level 4/5 Fiery Heat',
          macros: { protein: '44g', carbs: '42g', fat: '11g' },
          chefNote: 'Tossed with fried garlic chili crisp for high-protein crunch.'
        },
        {
          memberName: 'Mom',
          memberDietary: 'Vegetarian • Mild Spice',
          personalizedDishName: 'Golden Paneer & Spinach Pilaf',
          modifications: ['Pan-sear 120g cubed paneer/tofu in ghee until golden', 'Fold gently into Mom’s portion with sweet roasted tomatoes'],
          spiceAdjustment: 'Level 1/5 Gentle & Aromatic',
          macros: { protein: '22g', carbs: '46g', fat: '14g' },
          chefNote: 'Finished with a squeeze of fresh lemon and toasted cumin.'
        },
        {
          memberName: 'Dad',
          memberDietary: 'Low Sodium • Heart-Healthy',
          personalizedDishName: 'Herbed Citrus & Lentil Rice Bowl',
          modifications: ['Scooped directly from un-salted base', 'Enhanced with fresh dill, cracked black pepper, lemon zest, and toasted walnuts for potassium and healthy fats'],
          spiceAdjustment: 'Level 2/5 Balanced',
          macros: { protein: '24g', carbs: '48g', fat: '9g' },
          chefNote: 'Acidity from lemon zest and herbs compensates for the lack of sodium.'
        }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Sauté onions and garlic in olive oil without adding salt. Add basmati rice, turmeric, and 2 cups vegetable broth; cover and simmer for 15 mins.', timerSeconds: 900 },
        { stepNumber: 2, instruction: 'In parallel, sear Varun’s chili chicken in one small skillet, and Mom’s paneer cubes in another (5 mins).', timerSeconds: 300 },
        { stepNumber: 3, instruction: 'Scoop Dad’s portion from the base pot, finish with lemon juice and fresh herbs.', timerSeconds: 60 },
        { stepNumber: 4, instruction: 'Portion remaining base into Varun’s and Mom’s bowls, top with their respective proteins and customized seasoning.', timerSeconds: 60 }
      ]
    });
  }
});

// Route: Natural Conversational Kitchen Voice Agent
app.post('/api/conversational-kitchen-agent', async (req, res) => {
  try {
    const { message, conversationHistory = [], currentRecipe, availableIngredients = [] } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are FridgeChef AI Voice Kitchen Agent.
You are having an active spoken conversation with the cook in their kitchen.
User Said: "${message}"
Conversation History: ${JSON.stringify(conversationHistory)}
Current Recipe Draft: ${JSON.stringify(currentRecipe || null)}
Available Ingredients: ${JSON.stringify(availableIngredients)}

Your persona:
- Concise, warm, confident culinary pro.
- Speaks naturally (max 2-3 spoken sentences so it works on TTS audio).
- If user asks "what can I make?", identify 2-3 ingredients and propose a specific dish with cook time & protein.
- If user asks for adjustments (e.g. "make it spicier", "lower calorie", "more protein", "no dairy"), modify the recipe accordingly and state what you changed.
- If user says "start cooking", trigger action "START_COOKING".

Return strictly JSON:
{
  "replyText": string,
  "action": "PROPOSE_RECIPE" | "MODIFY_RECIPE" | "START_COOKING" | "ANSWER_QUESTION",
  "updatedRecipe": {
    "title": string,
    "description": string,
    "cookTimeMinutes": number,
    "calories": number,
    "macros": { "protein": string, "carbs": string, "fat": string },
    "spiceLevel": string,
    "keyModification": string,
    "steps": [
      { "stepNumber": number, "instruction": string, "timerSeconds": number }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error in voice kitchen agent:', err);
    const msg = (req.body?.message || '').toLowerCase();
    if (msg.includes('start') || msg.includes('cook')) {
      return res.json({
        replyText: 'Starting your step-by-step hands-free cooking session now. Ready for step one!',
        action: 'START_COOKING',
        updatedRecipe: req.body?.currentRecipe || null
      });
    } else if (msg.includes('spic')) {
      return res.json({
        replyText: 'Done! I am increasing crushed bird’s eye chili, garlic, and cracked pepper while keeping the sodium roughly similar.',
        action: 'MODIFY_RECIPE',
        updatedRecipe: {
          title: 'Fiery Pepper-Blasted Skillet Bowl',
          description: 'Spiced with whole bloomed cumin, chili crisp & fresh sliced peppers',
          cookTimeMinutes: 20,
          calories: 490,
          macros: { protein: '34g', carbs: '36g', fat: '14g' },
          spiceLevel: 'Hot (Level 4/5)',
          keyModification: 'Infused with Sichuan chili crisp and fresh chiles',
          steps: [
            { stepNumber: 1, instruction: 'Bloom crushed red chiles and garlic in hot oil for 60 seconds.', timerSeconds: 60 },
            { stepNumber: 2, instruction: 'Add chicken and sear vigorously until browned.', timerSeconds: 300 },
            { stepNumber: 3, instruction: 'Toss in vegetables and steamed rice with 1 tsp chili crisp.', timerSeconds: 180 }
          ]
        }
      });
    } else {
      return res.json({
        replyText: 'You’ve got chicken, spinach, and rice. I can make a 22-minute high-protein garlic chicken bowl with 36g protein.',
        action: 'PROPOSE_RECIPE',
        updatedRecipe: {
          title: 'Garlic Chicken & Wilted Spinach Rice Skillet',
          description: 'Quick-seared protein bowl with garlic wilted greens',
          cookTimeMinutes: 22,
          calories: 480,
          macros: { protein: '36g', carbs: '44g', fat: '12g' },
          spiceLevel: 'Medium (Level 2/5)',
          keyModification: 'Balanced everyday healthy dinner',
          steps: [
            { stepNumber: 1, instruction: 'Dice chicken and season with black pepper, garlic powder, and a pinch of salt.', timerSeconds: 120 },
            { stepNumber: 2, instruction: 'Sear chicken in skillet over medium-high heat for 6 minutes.', timerSeconds: 360 },
            { stepNumber: 3, instruction: 'Fold in fresh baby spinach and pre-cooked rice; toss for 3 minutes.', timerSeconds: 180 }
          ]
        }
      });
    }
  }
});

// Route: Plate Photo Post-Cooking Food Analysis & Plating Critique (Gemini Vision)
app.post('/api/analyze-plate-photo', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    const ai = getGeminiClient();

    let parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
    }

    const promptText = `You are a 3-Michelin-star master culinary judge and sensory scientist.
Analyze this plated dish photo in detail.
Estimate:
1. dishName: string
2. estimatedPortionSize: string (e.g. "Single generous portion (380g)")
3. detectedIngredients: array of strings
4. approximateMacros: { calories: number, protein: string, carbs: string, fat: string }
5. plateScores: {
     presentation: number (0-100),
     nutritionalBalance: number (0-100),
     colorDiversity: number (0-100),
     platingGeometry: number (0-100),
     overallScore: number (0-100)
   }
6. chefCritique: string (2-3 sentences of authentic restaurant-grade feedback)
7. elevationTip: string (e.g. "Add a small acidic garnish and move the protein slightly off-center using the rule of thirds.")

Return strictly JSON.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error analyzing plate photo:', err);
    return res.json({
      dishName: 'Pan-Seared Golden Protein Bowl with Herb Wilted Greens',
      estimatedPortionSize: 'Single entree portion (~420g)',
      detectedIngredients: ['Seared Chicken', 'Sautéed Baby Spinach', 'Steamed Rice', 'Garlic Glaze', 'Toasted Sesame'],
      approximateMacros: { calories: 510, protein: '38g', carbs: '46g', fat: '13g' },
      plateScores: {
        presentation: 82,
        nutritionalBalance: 91,
        colorDiversity: 88,
        platingGeometry: 79,
        overallScore: 85
      },
      chefCritique: 'Beautiful Maillard crust on the protein and vibrant chlorophyll retention in the greens. The starch foundation anchors the dish cleanly.',
      elevationTip: 'Add a small acidic garnish (pickled shallots or micro-cilantro) and move the protein slightly off-center using the rule-of-thirds.'
    });
  }
});

// Route: Event / Guest Mode (AI Catering Planner)
app.post('/api/event-catering-plan', async (req, res) => {
  try {
    const {
      guestCount = 8,
      budget = 2500,
      currency = '₹',
      cuisine = 'Indian',
      vegCount = 3,
      nonVegCount = 5,
      prepTimeHours = 2,
      availableIngredients = []
    } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are an executive catering chef and hospitality logistics director.
Plan a seamless dinner event for:
- Guests: ${guestCount} total (${vegCount} Vegetarian, ${nonVegCount} Non-Vegetarian)
- Budget: ${currency}${budget}
- Cuisine Theme: ${cuisine}
- Available Prep Time: ${prepTimeHours} hours
- Available In-House Ingredients: ${JSON.stringify(availableIngredients)}

Generate a complete catering plan:
1. menuCourses: array of objects ({ courseName: 'Appetizer' | 'Main Dish (Veg)' | 'Main Dish (Non-Veg)' | 'Accompaniment' | 'Dessert', title: string, description: string, scaledPortions: string, keyIngredients: [string] })
2. totalEstimatedCost: string (e.g. "${currency}2,180")
3. procurementShoppingList: array of objects ({ item: string, qty: string, estCost: string, category: string })
4. prepTimeline: array of objects ({ timeMarker: string (e.g. "T-minus 120m", "T-minus 45m"), action: string, chefTip: string })
5. servingSchedule: array of objects ({ time: string, action: string })
6. cateringProTip: string

Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error generating event catering plan:', err);
    const curr = req.body?.currency || '₹';
    return res.json({
      menuCourses: [
        {
          courseName: 'Appetizer',
          title: 'Charred Spiced Paneer & Vegetable Skewers',
          description: 'Smoky tandoori marinated bites finished with chaat masala',
          scaledPortions: '16 skewers (2 per guest)',
          keyIngredients: ['Paneer', 'Bell Peppers', 'Onions', 'Yogurt', 'Chaat Masala']
        },
        {
          courseName: 'Main Dish (Non-Veg)',
          title: 'Slow-Simmered Murgh Makhani (Butter Chicken)',
          description: 'Velvety fenugreek and tomato gravy with charred chicken thighs',
          scaledPortions: '5 generous portions (1.2 kg total)',
          keyIngredients: ['Chicken Thighs', 'Tomatoes', 'Butter', 'Cream', 'Kasuri Methi']
        },
        {
          courseName: 'Main Dish (Veg)',
          title: 'Smoky Dal Bukhara & Charred Palak Paneer',
          description: 'Slow-cooked black lentils simmered with ginger & cream',
          scaledPortions: '3 generous portions (800g total)',
          keyIngredients: ['Black Urad Dal', 'Spinach', 'Paneer', 'Garlic', 'Ghee']
        },
        {
          courseName: 'Accompaniment',
          title: 'Fragrant Jeera Basmati Rice & Fluffy Garlic Naan',
          description: 'Toasted cumin basmati rice and warm herb flatbreads',
          scaledPortions: '8 portions (800g raw rice yield)',
          keyIngredients: ['Basmati Rice', 'Cumin Seeds', 'Flour', 'Garlic Butter']
        }
      ],
      totalEstimatedCost: `${curr}2,140`,
      procurementShoppingList: [
        { item: 'Chicken Thighs (1 kg)', qty: '1 kg', estCost: `${curr}320`, category: 'Poultry' },
        { item: 'Paneer (500g)', qty: '500g', estCost: `${curr}210`, category: 'Dairy' },
        { item: 'Cooking Cream & Butter', qty: '1 unit each', estCost: `${curr}180`, category: 'Dairy' },
        { item: 'Basmati Rice (1 kg)', qty: '1 kg', estCost: `${curr}120`, category: 'Pantry' },
        { item: 'Tomatoes & Onions', qty: '2 kg', estCost: `${curr}90`, category: 'Produce' }
      ],
      prepTimeline: [
        { timeMarker: 'T-minus 120m', action: 'Marinate chicken & paneer skewers. Rinse and soak basmati rice and black lentils.', chefTip: 'Early salting draws moisture for a deeper crust.' },
        { timeMarker: 'T-minus 75m', action: 'Begin tomato-fenugreek butter gravy. Simmer over low heat to reduce acidity.', chefTip: 'Cover to avoid stove splatters.' },
        { timeMarker: 'T-minus 35m', action: 'Bake/sear appetizers and simmer jeera rice on low steam.', chefTip: 'Rest cooked proteins 5 minutes before serving.' },
        { timeMarker: 'T-minus 10m', action: 'Warm serving platters, chop fresh cilantro, reheat gravies to steaming.', chefTip: 'Never serve hot curries onto cold ceramic plates.' }
      ],
      servingSchedule: [
        { time: '00:00', action: 'Serve welcome drinks and warm paneer skewers.' },
        { time: '+00:30', action: 'Buffet / family-style main course spread with steaming jeera rice.' },
        { time: '+01:15', action: 'Digestive cardamom tea or sweet fruit compote.' }
      ],
      cateringProTip: 'Cook both curries in parallel using identical aromatic bases (onion-ginger-garlic paste) to cut prep time by 40%.'
    });
  }
});

// Route: Autonomous Culinary Agent (The Autonomous Culinary Operating System)
app.post('/api/autonomous-agent-plan', async (req, res) => {
  try {
    const { goal = 'Plan my meals for this week while minimizing food waste and keeping groceries below ₹2,500.', availableIngredients = [], budget = 2500 } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are the FridgeChef Autonomous Culinary Agent — an autonomous culinary operating system.
User Goal: "${goal}"
Available Inventory: ${JSON.stringify(availableIngredients)}
Weekly Budget: ₹${budget}

Execute the 12-stage autonomous culinary workflow:
1. pantryAudit
2. expiryInspection
3. preferenceAnalysis
4. mealPlanning (7 days)
5. ingredientCrossReuse
6. nutritionalCalculation
7. costOptimization
8. consolidatedShoppingList
9. cookingSchedule
10. handsFreeGuidanceReady
11. leftoverRepurposing
12. feedbackLearningLoop

Return JSON with format:
{
  "goal": "${goal}",
  "agentStatus": "OPTIMIZED & EXECUTABLE",
  "projectedWeeklySavings": "₹1,180",
  "projectedWasteReductionKg": 4.8,
  "weeklyCostEstimate": "₹2,140",
  "pantryUtilizationRate": 92,
  "stages": [
    { "stageNumber": number, "title": string, "detail": string, "status": "Completed" | "Ready" }
  ],
  "sevenDayMealPlan": [
    { "day": string, "mealName": string, "cookTime": string, "rescuedIngredient": string, "protein": string, "calories": number }
  ],
  "ingredientCrossReuseGraph": [
    { "ingredient": string, "usedInDays": [string], "savingsNote": string }
  ],
  "consolidatedShoppingList": [
    { "item": string, "qty": string, "estCost": string }
  ],
  "agentExecutiveSummary": string
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { responseMimeType: 'application/json' },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    // Responses from here are offline sample data, not AI output
    res.set('X-AI-Fallback', '1');
    console.error('Error running autonomous culinary agent:', err);
    return res.json({
      goal: req.body?.goal || 'Plan my meals for this week while minimizing food waste and keeping groceries below ₹2,500.',
      agentStatus: 'OPTIMIZED & EXECUTABLE',
      projectedWeeklySavings: '₹1,180',
      projectedWasteReductionKg: 4.8,
      weeklyCostEstimate: '₹2,140',
      pantryUtilizationRate: 92,
      stages: [
        { stageNumber: 1, title: 'Pantry Inventory Audited', detail: '14 active items cataloged across 4 fridge microclimates.', status: 'Completed' },
        { stageNumber: 2, title: 'Expiry Matrix Calculated', detail: 'Flagged spinach & chicken for immediate 48-hour rescue.', status: 'Completed' },
        { stageNumber: 3, title: 'Household Taste Vectors Synthesized', detail: 'Weighted for high protein, low sodium, and spicy aromatics.', status: 'Completed' },
        { stageNumber: 4, title: '7-Day Cyclical Menu Generated', detail: 'Zero duplicate meals; all balanced with high protein & fiber.', status: 'Completed' },
        { stageNumber: 5, title: 'Ingredient Cross-Reuse Optimized', detail: 'Rice, spinach, and roasted aromatics reused across 4 dinners.', status: 'Completed' },
        { stageNumber: 6, title: 'Nutritional Equilibrium Verified', detail: 'Average 126g protein, 28g fiber, 2,150 kcal daily.', status: 'Completed' },
        { stageNumber: 7, title: 'Cost Arbitrage Enforced', detail: 'Total grocery spend capped at ₹2,140 (under ₹2,500 ceiling).', status: 'Completed' },
        { stageNumber: 8, title: 'Consolidated Shopping List Built', detail: 'Only 5 missing items needed; 68% sourced from existing pantry.', status: 'Completed' },
        { stageNumber: 9, title: 'Cooking Order Scheduled', detail: 'Batch grain cooking on Sunday saves 1.5 hrs of weeknight prep.', status: 'Completed' },
        { stageNumber: 10, title: 'Voice Guidance Ready', detail: 'All 7 meals mapped to step-by-step hands-free voice audio.', status: 'Ready' },
        { stageNumber: 11, title: 'Leftover Repurposing Engine Active', detail: 'Day 3 leftover chicken auto-transforms into Day 4 skillet wrap.', status: 'Ready' },
        { stageNumber: 12, title: 'Continuous Feedback Learning Armed', detail: 'Every star rating will adapt future macro & seasoning weights.', status: 'Ready' }
      ],
      sevenDayMealPlan: [
        { day: 'Monday', mealName: 'Garlic Chicken & Spinach Skillet', cookTime: '20 min', rescuedIngredient: 'Fresh Spinach & Chicken', protein: '38g', calories: 480 },
        { day: 'Tuesday', mealName: 'Spiced Lentil, Paneer & Cumin Bowl', cookTime: '25 min', rescuedIngredient: 'Brown Lentils', protein: '32g', calories: 510 },
        { day: 'Wednesday', mealName: 'Sesame Edamame & Egg Fried Quinoa', cookTime: '15 min', rescuedIngredient: 'Edamame & Eggs', protein: '30g', calories: 460 },
        { day: 'Thursday', mealName: 'Crispy Herb Chicken & Roasted Veggies', cookTime: '22 min', rescuedIngredient: 'Monday Chicken Fond', protein: '36g', calories: 490 },
        { day: 'Friday', mealName: 'Mediterranean Chickpea & Tomato Ragout', cookTime: '18 min', rescuedIngredient: 'Tomatoes & Herbs', protein: '26g', calories: 440 },
        { day: 'Saturday', mealName: 'High-Protein Tofu & Broccoli Flash Wok', cookTime: '14 min', rescuedIngredient: 'Pre-cut Greens', protein: '34g', calories: 420 },
        { day: 'Sunday', mealName: 'Slow-Simmered Sunday Curry & Fluffy Rice', cookTime: '35 min', rescuedIngredient: 'Whole Spices & Yogurt', protein: '42g', calories: 580 }
      ],
      ingredientCrossReuseGraph: [
        { ingredient: 'Baby Spinach', usedInDays: ['Monday', 'Tuesday', 'Friday'], savingsNote: 'Bought 1 bulk bunch, zero leaves wasted.' },
        { ingredient: 'Chicken Breast', usedInDays: ['Monday', 'Thursday'], savingsNote: 'Prep once, sear fresh twice.' },
        { ingredient: 'Basmati Rice', usedInDays: ['Monday', 'Wednesday', 'Sunday'], savingsNote: '1 batch cook, 3 rapid dinners.' }
      ],
      consolidatedShoppingList: [
        { item: 'Chicken Breast (800g)', qty: '800g', estCost: '₹340' },
        { item: 'Paneer / Tofu (400g)', qty: '400g', estCost: '₹160' },
        { item: 'Fresh Broccoli & Cabbage', qty: '1 kg', estCost: '₹80' },
        { item: 'Greek Yogurt (400g)', qty: '400g', estCost: '₹95' },
        { item: 'Brown Lentils (500g)', qty: '500g', estCost: '₹65' }
      ],
      agentExecutiveSummary: 'Autonomous plan achieves 92% pantry utilization, saves ₹1,180 in avoided food waste, and meets all personal macro and taste constraints while keeping grocery spending at ₹2,140.'
    });
  }
});

// ---------- Site endpoints: contact form, analytics, robots, sitemap ----------

const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data');
const appendJsonLine = async (file: string, record: unknown) => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(path.join(DATA_DIR, file), JSON.stringify(record) + '\n', 'utf-8');
};

// Public origin for absolute URLs (sitemap, Open Graph). APP_URL wins; otherwise use the request host.
const siteOrigin = (req: express.Request) => {
  const configured = process.env.APP_URL;
  if (configured && configured !== 'MY_APP_URL') return configured.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
};

// Very small in-memory rate limiter, keyed by IP (IPs are never written to disk)
const rateBuckets = new Map<string, number[]>();
const rateLimited = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const hits = (rateBuckets.get(key) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  rateBuckets.set(key, hits);
  return hits.length > limit;
};

app.post('/api/contact', async (req, res) => {
  const { name, email, message, website } = req.body || {};
  // Honeypot: bots fill the hidden field; pretend success
  if (website) return res.json({ ok: true });
  if (rateLimited(`contact:${req.ip}`, 5, 10 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many messages. Please try again later.' });
  }
  const fields: Record<string, string> = {};
  if (typeof name !== 'string' || !name.trim()) fields.name = 'Please enter your name.';
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) fields.email = 'Please enter a valid email.';
  if (typeof message !== 'string' || message.trim().length < 10) fields.message = 'Please write at least 10 characters.';
  else if (message.length > 4000) fields.message = 'Please keep it under 4,000 characters.';
  if (Object.keys(fields).length) return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });

  try {
    await appendJsonLine('contact-messages.jsonl', {
      receivedAt: new Date().toISOString(),
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 320),
      message: message.trim(),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Could not store contact message:', err);
    return res.status(500).json({ error: 'Your message could not be saved. Please try again.' });
  }
});

const ANALYTICS_EVENTS = new Set(['page_view', 'contact_submitted']);
app.post('/api/analytics', express.json({ type: ['application/json', 'text/plain'] }), async (req, res) => {
  const { event, props, path: pagePath, ref } = req.body || {};
  if (!ANALYTICS_EVENTS.has(event) || rateLimited(`analytics:${req.ip}`, 120, 60 * 1000)) return res.status(204).end();
  const safeProps: Record<string, string | number | boolean> = {};
  if (props && typeof props === 'object') {
    for (const [k, v] of Object.entries(props).slice(0, 10)) {
      if (['string', 'number', 'boolean'].includes(typeof v)) safeProps[k.slice(0, 40)] = typeof v === 'string' ? v.slice(0, 120) : (v as number | boolean);
    }
  }
  appendJsonLine('analytics.jsonl', {
    ts: new Date().toISOString(),
    event,
    props: safeProps,
    path: typeof pagePath === 'string' ? pagePath.slice(0, 200) : undefined,
    ref: typeof ref === 'string' ? ref.slice(0, 200) : undefined,
  }).catch((err) => console.error('Analytics write failed:', err));
  return res.status(204).end();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteOrigin(req)}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const origin = siteOrigin(req);
  const lastmod = new Date().toISOString().split('T')[0];
  // Hash routes are not crawlable as separate URLs, so only the app root is listed
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`
  );
});

// Fill absolute-URL placeholders in index.html; any path other than / gets a real 404 status
const renderIndexHtml = (html: string, req: express.Request) => html.replaceAll('%SITE_URL%', siteOrigin(req));
const isAppRoot = (p: string) => p === '/' || p === '/index.html';

// Unknown API routes return JSON 404 instead of falling through to the SPA HTML
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Malformed JSON / oversized payloads return JSON errors the client can handle
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(err);
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  return next(err);
});

// Setup Vite or Serve Static in Production
async function setupServer() {
  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // Use the real index.html so dev and prod share the same meta tags
        const rawHtml = await fs.readFile(path.resolve('index.html'), 'utf-8');
        const template = await vite.transformIndexHtml(url, renderIndexHtml(rawHtml, req));
        res.status(isAppRoot(req.path) ? 200 : 404).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distDir = path.resolve('dist');
    // Hashed assets are immutable; cache them aggressively. index.html must stay fresh.
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), { immutable: true, maxAge: '1y' })
    );
    app.use(express.static(distDir, { index: false }));
    const indexHtmlPromise = fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
    app.get('*', async (req, res) => {
      res.set('Cache-Control', 'no-cache');
      res.status(isAppRoot(req.path) ? 200 : 404).type('html').send(renderIndexHtml(await indexHtmlPromise, req));
    });
  }

  app.listen(PORT, () => {
    console.log(`FridgeChef AI Server running on http://localhost:${PORT} (${IS_PRODUCTION ? 'production' : 'development'})`);
  });
}

setupServer();
