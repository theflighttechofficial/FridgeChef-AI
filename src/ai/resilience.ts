/**
 * Shared by the app and the server so a working key keeps working when one model does not:
 *   - Gemini model chain: a model that is retired, over quota or overloaded is skipped for the next
 *   - plain-language reasons for provider errors, instead of raw JSON
 *   - salvage for a JSON answer that was cut off mid-way
 */

// Tried in order after the chosen model. Each has its own free-tier quota.
const GEMINI_FALLBACKS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];

export const geminiModelChain = (model: string) => [model, ...GEMINI_FALLBACKS.filter((m) => m !== model)];

/** HTTP status of a provider error, from the error object or the start of its message. */
export const errorStatus = (err: any): number => {
  const direct = Number(err?.status ?? err?.code);
  if (direct >= 400 && direct < 600) return direct;
  const message = String(err?.message || err || '');
  const found = /^(\d{3})\b/.exec(message) || /"code"\s*:\s*(\d{3})/.exec(message);
  return found ? Number(found[1]) : 0;
};

/** Not found, over quota or overloaded: another model on the same key can still answer. */
export const canTryNextModel = (err: any) => {
  const status = errorStatus(err);
  if ([404, 429, 500, 503].includes(status)) return true;
  return /not found|not supported|RESOURCE_EXHAUSTED|quota|UNAVAILABLE|overloaded/i.test(String(err?.message || err));
};

/** Models this key can really use, best general-purpose ones first. Empty when the list call fails. */
export const listGeminiModels = async (baseUrl: string, key: string): Promise<string[]> => {
  try {
    const res = await fetch(`${baseUrl}/v1beta/models?pageSize=200`, { headers: { 'x-goog-api-key': key } });
    if (!res.ok) return [];
    const data: any = await res.json();
    const names: string[] = (data?.models || [])
      .filter((m: any) => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map((m: any) => String(m.name || '').replace(/^models\//, ''))
      .filter((n: string) => /^gemini/.test(n) && !/tts|image|audio|live|embedding|robotics|computer/i.test(n));
    const rank = (n: string) => (/flash-lite/.test(n) ? 0 : /flash/.test(n) ? 1 : 2) + (/preview|exp/.test(n) ? 3 : 0);
    return names.sort((a, b) => rank(a) - rank(b) || b.localeCompare(a));
  } catch {
    return [];
  }
};

/** Provider's own sentence from an error, with any JSON wrapper removed. */
const providerSentence = (message: string) => {
  const start = message.indexOf('{');
  if (start >= 0) {
    try {
      const parsed = JSON.parse(message.slice(start));
      const inner = parsed?.error?.message || parsed?.message;
      if (typeof inner === 'string' && inner) return inner;
    } catch {}
  }
  return message.replace(/^\d{3}:?\s*/, '');
};

/** One short sentence a person can act on. */
export const friendlyAiError = (err: any, model?: string): string => {
  const raw = String(err?.message || err || 'Unknown error');
  const status = errorStatus(err);
  const detail = providerSentence(raw).replace(/\s+/g, ' ').trim().slice(0, 140);
  if (err?.name === 'AbortError' || /timed out|aborted/i.test(raw)) return 'The AI provider took too long to answer. Try again.';
  if (/failed to fetch|networkerror|load failed|ENOTFOUND|ECONNREFUSED|fetch failed/i.test(raw)) return 'Could not reach the AI provider. Check the internet connection.';
  if (/API key not valid|API_KEY_INVALID|invalid api key|incorrect api key|invalid x-api-key/i.test(raw) || status === 401)
    return 'The provider rejected this API key. Copy the key again, with no spaces or quotes.';
  if (status === 403 || /PERMISSION_DENIED/i.test(raw))
    return `This key is not allowed to use the API (${detail}). Remove app or website restrictions on the key, or create a new one.`;
  if (status === 404 || /not found|not supported for generateContent/i.test(raw)) return `Model ${model || 'chosen'} is not available for this key. Pick another model.`;
  if (status === 429 || /RESOURCE_EXHAUSTED|quota|rate limit/i.test(raw)) return 'This key has used up its quota for now. Wait a minute, or pick another model.';
  if (status === 503 || status === 500 || /UNAVAILABLE|overloaded/i.test(raw)) return 'The AI provider is busy right now. Try again in a moment.';
  if (/invalid JSON|Unexpected (end|token)|JSON/i.test(raw)) return 'The AI answer was incomplete. Try again.';
  return status ? `${status}: ${detail}` : detail;
};

/**
 * Parse a JSON answer. Removes code fences and stray prose; when the answer was cut off mid-way,
 * keeps every complete item before the cut instead of failing.
 */
export const parseLooseJson = <T = any>(raw: string): T => {
  const text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try {
    return JSON.parse(text);
  } catch {}
  const start = text.search(/[[{]/);
  if (start < 0) throw new Error('returned invalid JSON');
  const body = text.slice(start);
  const end = Math.max(body.lastIndexOf('}'), body.lastIndexOf(']'));
  try {
    return JSON.parse(body.slice(0, end + 1));
  } catch {}

  // Cut off: walk the text, remember each point where a value closed, then close the open brackets
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  const cuts: { at: number; open: string[] }[] = [];
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{' || ch === '[') stack.push(ch === '{' ? '}' : ']');
    else if (ch === '}' || ch === ']') {
      stack.pop();
      // Only cuts after an item of an array are safe (an object key would be left without a value)
      if (stack[stack.length - 1] === ']') cuts.push({ at: i + 1, open: [...stack] });
    }
  }
  for (const cut of cuts.reverse()) {
    try {
      return JSON.parse(body.slice(0, cut.at) + cut.open.reverse().join(''));
    } catch {}
  }
  throw new Error('returned invalid JSON');
};
