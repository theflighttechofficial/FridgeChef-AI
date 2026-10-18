/**
 * LLM gateway for every AI route.
 *   1. Gemini gemini-3.5-flash-lite handles everything (text, images, audio).
 *   2. If Gemini fails, text-only requests retry on Groq (GROQ_MODEL). Groq never receives images or audio.
 *   3. If both fail, the route's catch block serves its own offline answer (see server.ts).
 *
 * A visitor can bring their own provider and key (Settings screen in the app). The app sends them
 * as x-fc-* headers; `userProviderScope` holds them for that one request, and the gateway tries
 * that provider first. Keys are never stored, cached or logged. Custom endpoints are refused here
 * (the app calls those directly) so the server never fetches a user-supplied URL.
 *
 * Routes call `llm.models.generateContent(request)` with the normal Gemini request shape.
 * The gateway adds what the raw SDK lacks for a rate-limited key:
 *   - caches identical requests, so repeat questions cost no quota
 *   - caps concurrent calls
 *   - retries 429/503 with backoff (honouring "retry in Ns" hints), then rests the key briefly
 *   - rejects malformed JSON so routes fall back to sample data instead of crashing
 */
import { GoogleGenAI } from '@google/genai';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request, Response, NextFunction } from 'express';
import { HEADER_KEY, HEADER_MODEL, HEADER_PROVIDER, ProviderDef, providerById } from '../src/ai/providers';

const env = (key: string, fallback = '') => process.env[key]?.trim() || fallback;
const envInt = (key: string, fallback: number) => Number.parseInt(env(key), 10) || fallback;

export const GEMINI_MODEL = 'gemini-3.5-flash-lite';

// Read lazily: this module is imported before server.ts runs dotenv.config()
const apiKey = () => env('GEMINI_API_KEY');
const hasKey = () => !!apiKey() && apiKey() !== 'MY_GEMINI_API_KEY';
const TIMEOUT_MS = envInt('GEMINI_TIMEOUT_MS', 60_000);
const MAX_CONCURRENCY = envInt('GEMINI_CONCURRENCY', 2);
const CACHE_TTL_MS = envInt('LLM_CACHE_TTL_MS', 60 * 60 * 1000);
const CACHE_MAX = envInt('LLM_CACHE_MAX', 300);

let client: GoogleGenAI | null = null;
// Groq: OpenAI-compatible chat API, used only as a text fallback
const groqKey = () => env('GROQ_API_KEY');
const GROQ_MODEL = () => env('GROQ_MODEL', 'llama-3.3-70b-versatile');
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
let groqCooldownUntil = 0;

const getClient = () =>
  (client ??= new GoogleGenAI({ apiKey: apiKey(), httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } }));

// ---------- Concurrency + cooldown ----------

let active = 0;
const waiting: (() => void)[] = [];
const withSlot = async <T>(task: () => Promise<T>): Promise<T> => {
  if (active >= MAX_CONCURRENCY) await new Promise<void>((resolve) => waiting.push(resolve));
  active++;
  try {
    return await task();
  } finally {
    active--;
    waiting.shift()?.();
  }
};

// After repeated rate limits, fail fast for a while so users get sample data instead of long waits
let cooldownUntil = 0;

// ---------- Cache ----------

const cache = new Map<string, { at: number; response: any }>();
const cacheKey = (request: any) => createHash('sha256').update(JSON.stringify({ c: request.contents, k: request.config, p: request._provider })).digest('hex');

const cacheGet = (key: string) => {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  cache.delete(key); // refresh LRU position
  cache.set(key, hit);
  return hit.response;
};

const cacheSet = (key: string, response: any) => {
  cache.set(key, { at: Date.now(), response });
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
};

/** Strip code fences / stray prose around a JSON answer. */
const extractJson = (raw: string): string | null => {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  for (const candidate of [trimmed, trimmed.slice(trimmed.search(/[[{]/), Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']')) + 1)]) {
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {}
  }
  return null;
};

// ---------- Groq fallback ----------

/** Text-only view of a Gemini request, or null when it carries images/audio Groq must not get. */
const textOnlyPrompt = (request: any): string | null => {
  if (Array.isArray(request.config?.responseModalities) && request.config.responseModalities.includes('AUDIO')) return null;
  const texts: string[] = [];
  let hasMedia = false;
  const visit = (part: any) => {
    if (typeof part === 'string') texts.push(part);
    else if (part?.inlineData || part?.fileData) hasMedia = true;
    else if (typeof part?.text === 'string') texts.push(part.text);
  };
  const c = request.contents;
  if (typeof c === 'string') texts.push(c);
  else if (Array.isArray(c)) c.forEach((turn: any) => (turn?.parts ? turn.parts.forEach(visit) : visit(turn)));
  else if (c?.parts) c.parts.forEach(visit);
  return hasMedia || !texts.length ? null : texts.join('\n\n');
};

const callGroq = async (prompt: string, wantsJson: boolean) => {
  if (groqCooldownUntil > Date.now()) throw new Error('Groq is cooling down after rate limits');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey()}` },
      body: JSON.stringify({
        model: GROQ_MODEL(),
        temperature: 0.4,
        // JSON mode requires the word "JSON" in the messages; the system line guarantees it
        messages: [
          ...(wantsJson ? [{ role: 'system', content: 'Reply with one valid JSON object only. No prose, no code fences.' }] : []),
          { role: 'user', content: prompt },
        ],
        ...(wantsJson ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('retry-after')) * 1000;
      groqCooldownUntil = Date.now() + (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 30_000);
      throw new Error('Groq rate limited');
    }
    if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data: any = await res.json();
    return String(data?.choices?.[0]?.message?.content ?? '');
  } finally {
    clearTimeout(timer);
  }
};

// ---------- Visitor's own provider ----------

interface UserProvider {
  def: ProviderDef;
  key: string;
  model: string;
  error?: string;
}

const userScope = new AsyncLocalStorage<UserProvider>();

/** Express middleware: run the rest of the request with the visitor's provider, if they sent one. */
export const userProviderScope = (req: Request, _res: Response, next: NextFunction) => {
  const def = providerById(req.get(HEADER_PROVIDER) || undefined);
  const key = (req.get(HEADER_KEY) || '').trim();
  if (!def || def.deviceOnly || !key || key.length > 512) return next();
  const model = (req.get(HEADER_MODEL) || '').trim().slice(0, 128) || def.defaultModel;
  userScope.run({ def, key, model }, next);
};

/** Short reason the visitor's own provider failed during this request, if it did. */
export const userProviderError = () => {
  const user = userScope.getStore();
  return user?.error ? `${user.def.label}: ${user.error}` : null;
};

type Part = { text?: string; inlineData?: { data: string; mimeType: string } };

/** Flatten any Gemini `contents` shape into a single user turn of text and image parts. */
const flattenParts = (contents: any): Part[] => {
  const out: Part[] = [];
  const visit = (x: any) => {
    if (typeof x === 'string') out.push({ text: x });
    else if (Array.isArray(x)) x.forEach(visit);
    else if (x?.parts) x.parts.forEach(visit);
    else if (x?.inlineData) out.push({ inlineData: x.inlineData });
    else if (typeof x?.text === 'string') out.push({ text: x.text });
  };
  visit(contents);
  return out;
};

const JSON_SYSTEM = 'Reply with one valid JSON object only. No prose, no code fences.';

const fetchJson = async (url: string, init: RequestInit) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      let detail = '';
      try {
        const parsed = JSON.parse(body);
        detail = parsed?.error?.message || parsed?.message || '';
      } catch {}
      throw new Error(`${res.status}${detail ? ` ${detail.slice(0, 160)}` : ''}`);
    }
    return (await res.json()) as any;
  } finally {
    clearTimeout(timer);
  }
};

const callUserProvider = async (user: UserProvider, request: any, wantsJson: boolean) => {
  const { def, key, model } = user;
  if (Array.isArray(request.config?.responseModalities) && request.config.responseModalities.includes('AUDIO') && def.kind !== 'gemini') {
    throw new Error('voice output needs Gemini');
  }

  if (def.kind === 'gemini') {
    const response: any = await Promise.race([
      new GoogleGenAI({ apiKey: key }).models.generateContent({ ...request, model }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timed out')), TIMEOUT_MS)),
    ]);
    if (!wantsJson) return response;
    const json = extractJson(response.text ?? '');
    if (!json) throw new Error('returned invalid JSON');
    return { text: json, candidates: response.candidates };
  }

  const parts = flattenParts(request.contents);
  if (parts.some((p) => p.inlineData) && !def.vision) throw new Error(`${model} cannot read images`);
  const schemaHint = wantsJson && request.config?.responseSchema ? `\n\nJSON schema to follow: ${JSON.stringify(request.config.responseSchema)}` : '';
  const system = [request.config?.systemInstruction, wantsJson ? JSON_SYSTEM : ''].filter((x) => typeof x === 'string' && x).join('\n');

  let text: string;
  if (def.kind === 'anthropic') {
    const content = parts.map((p) =>
      p.inlineData
        ? { type: 'image', source: { type: 'base64', media_type: p.inlineData.mimeType, data: p.inlineData.data } }
        : { type: 'text', text: p.text }
    );
    if (schemaHint) content.push({ type: 'text', text: schemaHint });
    const data = await fetchJson(`${def.baseUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: 8192, ...(system ? { system } : {}), messages: [{ role: 'user', content }] }),
    });
    text = (data?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  } else {
    const hasImage = parts.some((p) => p.inlineData);
    const content = hasImage
      ? parts.map((p) =>
          p.inlineData
            ? { type: 'image_url', image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } }
            : { type: 'text', text: p.text }
        )
      : parts.map((p) => p.text).join('\n\n');
    const data = await fetchJson(`${def.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: typeof content === 'string' ? content + schemaHint : schemaHint ? [...content, { type: 'text', text: schemaHint }] : content },
        ],
        ...(wantsJson ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    text = String(data?.choices?.[0]?.message?.content ?? '');
  }

  const finalText = wantsJson ? extractJson(text) : text;
  if (finalText === null) throw new Error('returned invalid JSON');
  return { text: finalText, candidates: [{ content: { parts: [{ text: finalText }] } }] };
};

// ---------- Public API ----------

const stats = { requests: 0, cacheHits: 0, rateLimited: 0, failures: 0, gemini: 0, groq: 0, userProvider: 0 };

const generateContent = async (request: any) => {
  const user = userScope.getStore();
  if (!user && !hasKey() && !groqKey()) throw new Error('No LLM provider configured');
  stats.requests++;

  // Answers from a visitor's provider are cached separately from the server's own
  const key = cacheKey(user ? { ...request, _provider: `${user.def.id}/${user.model}` } : request);
  const cached = cacheGet(key);
  if (cached) {
    stats.cacheHits++;
    return cached;
  }

  const wantsJson = request.config?.responseMimeType === 'application/json';
  if (user) {
    try {
      const response = await callUserProvider(user, request, wantsJson);
      stats.userProvider++;
      cacheSet(key, response);
      return response;
    } catch (err: any) {
      // Never echo the key back; provider messages can quote it
      user.error = String(err?.message || err).split(user.key).join('***').slice(0, 200);
      if (!hasKey() && !groqKey()) throw err;
    }
  }
  let geminiError: unknown = new Error('GEMINI_API_KEY is not configured');
  if (hasKey()) {
    try {
      const response = await callGemini(request, wantsJson);
      stats.gemini++;
      cacheSet(key, response);
      return response;
    } catch (err) {
      geminiError = err;
    }
  }

  const prompt = textOnlyPrompt(request);
  if (!groqKey() || prompt === null) throw geminiError;
  try {
    const text = await callGroq(prompt, wantsJson);
    const finalText = wantsJson ? extractJson(text) : text;
    if (finalText === null) throw new Error('Groq returned invalid JSON');
    const response = { text: finalText, candidates: [{ content: { parts: [{ text: finalText }] } }] };
    stats.groq++;
    cacheSet(key, response);
    return response;
  } catch (groqError: any) {
    stats.failures++;
    throw new Error(`Gemini failed (${(geminiError as any)?.message || geminiError}); Groq failed (${groqError?.message || groqError})`);
  }
};

const callGemini = async (request: any, wantsJson: boolean) => {
  if (cooldownUntil > Date.now()) {
    throw new Error(`Gemini is cooling down after rate limits (${Math.ceil((cooldownUntil - Date.now()) / 1000)}s left)`);
  }

  for (let attempt = 1; ; attempt++) {
    try {
      const response: any = await withSlot(() =>
        Promise.race([
          getClient().models.generateContent({ ...request, model: GEMINI_MODEL }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timed out')), TIMEOUT_MS)),
        ])
      );
      if (wantsJson) {
        const json = extractJson(response.text ?? '');
        if (!json) throw new Error('Gemini returned invalid JSON');
        return { text: json, candidates: response.candidates };
      }
      return response;
    } catch (err: any) {
      const status = err?.status ?? err?.code;
      const message = String(err?.message || err);
      const rateLimited = status === 429 || /RESOURCE_EXHAUSTED|rate limit|quota/i.test(message);
      const overloaded = status === 503 || /UNAVAILABLE|overloaded/i.test(message);
      if (!rateLimited && !overloaded) throw err;
      if (rateLimited) stats.rateLimited++;
      const hinted = Number(/retry in ([\d.]+)s/i.exec(message)?.[1]) * 1000;
      const waitMs = Number.isFinite(hinted) && hinted > 0 ? hinted : 2000 * attempt;
      if (attempt >= 3 || waitMs > 10_000) {
        cooldownUntil = Date.now() + Math.max(waitMs, 30_000);
        throw new Error(`Gemini ${rateLimited ? 'rate limited' : 'overloaded'}; try again shortly`);
      }
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
};

export const llm = { models: { generateContent } };

export const llmConfigured = () => !!userScope.getStore() || hasKey() || !!groqKey();

export const llmStatus = () => ({
  model: GEMINI_MODEL,
  configured: hasKey(),
  groq: { configured: !!groqKey(), model: GROQ_MODEL(), cooldownMs: Math.max(0, groqCooldownUntil - Date.now()), textOnly: true },
  inFlight: active,
  queued: waiting.length,
  cooldownMs: Math.max(0, cooldownUntil - Date.now()),
  cache: { entries: cache.size, ttlMs: CACHE_TTL_MS },
  stats,
});
