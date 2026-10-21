/**
 * Calls the person's own AI provider straight from the device. Used by the Android app when no
 * FridgeChef server is reachable, by the "Test connection" button, and for custom
 * OpenAI-compatible endpoints (Ollama, LM Studio) that the server never contacts.
 */
import { activeProvider, getAiSettings } from './settings';

export interface DirectRequest {
  prompt: string;
  json?: boolean;
  image?: { base64: string; mimeType: string };
  maxTokens?: number;
}

const TIMEOUT_MS = 60_000;

const withTimeout = async (url: string, init: RequestInit) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      let detail = body.slice(0, 200);
      try {
        const parsed = JSON.parse(body);
        detail = parsed?.error?.message || parsed?.message || detail;
      } catch {}
      throw new Error(`${res.status}: ${detail || res.statusText}`);
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
};

const JSON_INSTRUCTION = 'Reply with one valid JSON object only. No prose, no code fences.';

export const directComplete = async ({ prompt, json, image, maxTokens = 4096 }: DirectRequest): Promise<string> => {
  const p = activeProvider(getAiSettings());
  if (!p) throw new Error('Add an API key in Settings first');
  if (image && !p.def.vision) throw new Error(`${p.def.label} cannot read photos; pick a vision-capable provider`);

  if (p.def.kind === 'gemini') {
    const parts: any[] = [];
    if (image) parts.push({ inlineData: { data: image.base64, mimeType: image.mimeType } });
    parts.push({ text: prompt });
    const data = await withTimeout(`${p.baseUrl}/v1beta/models/${encodeURIComponent(p.model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': p.apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { maxOutputTokens: maxTokens, ...(json ? { responseMimeType: 'application/json' } : {}) },
      }),
    });
    return (data?.candidates?.[0]?.content?.parts || []).map((x: any) => x.text || '').join('');
  }

  if (p.def.kind === 'anthropic') {
    const content: any[] = [];
    if (image) content.push({ type: 'image', source: { type: 'base64', media_type: image.mimeType, data: image.base64 } });
    content.push({ type: 'text', text: prompt });
    const data = await withTimeout(`${p.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': p.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: p.model,
        max_tokens: maxTokens,
        ...(json ? { system: JSON_INSTRUCTION } : {}),
        messages: [{ role: 'user', content }],
      }),
    });
    return (data?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  }

  // OpenAI-compatible
  const userContent = image
    ? [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.base64}` } }]
    : prompt;
  const data = await withTimeout(`${p.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(p.apiKey ? { Authorization: `Bearer ${p.apiKey}` } : {}) },
    body: JSON.stringify({
      model: p.model,
      messages: [...(json ? [{ role: 'system', content: JSON_INSTRUCTION }] : []), { role: 'user', content: userContent }],
      ...(json && p.def.id !== 'custom' ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  return String(data?.choices?.[0]?.message?.content ?? '');
};

/** Strip code fences or stray prose around a JSON answer and parse it. */
export const parseJsonReply = <T = any>(raw: string): T => {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.search(/[[{]/);
    const end = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
    return JSON.parse(trimmed.slice(start, end + 1));
  }
};

const RECIPE_SHAPE = `Each recipe: { "title", "description", "prepTimeMinutes", "cookTimeMinutes", "calories", "difficulty" ("Easy"|"Medium"|"Hard"), "dietaryTags" (string[]), "cuisine", "matchedIngredients" (string[] from the available list), "missingIngredients" (1-3 strings), "macros" { "protein", "carbs", "fat" } as "25g" strings, "servings", "chefTip", "steps": [{ "stepNumber", "instruction", "timerSeconds" (optional number) }] }`;

export const directGenerateRecipes = async (body: {
  ingredients: string[];
  dietary?: string[];
  maxPrepTime?: number;
  difficulty?: string;
  cuisine?: string;
  avoidTitles?: string[];
}) => {
  const prompt = `You are a professional chef. Suggest 6 varied, realistic recipes that mainly use these available ingredients: ${body.ingredients.join(', ')}.
Make them genuinely different from each other: different cuisines, cooking methods (curry, stir-fry, roast, salad, soup, grill, bake) and main ingredients.${body.avoidTitles?.length ? `\nDo not suggest these again: ${body.avoidTitles.join('; ')}.` : ''}
Dietary needs: ${body.dietary?.length ? body.dietary.join(', ') : 'none'}. Max total time: ${body.maxPrepTime ? `${body.maxPrepTime} minutes` : 'any'}. Difficulty: ${body.difficulty || 'any'}. Cuisine: ${body.cuisine || 'any, mix cuisines'}.
Return JSON { "recipes": [...] }. ${RECIPE_SHAPE}`;
  return parseJsonReply<{ recipes: any[] }>(await directComplete({ prompt, json: true }));
};

export const directAnalyzeFridge = async (imageBase64: string, mimeType = 'image/jpeg', note?: string) => {
  const prompt = `Identify every food item visible in this fridge photo and suggest 3 recipes that use them.
Return JSON { "detectedIngredients": [{ "name", "category" ("Produce"|"Dairy & Eggs"|"Meat & Seafood"|"Pantry"|"Condiments"|"Spices"|"Beverages"|"Other"), "freshness" ("Fresh"|"Use Soon"|"Frozen"|"Pantry Staple"), "quantity", "confidence" (0.5-1) }], "suggestedRecipes": [...] }. ${RECIPE_SHAPE}${note ? `\nNote from the user: ${note}` : ''}`;
  const base64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  return parseJsonReply<{ detectedIngredients: any[]; suggestedRecipes: any[] }>(await directComplete({ prompt, json: true, image: { base64, mimeType } }));
};
