# 🍳 FridgeChef AI — Smart Fridge & Autonomous Culinary Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_3.8-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

> **Snap a photo of your fridge, audit ingredients in real-time, generate zero-waste Michelin-grade recipes, cook hands-free with voice guidance, and experience a native iOS / Android mobile interface.**

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [⭐ Flagship AI & Culinary Innovations](#-flagship-ai--culinary-innovations)
  - [1. 🧠 FridgeChef Memory Engine](#1--fridgechef-memory-engine)
  - [2. 📸 Receipt → Pantry AI](#2--receipt--pantry-ai)
  - [3. 🧊 Fridge Digital Twin](#3--fridge-digital-twin)
  - [4. 🤖 Autonomous Meal Decision Engine](#4--autonomous-meal-decision-engine)
  - [5. 🧬 Ingredient Substitution Intelligence](#5--ingredient-substitution-intelligence)
  - [6. 🧪 Recipe Evolution Engine](#6--recipe-evolution-engine)
  - [7. 👨🍳 Chef Persona Engine](#7--chef-persona-engine)
  - [8. 🎯 “Cook With What You Have” Challenge](#8--cook-with-what-you-have-challenge)
  - [9. 🧠 “Why This Recipe?” AI Explainability](#9--why-this-recipe-ai-explainability)
  - [10. 💰 Grocery Price Intelligence & Budget Mode](#10--grocery-price-intelligence--budget-mode)
  - [11. 📊 Personal Nutrition Dashboard](#11--personal-nutrition-dashboard)
  - [12. 🌍 Food Waste Carbon Calculator](#12--food-waste-carbon-calculator)
  - [13. 🌡️ Smart Fridge Sensor Integration (IoT + AI)](#13--smart-fridge-sensor-integration-iot--ai)
  - [14. ⚖️ Food Safety Intelligence](#14--food-safety-intelligence)
  - [15. 🧑🤝🧑 Multi-Person Household Profiles](#15--multi-person-household-profiles)
  - [16. 🗣️ Natural Conversational Kitchen Agent](#16--natural-conversational-kitchen-agent)
  - [17. 🧠 Recipe Knowledge Graph](#17--recipe-knowledge-graph)
  - [18. 🔬 AI Recipe Scientific Validation](#18--ai-recipe-scientific-validation)
  - [19. 🧑🍳 Cooking Skill Adaptation](#19--cooking-skill-adaptation)
  - [20. 📷 Plate Photo → Food & Plating Analysis](#20--plate-photo--food--plating-analysis)
  - [21. 🧠 Taste Preference Learning Model](#21--taste-preference-learning-model)
  - [22. 🕐 Context-Aware Cooking & Moods](#22--context-aware-cooking--moods)
  - [23. 🎉 Event & Guest Mode (AI Catering Planner)](#23--event--guest-mode-ai-catering-planner)
  - [24. 🧾 Pantry Financial Intelligence](#24--pantry-financial-intelligence)
  - [25. 🤖 Autonomous Culinary Operating System Agent](#25--autonomous-culinary-operating-system-agent)
- [Complete Feature Inventory](#-complete-feature-inventory)
  - [1. AI Vision & Fridge Scanner](#1-ai-vision--fridge-scanner)
  - [2. Native iOS & Android Experience](#2-native-ios--android-experience)
  - [3. Recipe Engine & Zero-Waste Arbitrage](#3-recipe-engine--zero-waste-arbitrage)
  - [4. Hands-Free Voice Cooking & Step-by-Step Guidance](#4-hands-free-voice-cooking--step-by-step-guidance)
  - [5. Pantry Health & Expiration Management](#5-pantry-health--expiration-management)
  - [6. 7-Day Meal Planner & Sommelier Pairings](#6-7-day-meal-planner--sommelier-pairings)
  - [7. Advanced Culinary & Sensory Science Labs](#7-advanced-culinary--sensory-science-labs)
  - [8. Smart Shopping List & Household Sync](#8-smart-shopping-list--household-sync)
- [Project Structure](#-project-structure)
- [Backend API Endpoints](#-backend-api-endpoints)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Environment Variables](#-environment-variables)
- [Build & Deployment](#-build--deployment)

---

## 🌟 Overview

**FridgeChef AI** transforms everyday household ingredients into gourmet, chef-designed meals. By integrating **Google Gemini 3.8 Flash** multi-modal vision with client-side sensory science tools, the app eliminates food waste, streamlines grocery budgets, and guides cooks of all skill levels step-by-step through voice-assisted cooking sessions.

Built with a **mobile-first, native OS philosophy**, FridgeChef AI features an **iOS Dynamic Island**, **Android Material You Speed-Dial FAB**, **tactile haptic feedback**, and fluid spring physics animations across all user actions.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | High-performance, concurrent rendering with strict typing |
| **Build Tool & Bundler** | Vite 8 + `@vitejs/plugin-react` | Instant HMR and optimized production bundles |
| **Styling & Design System** | Tailwind CSS v4 (`@import "tailwindcss";`) | Modern CSS token engine with glassmorphic dark mode styling |
| **Animations & Motion** | Framer Motion + Motion One | Physics-based spring animations, tab morphing, and heart bursts |
| **Server & Middleware** | Express 4 + TSX | Unified full-stack server running Vite middlewares in dev mode |
| **Artificial Intelligence** | `@google/genai` (Gemini 3.8 Flash & Flash Lite TTS) | Vision-based fridge audits, dynamic recipe synthesis, and text-to-speech |
| **Sound & Haptics** | Web Audio API + Web Speech API + Web Vibration API | Synthesizer kitchen chimes, speech synthesis, and mobile tactile pulses |
| **Data Visualizations** | Recharts + D3 / SVG Radar Charts | Multi-axis nutritional charts and waste reduction trends |

---

## ⭐ Flagship AI & Culinary Innovations

### 1. 🧠 FridgeChef Memory Engine
- **Persistent Personal Culinary Model**: Rather than a generic stateless assistant, the AI maintains a persistent memory profile for the entire household.
- **Multi-Member Preferences**: Tracks profiles for individual family members (e.g. *Chef, Priya, Arjun*), detailing:
  - Disliked ingredients per member (e.g., *"Arjun dislikes mushrooms; strictly exclude raw cilantro for Priya"*)
  - Spice tolerances on a 1–5 scale (*Mild, Gentle, Medium, Hot, Explosive*)
  - Medical allergens and intolerances (Peanuts, lactose sensitivities)
  - Preferred appliances (*Air Fryer, Induction Wok, Instant Pot, Claypot*)
  - Household budget tier (*Value, Balanced, Gourmet*) and cooking skill level
- **Contextual Proactive Observations**: Emits real-time conversational culinary advice such as:
  > *"You usually prefer spicy South Indian breakfasts and you haven't used the spinach you bought 4 days ago."*

### 2. 📸 Receipt → Pantry AI
- **Automated Grocery Bill Extraction**: Snap or upload any supermarket paper receipt (or select instant presets from DMart, Whole Foods, Reliance Fresh).
- **Gemini OCR Parsing**: Automatically parses line items, unit quantities (*500 g, 1 L, 12 pcs, 5 kg*), estimated gram weights, and unit pricing.
- **Pantry Health Metrics**:
  - Calculates grocery total spend (*₹1,842 / $48.50*), total food mass (*6.2 kg*), and **Pantry Utilization Index (91%)**.
  - Automatically predicts storage locations and sets expiration alarms (*Chicken: 3 days, Spinach: 4 days, Milk: 6 days, Rice: 365 days*).
- **1-Click Sync & Cook**: Transports all parsed groceries directly into the live fridge inventory and generates instant zero-waste meal suggestions.

### 3. 🧊 Fridge Digital Twin
- **Interactive 2.5D Refrigerator Representation**: A physical digital twin model of your home refrigerator with realistic LED ceiling lighting, glass dividers, and live telemetry (*Fridge: 37.2°F, Freezer: -0.4°F*).
- **Microclimate Zones**:
  - **Top Shelf (38°F)**: Dairy, eggs, cheeses, and baked goods.
  - **Middle Shelf (36°F)**: Cooked proteins, tofu, and prepared meals.
  - **Crisper Drawer (85% RH)**: Fresh produce, tomatoes, bell peppers, and humidity-sensitive greens.
  - **Deep Freezer (-18°C / 0°F)**: Sub-zero frozen proteins, edamame, and frozen vegetables.
- **Telemetry Inspection Drawer**: Click any item on any shelf to inspect its quantity, color-coded freshness score, days until expiration, and 1-click **"Find Recipes with This"** shortcut.

### 4. 🤖 Autonomous Meal Decision Engine
- **"What Should I Cook Right Now?"**: Eliminates choice fatigue. Instead of asking the user to browse hundreds of recipes, an autonomous decision engine selects the single optimal dinner to prepare.
- **Multi-Variable Weighted Algorithm**:
  1. **Expiring Ingredients Urgency (35%)**: Prioritizes ingredients nearing expiration to prevent waste.
  2. **Household Memory & Spice Calibration (25%)**: Satisfies personal taste while strictly excluding member dislikes.
  3. **Time Budget (15%)**: Calibrated to evening energy levels and current meal hours.
  4. **Nutritional Targets (15%)**: Ensures high protein (30g+) and balanced macros.
  5. **Kitchen Weather & Temperature Comfort (10%)**: Warms with aromatics during cool evenings (21°C) or refreshes during heatwaves.
- **Definitive Output**: Generates an authoritative meal recommendation card (*Spiced Chicken & Wilted Spinach Rice Skillet | 24 min | ₹68 est. cost | 31g protein | 180g waste prevented*) with an instant 1-click launch into Hands-Free Voice Cooking mode.

### 5. 🧬 Ingredient Substitution Intelligence
- **Culinary Chemistry Graph**: Rather than simply notifying that an ingredient is unavailable, the AI dynamically queries molecular culinary pairings.
- **Comprehensive Substitution Matrix**:
  - Analyzes target ingredient role (*Aged umami depth, crystalline texture, salinity & fat binding*).
  - Evaluates alternative substitutes (*Nutritional Yeast, Grana Padano, Aged Cheddar, Cashew + Nutritional Yeast*).
  - Displays **Flavor Similarity %** (e.g. 87%) and **Texture Similarity %** (e.g. 74%).
  - Checks live fridge inventory and flags **"IN YOUR FRIDGE ✅"** when an alternative is already owned!
  - Provides exact conversion ratios and chef technique adjustments (e.g., *"1:1 ratio, but reduce added salt by 15%"*).

### 6. 🧪 Recipe Evolution Engine
- **“Make this recipe better”**: Seamless mutation engine allowing users to evolve any recipe into 6 specialized evolutionary branches:
  - **Higher Protein**: Re-engineers the dish to deliver 40–50g+ lean protein by swapping white grains for edamame/lentils and folding in whipped Greek yogurt garlic crema.
  - **Lower Calorie**: Volume eating re-engineering (-35% kcal) utilizing riced cauliflower, shredded charred cabbage, and air-fry searing.
  - **More Spicy**: Multi-dimensional heat bloomed in hot oil with Sichuan peppercorns, bird’s eye chiles, and scallion chili crisp.
  - **Restaurant Style**: Michelin elevation featuring French *arroser* butter-basting, shallot pan fond deglazing, and golden ratio layering.
  - **Budget Version**: Cuts cost by 58% utilizing brown lentils, chickpeas, and hearty root staples without sacrificing rich savory umami.
  - **15-Minute Flash**: One-skillet high-heat technique using paper-thin sliced ingredients and pre-mixed 30-second slurries.
- **Side-by-Side Comparison**: Live diff inspection showing macro shifts, modification lists, secret ingredients, and chef notes with 1-click **"Cook This Version"** launch.

### 7. 👨🍳 Chef Persona Engine
- **10 Iconic Culinary Master Styles**: Rather than generic generation, users can channel distinctive master chefs to radically morph the same ingredients:
  - 🇮🇳 **Indian Master Chef**: Aromatic tadka blooming, mustard seeds, curry leaves, and layered claypot braises.
  - 🇯🇵 **Japanese Washoku Shokunin**: Subtle dashi broths, mirin-soy umami precision, and delicate sashimi-grade cuts.
  - 🇮🇹 **Italian Nonna & Trattoria**: Blistered high-heat San Marzano tomatoes, silky olive oil emulsions, and al dente discipline.
  - 🇫🇷 **French Haute Cuisine**: Foaming butter basting (*arroser*), velouté reductions, and classical brigade refinement.
  - 🇰🇷 **Korean Hansik Master**: Aged kimchi fermentation, gochujang heat, toasted sesame oil, and sizzling scorched pans.
  - 🇲🇽 **Mexican Abuela & Taqueria**: Charred fire-roasted chiles on the comal, fresh lime acid punch, and toasted cumin.
  - 🧪 **Modernist Gastronomist**: Molecular agar spherification pearls, savory light espumas, and precision thermal cooking.
  - 💪 **Macro & Performance Coach**: Maximum lean protein per calorie, clean carb timing, and zero industrial seed oils.
  - 💰 **Frugal Pantry Wizard**: Root-to-stem zero-waste usage, grain stretching, and fond-enriched pan gravies.
  - 🏠 **Homestyle Comfort Kitchen**: Nostalgic warming one-pot stews with zero fuss and quick single-pan cleanup.

### 8. 🎯 “Cook With What You Have” Challenge
- **Gamified Pantry Arena**: Converts random fridge remnants into a scored culinary competition.
- **Select or Mystery Roll**: Pick 3–5 items from your fridge or roll the randomized dice.
- **5-Dimensional AI Jury Score**:
  - **Ingredient Utilization** (e.g., 94%)
  - **Creativity Score** (e.g., 87%)
  - **Nutrition Score** (e.g., 82%)
  - **Waste Reduction** (e.g., 96%)
  - **Difficulty Score** (e.g., 61%)
- **Progression & Streaks**: Earns XP (+380 XP), tracks consecutive cooking streaks (*5-Day Streak 🔥*), and unlocks badges (*"Zero-Waste Prodigy"*, *"Scrappy Gourmet"*, *"Pantry Alchemist"*).

### 9. 🧠 “Why This Recipe?” AI Explainability
- **Zero Black Box Transparency**: Replaces mysterious AI recommendations with explicit algorithmic point-by-point explainability:
  - `+31` Chicken and fresh baby spinach expire in 48 hours (Urgency)
  - `+24` Delivers 42g protein, matching your lean protein target
  - `+18` 100% in-stock utilization of existing pantry items
  - `+15` Aligns with your household South Indian / Mediterranean preference
  - `+8` Low energy footprint (one-skillet induction hob, 0.35 kWh)
  - `−5` Requires 1 minor staple that can be easily substituted
  - **Final Explainability Score**: `91/100` Selection Confidence.

### 10. 💰 Grocery Price Intelligence & Budget Mode
- **Macro-Cost Arbitrage**: Connects every recipe to ingredient pricing and macronutrient value.
- **Key Financial Metrics**:
  - Estimated recipe cost (e.g., *₹142 / $3.60*)
  - Total protein (e.g., *42 g*) and caloric density (*618 kcal*)
  - **Cost per 10g Protein** (e.g., *₹33.8 / 10g protein* / *$0.85*) — essential for fitness and budget-conscious cooks.
- **“Feed 4 People Under ₹500” Budget Mode**:
  - Set your party size and target budget (in ₹, $, or €).
  - AI engineers an entire meal plan strictly under the budget limit, complete with an itemized grocery breakdown showing *Pantry (Free)* items vs *To Buy* items, with 1-click export to your smart shopping list.

### 11. 📊 Personal Nutrition Dashboard
- **Beyond the Radar Chart**: Full metabolic profile tracking:
  - Calories, Protein, Carbohydrates, Fat, Dietary Fiber, Sodium, Sugar, and Micronutrients (Iron, Potassium, Vitamin C, Calcium).
  - 7-day rolling history and Meal Diversity Score (*19 unique plant & protein sources this week*).
- **Proactive AI Diagnosis**:
  > *"Your week is protein-heavy but fiber-light (14g avg vs 30g daily baseline)."*
- **Corrective Meal Suggestions**: Recommends balancing recipes (e.g., *Spiced Green Lentil & Sautéed Kale Bowl [+16g Fiber]*) with 1-click recipe filtering.

### 12. 🌍 Food Waste Carbon Calculator
- **Planetary Ecological Impact**:
  - **Food Rescued**: `3.8 kg` this month
  - **Estimated Money Saved**: `₹1,240` ($16.20) in un-wasted groceries
  - **Landfill Waste Avoided**: `4.6 kg`
  - **CO₂ Methane Avoided**: `8.2 kg`
  - **Virtual Water Saved**: `2,900 L` of embedded agricultural water
- **🌱 Household Sustainability Score (84/100)**: Transparent breakdown across Waste Diversion (91%), Resource Efficiency (88%), Local Seasonality (85%), and Packaging Avoidance (72%).

### 13. 🌡️ Smart Fridge Sensor Integration (IoT + AI)
- **Connected Hardware Sensor Hub**:
  - Temperature (*3.8°C / 38.8°F* with normal range boundary checks)
  - Humidity (*84% RH* crisper climate)
  - Door status sensor (*Closed vs Ajar*, open events counter: *4 today*, open duration: *14s*)
  - Shelf load cell weight sensors (*Milk bottle: 320g remaining of 1L*)
  - Gas/VOC odor sensors (*12 ppm pure air*) & Ethylene gas ripening levels
- **Interactive Anomaly Engine**:
  > *"⚠️ Temperature anomaly: Fridge temperature increased from 3.8°C → 8.1°C for 27 minutes. Refrigerator door left unlatched."*
  - Synchronized with the **iOS Dynamic Island** pill and Android speed dial with one-tap diagnostics.

### 14. ⚖️ Food Safety Intelligence
- **Deterministic HACCP & Hygiene Engine**:
  - Per-ingredient safe handling window (*Safe / Cook Today / Caution / Discard*) with opened-date tracking.
  - Safe internal cooking target temperatures (*Poultry: 74°C / 165°F, Ground meats: 71°C / 160°F, Fish: 63°C / 145°F*).
  - Cross-contamination warnings (e.g., *Raw poultry juices harbor Salmonella; store only on lowest shelf below ready-to-eat greens*).
  - Physical raw/cooked separation rules and medical allergen cross-contact notices.

### 15. 🧑🤝🧑 Multi-Person Household Profiles
- **Multi-Member Dietary Conflict Resolution**:
  - Tracks individual family member profiles (e.g., *Varun: High Protein + Spicy + No Mushrooms; Mom: Vegetarian + Mild; Dad: Low Sodium; Arjun: Kid-friendly*).
- **“Dinner for Everyone” Synthesizer**:
  - Harmony Score (*94/100*).
  - Chooses ONE single harmonious base recipe (*Fragrant Turmeric Rice & Roasted Mediterranean Veg Base*).
  - Generates modular parallel modifications for each member (e.g., sear chili chicken skewers for Varun, fold golden paneer for Mom, separate unsalted lemon-herb portion for Dad) without cooking separate meals.

### 16. 🗣️ Natural Conversational Kitchen Agent
- **Two-Way Voice Culinary Dialogue**:
  - Natural kitchen conversation loop:
    - User: *"Hey FridgeChef, what can I make?"*
    - AI: *"You’ve got chicken, baby spinach, and rice. I can make a 22-minute high-protein garlic chicken bowl."*
    - User: *"Make it spicier."*
    - AI: *"Done! Increasing crushed bird’s eye chili, garlic, and cracked pepper while keeping sodium stable."*
    - User: *"Start cooking."*
    - AI: *"Starting your step-by-step hands-free cooking session now!"*
  - Integrated speech recognition (`webkitSpeechRecognition`), browser TTS voice synthesis, live recipe draft updates, and seamless handoff into full-screen hands-free cooking.

### 17. 🧠 Recipe Knowledge Graph
- **Interactive Culinary Chemistry Ontology**:
  - Maps structured relationships: `Ingredient` → `Flavor Compounds` → `Cooking Techniques` → `Cuisines` → `Recipes` → `Substitutions`.
  - Example: *Tomato* ├── acidity ├── glutamate ├── umami ├── roasting ├── Mediterranean └── Tamarind/Sumac substitutes.
  - Interactive visual node graph allows cooks to explore molecular flavor affinity before cooking.

### 18. 🔬 AI Recipe Scientific Validation
- **Tri-Tier Automated Recipe Auditor**:
  - **Culinary Validator**: Flavor compound compatibility (96%), cooking temperature bounds (190°C skillet), timing feasibility (94%), texture score (92%).
  - **Nutrition Validator**: Caloric variance (<3%), macro alignment, portion scale precision.
  - **Safety Validator**: HACCP raw poultry/seafood thermal threshold (74°C), cross-contamination prevention, holding temp safety.
- **Recipe Confidence Score (94%)**: Displays an official sensory integrity badge on every recipe card with drill-down audit logs.

### 19. 🧑🍳 Cooking Skill Adaptation
- **Dynamic Skill Adaptation**: Selector for 🟢 **Beginner**, 🟡 **Intermediate**, and 🔴 **Advanced**.
- **Instruction Morphing**:
  - *Beginner*: “Heat the pan on medium for about 60 seconds until warm when hovering your hand 2 inches above.”
  - *Intermediate*: “Heat the skillet until oil shimmers and coats the pan in a thin veil.”
  - *Advanced*: “Preheat heavy cast iron until lightly smoking (wisps at 425°F); sear in clarified fat to develop a deeply caramelized Maillard crust.”

### 20. 📷 Plate Photo → Food & Plating Analysis
- **Post-Cooking Vision Evaluation**: Snap or upload a photo of your finished plate.
- **AI Plate Scorecard**:
  - 🍽️ Presentation: `82 / 100`
  - 🥦 Nutritional Balance: `91 / 100`
  - 🌈 Color Diversity: `88 / 100`
  - 📐 Plating Geometry: `79 / 100`
- **Actionable Master Chef Feedback**:
  > *"Add a small acidic garnish (pickled shallots or micro-cilantro) and move the protein slightly off-center using the rule-of-thirds."*

### 21. 🧠 Taste Preference Learning Model
- **Reinforcement Learning Feedback**: Rate meals (1-5 stars) + interactive taste tags (*"Loved the garlic"*, *"Too salty"*, *"Perfect crisp"*).
- **Personal Taste Vector**:
  - *Favored Flavors*: Roasted Garlic (98%), Peppercorn Heat (94%), Citrus Brightness (91%).
  - *Favored Textures*: Crispy Seared Fond (96%), Al Dente Crunch (89%).
  - *Penalized Elements*: Raw Cilantro Stems (-88%), Cloying Sweet Glazes (-84%).
- Continuously adapts all future recipe generation weights.

### 22. 🕐 Context-Aware Cooking & Moods
- **Time Budgets**: `5 min` (Flash microwave) | `15 min` (Wok blast) | `30 min` (Standard) | `60+ min` (Slow braise).
- **Contextual Mood Modes**:
  - 🏃 *"I'm Starving"* → Fast meal mode (zero prep, high protein/calorie velocity).
  - 🍷 *"I Want to Cook Something Impressive"* → Gourmet mode (Michelin techniques).
  - 🥂 *"I Have Guests Coming"* → Hosting mode (low active attention during party).

### 23. 🎉 Event & Guest Mode (AI Catering Planner)
- **Hospitality Logistics Engine**:
  - Inputs: Guests (8), Budget (₹2,500), Cuisine (Indian Royal), Dietary Split (3 Veg, 5 Non-Veg), Prep Time (2 Hours).
  - Outputs: Multi-course scaled menu, itemized procurement shopping checklist, T-minus prep timeline, and serving schedule.

### 24. 🧾 Pantry Financial Intelligence
- **"Where is my grocery money going?"**:
  - Monthly spending distribution: Protein (₹2,840 / 37%), Produce (₹1,920 / 25%), Dairy (₹1,140 / 15%), Snacks (₹980 / 13%), Grains (₹760 / 10%).
- **Spoilage Loss Audit**:
  > *"⚠️ ₹620/month lost to expired produce and unused dairy."*
- Identifies repeat offender items (e.g. Fresh Cilantro wasted 3x) and provides specific zero-waste preservation hacks.

### 25. 🤖 Autonomous Culinary Operating System Agent
- **The Capstone Headline Feature**:
  - High-level prompt: *"Plan my meals for this week while minimizing food waste and keeping groceries below ₹2,500."*
- **12-Stage Autonomous Loop**:
  1. Pantry Audit → 2. Expiry Inspection → 3. Taste Preference Analysis → 4. 7-Day Cyclical Meal Planning → 5. Ingredient Cross-Reuse Optimization → 6. Nutritional Equilibrium Verification → 7. Cost Arbitrage Enforcement → 8. Consolidated Shopping List Generation → 9. Cooking Order Scheduling → 10. Voice Guidance Mapping → 11. Leftover Repurposing → 12. Continuous Feedback Learning.
- **Results**: `92%` Pantry Utilization, `₹1,180` Projected Savings, `4.8 kg` Waste Reduction, `₹2,140` Total Weekly Spend.

---

## 🚀 Complete Feature Inventory

### 1. AI Vision & Fridge Scanner
- **Multi-Modal Image Analysis**: Upload or capture an image of any refrigerator or pantry. Google Gemini (`gemini-3.8-flash`) inspects visible items, predicts ingredient categories, measures confidence scores, and determines freshness stages.
- **Structured Shelf Inventory**: Categorizes items into *Produce, Dairy & Eggs, Meat & Seafood, Pantry, Condiments, Fermented, Bakery, Grains & Pulses*.
- **Interactive Stash Editor**: Add items manually, modify quantities, update freshness levels, or delete consumed goods.
- **Curated Preset Fridges**: Test out preset inventories with pre-loaded ingredient sets:
  - *Fresh Harvest & Dairy Stash*
  - *High-Protein & Green Power*
  - *Asian Umami & Fermented Pantry*

### 2. Native iOS & Android Experience
- **Floating iOS Dynamic Island (`IOSDynamicIsland`)**:
  - Top-mounted pill that updates with live fridge states (*"37.2°F / 88% Humidity"*, *"140ms On-Device Vision"*, *"X Items Monitored"*).
  - Tap-to-expand modal powered by spring physics (`stiffness: 400, damping: 30`) with haptic vibration confirmation.
- **Android Material You Speed-Dial FAB (`AndroidMaterialYouFAB`)**:
  - Bottom-right Material 3 floating action button with rotating animations and speed-dial actions (*Camera Scan, Iron Chef Challenge, Pantry Emergency*).
- **Tactile Haptic Feedback**:
  - `navigator.vibrate()` integrated into button clicks, tab navigation, recipe favoriting, and voice command triggers.
- **Native Viewport Optimization**:
  - Built with `viewport-fit=cover`, `apple-mobile-web-app-capable`, `mobile-web-app-capable`, and dark ambient system status bars.

### 3. Recipe Engine & Zero-Waste Arbitrage
- **Zero-Waste Match Algorithm**: Displays real-time matching percentages (e.g., *92% Match*) and highlights matched vs missing ingredients.
- **Advanced Multi-Facet Filtering**: Filter by meal type, prep time duration, difficulty level, cuisine style (*Mediterranean, Asian, Mexican, French, etc.*), and cooking appliance (*Air Fryer, Sous Vide, Instant Pot, Claypot, Wok, Oven*).
- **Dietary Restriction Guardrails**: Automatic tags for *Vegetarian, Vegan, Gluten-Free, Keto, Low-Carb, Dairy-Free, and High-Protein*.
- **Hexagonal Nutritional Radar Chart (`D3RadarChart`)**: Visualizes macronutrient and micronutrient balance across 6 axes: *Protein, Fats, Carbs, Fiber, Vitamins, and Minerals*.
- **Satisfying Heart 'Pop' Favorite Animation**: Physics-based spring oscillation (`scale: [0.5, 1.4, 0.9, 1.15, 1]`) with rose glow particle bursts.
- **Modular Sub-Recipe Breakdown (`SubRecipeModal`)**: Separates recipes into independently timed sub-components (marinades, dressings, stocks, proteins).
- **Batch Cooking & Tupperware Scaler (`MealPrepBatchModal`)**: Instantly re-calculates portions (1x, 2x, 4x, 8x), container requirements, and freezer burn shelf-life limits.

### 4. Hands-Free Voice Cooking & Step-by-Step Guidance
- **Full-Screen Interactive Cooking Modal (`StepByStepCookingModal`)**:
  - Designed for messy kitchen hands with large touch targets and high-contrast typography.
- **Voice Read-Aloud (TTS)**:
  - Powered by Gemini Flash Lite TTS with fallback to natural browser SpeechSynthesis voices.
- **iOS Siri-Style Voice Waveform Pulse (`VoiceInteractionHapticPulse`)**:
  - Animated glowing waveform bars and pulsing ambient rings indicate active voice narration.
- **Multi-Timer Command Center**:
  - Run step-specific timers alongside persistent kitchen multi-timers (*Boil Water, Oven Roast, Sear*).
  - Synthesized Web Audio API harmonic chimes trigger upon timer completion.

### 5. Pantry Health & Expiration Management
- **Pantry Health Notification System (`PantryHealthNotificationBanner`)**:
  - Scans fridge database for items flagged as `Use Soon` (expiring within 48-72 hours).
  - Web Notification API integration (`Notification.requestPermission()`) for system desktop/mobile push alerts.
  - Quick-action **"Cook Recipes Now"** routing.
- **Interactive Spoilage Simulator (`ExpirationSimulatorWidget`)**:
  - 1-to-30 day interactive decay timeline slider.
  - Micro-climate climate simulation across *Crisper Drawer*, *Main Shelf*, *Door Rack*, and *Deep Freeze (-18°C)*.
- **Pantry Emergency Mode (`PantryEmergencyMode`)**:
  - 1-click rescue mode prioritizing zero-waste recipes using ingredients closest to spoiling.
- **Smart Tupperware & Leftover Tracker (`TupperwareTrackerWidget`)**:
  - Logs leftover container locations, freeze dates, and defrost recommendations.
- **Household Chore Leaderboard (`HouseholdChoreLeaderboardWidget`)**:
  - Gamified points system awarding household members +25 pts for completing fridge audits, batch preps, and pantry cleanouts.

### 6. 7-Day Meal Planner & Sommelier Pairings
- **Zero-Waste 7-Day AI Meal Planner (`WeeklyMealPlannerWidget`)**:
  - Full Monday–Sunday schedule detailing Breakfast, Lunch, Dinner, and Snacks.
  - Tracks daily target calories and zero-waste efficiency ratings.
  - **1-Click Export**: Transports all missing recipe ingredients directly into your shopping checklist.
- **Gourmet Beverage & Sommelier Pairing (`GourmetSommelierWidget`)**:
  - Sommelier-curated pairings for fine wines, craft beers, and artisanal zero-proof mocktails.
  - Includes optimal serving temperatures, decanting notes, and recommended glassware (*Bordeaux Glass, Pilsner Flute, Highball*).

### 7. Advanced Culinary & Sensory Science Labs
- **Molecular & Physics Lab (`MolecularLabTab`)**:
  - Emulsion stability indexes, Maillard reaction browning temperature predictors, smoke point monitors, and acidity/pH pairing logic.
- **Acoustic Sensory Lab (`AcousticSensoryLab`)**:
  - Sound profile analysis measuring crunch frequencies, deep-fry sizzle dynamics, and boiling resonance.
- **Neuro-Gastronomy Mood Engine (`NeuroGastronomyModal`)**:
  - Formulates recipes tailored to stimulate neurotransmitters (*Dopamine, Serotonin, Melatonin, Endorphins*).
- **AR Plating Guide Modal (`ARPlatingGuideModal`)**:
  - Interactive visual plating guides incorporating the Golden Ratio, sauce swiping arcs, and micro-green garnish blueprints.
- **Iron Chef Mystery Ingredient Challenge (`IronChefGameModal`)**:
  - Gamified cooking game generating surprise ingredient combinations under strict countdown clocks.
- **Kitchen Soundscape Player (`KitchenSoundscapePlayer`)**:
  - Curated ambient audio environments (*Café De Paris, Kyoto Tea Garden, Tuscan Villa, Crackling Fireplace*).
- **Energy Appliance Router (`EnergyApplianceRouter`)**:
  - Smart energy calculation routing cooking steps to the most energy-efficient appliance (*Air Fryer vs Induction vs Convection Oven*).

### 8. Smart Shopping List & Household Sync
- **Interactive Checklist**: Grouped by supermarket aisles with instant check-off toggles and strike-through states.
- **1-Click Missing Ingredient Sync**: Recipe cards automatically push only unowned ingredients to the shopping list.
- **Family Pantry Sync Widget (`FamilyPantrySyncWidget`)**:
  - QR Code generator and multi-device cloud synchronization mock-ups for housemates and family members.
- **Ecology & Waste Arbitrage Tracker (`EcologyArbitrageWidget`)**:
  - Real-time meters for carbon emissions offset ($CO_2$), food mass diverted from landfills ($kg$), and grocery savings ($USD$).

---

## 📂 Project Structure

```text
├── index.html                           # HTML5 entry point with iOS/Android viewport meta
├── metadata.json                        # Applet metadata, capabilities & description
├── package.json                         # Scripts & dependency definitions
├── server.ts                            # Express full-stack entry point + Gemini AI endpoints
├── vite.config.ts                       # Vite configuration with React & Tailwind plugins
├── src/
│   ├── main.tsx                         # React 19 bootstrap mount
│   ├── App.tsx                          # Core application shell, state management & tab router
│   ├── index.css                        # Tailwind v4 import & custom font declarations
│   ├── types.ts                         # Complete TypeScript domain interfaces & types
│   ├── assets/                          # Images, fridge presets & icon assets
│   ├── data/
│   │   └── sampleData.ts                # Curated preset fridges, starter recipes & shopping items
│   ├── utils/
│   │   └── speechUtils.ts               # SpeechEngine (Web Speech API + Haptic Vibration sync)
│   └── components/
│       ├── Navbar.tsx                   # Sticky glassmorphic navigation header
│       ├── IOSDynamicIsland.tsx         # Floating iOS Dynamic Island with spring physics
│       ├── AndroidMaterialYouFAB.tsx    # Material 3 speed-dial floating action button
│       ├── VoiceInteractionHapticPulse.tsx # Siri-style visual pulsing audio waveforms
│       ├── PantryHealthNotificationBanner.tsx # Expiration alert banner with Push Notification API
│       ├── FridgeScanner.tsx            # Camera upload, preset picker & ingredient manager
│       ├── RecipeCard.tsx               # Recipe display card with heart pop animation & radar chart
│       ├── StepByStepCookingModal.tsx   # Hands-free step-by-step cooking modal with voice & timers
│       ├── WeeklyMealPlannerWidget.tsx  # 7-day zero-waste AI meal schedule with shopping export
│       ├── GourmetSommelierWidget.tsx   # Sommelier wine, craft beer & mocktail pairings
│       ├── ExpirationSimulatorWidget.tsx# Interactive shelf-life decay & micro-climate simulator
│       ├── HouseholdChoreLeaderboardWidget.tsx # Gamified chore assignment & crew rewards
│       ├── TupperwareTrackerWidget.tsx  # Leftover containers, freezing & defrosting tracker
│       ├── FamilyPantrySyncWidget.tsx   # Multi-device synchronization & QR share
│       ├── EcologyArbitrageWidget.tsx   # Financial savings & ecological impact metrics
│       ├── PantryEmergencyMode.tsx      # Rapid 15-minute recipe rescue for expiring ingredients
│       ├── EnergyApplianceRouter.tsx    # Appliance wattage & eco-friendly energy routing
│       ├── KitchenSoundscapePlayer.tsx  # Ambient culinary sound generator
│       ├── MolecularLabTab.tsx          # Culinary physics, emulsions & Maillard chemistry
│       ├── AcousticSensoryLab.tsx       # Food crunch & frying sound resonance analyzer
│       ├── NeuroGastronomyModal.tsx     # Mood-based neurotransmitter recipe tuner
│       ├── ARPlatingGuideModal.tsx      # Golden ratio & Michelin plating blueprints
│       ├── IronChefGameModal.tsx        # Mystery ingredient culinary countdown game
│       ├── D3RadarChart.tsx             # 6-axis SVG nutrition radar polygon
│       ├── SubRecipeModal.tsx           # Multi-component recipe preparation breakdown
│       ├── MealPrepBatchModal.tsx       # Serving scaler & Tupperware capacity calculator
│       ├── SidebarFilter.tsx            # Dietary, cuisine, appliance & prep time filters
│       └── ShoppingListTab.tsx          # Categorized grocery checklist with pantry sync
```

---

## 🔌 Backend API Endpoints

The backend server is implemented in `server.ts` utilizing `@google/genai`:

### `POST /api/analyze-fridge`
- **Description**: Accepts a base64 encoded image of a fridge interior. Uses `gemini-3.8-flash` to return detected ingredients (with categories, freshness, and quantities) alongside 3 custom suggested recipes.
- **Request Body**:
  ```json
  {
    "imageBase64": "data:image/jpeg;base64,...",
    "mimeType": "image/jpeg",
    "extraPrompt": "Optional user notes (e.g. 'I want spicy meals')"
  }
  ```

### `POST /api/generate-recipes`
- **Description**: Generates 4 customized recipes based on a custom list of ingredients, dietary restrictions, maximum prep time, and preferred cuisine.
- **Request Body**:
  ```json
  {
    "ingredients": ["Eggs", "Spinach", "Cheddar Cheese"],
    "dietary": ["Keto", "Gluten-Free"],
    "maxPrepTime": 30,
    "difficulty": "Easy",
    "cuisine": "Mediterranean"
  }
  ```

### `POST /api/tts`
- **Description**: Generates warm, crystal-clear culinary assistant audio narration using `gemini-3.8-flash-lite-tts`.
- **Request Body**:
  ```json
  {
    "text": "Step 1: Heat the olive oil in a skillet over medium heat.",
    "voiceName": "Kore"
  }
  ```

---

## 💻 Getting Started & Local Development

### Prerequisites
- Node.js 18+ installed
- A valid Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/fridgechef-ai.git
   cd fridgechef-ai
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API Key for vision analysis, recipe synthesis, and TTS. |
| `PORT` | No | Server port (defaults to `3000`). |
| `NODE_ENV` | No | Set to `production` when deploying production builds. |

---

## 📦 Build & Deployment

### Production Build
To create an optimized production build:
```bash
npm run build
```
This builds the client assets via Vite into `dist/` and runs TypeScript verification (`tsc --noEmit`).

### Production Startup
To start the production server:
```bash
npm start
```
The server will automatically serve the static files from `dist/` while exposing all `/api/*` endpoints.

### Code Quality Verification
Verify TypeScript types:
```bash
npm run lint
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
