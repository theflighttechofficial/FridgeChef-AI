import test from 'node:test';
import assert from 'node:assert/strict';
import { directComplete, lastGeminiModel } from '../src/ai/directLlm';
import { activeProvider, updateAiSettings } from '../src/ai/settings';
import { friendlyAiError, parseLooseJson } from '../src/ai/resilience';

const realFetch = globalThis.fetch;
const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const ok = (text: string) => reply(200, { candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }] });
const fail = (code: number, message: string, status: string) => reply(code, { error: { code, message, status } });

const stubFetch = (handler: (url: string) => Response) => {
  const calls: string[] = [];
  globalThis.fetch = (async (input: any) => {
    calls.push(String(input));
    return handler(String(input));
  }) as typeof fetch;
  return calls;
};

test.afterEach(() => {
  globalThis.fetch = realFetch;
});

test('a pasted key loses quotes, spaces and line breaks', () => {
  updateAiSettings({ provider: 'gemini', apiKey: ' "AIza-test key"\n', model: '' });
  assert.equal(activeProvider()?.apiKey, 'AIza-testkey');
});

test('Gemini moves to the next model when the chosen one is retired or over quota', async () => {
  updateAiSettings({ provider: 'gemini', apiKey: 'key-fallback', model: 'gemini-retired' });
  const calls = stubFetch((url) => {
    if (url.includes('gemini-retired')) return fail(404, 'models/gemini-retired is not found for API version v1beta', 'NOT_FOUND');
    if (url.includes('gemini-3.5-flash-lite')) return fail(429, 'You exceeded your current quota', 'RESOURCE_EXHAUSTED');
    return ok('OK');
  });
  assert.equal(await directComplete({ prompt: 'hi' }), 'OK');
  assert.equal(calls.length, 3);
  assert.equal(lastGeminiModel, 'gemini-3.5-flash');
  // The model that answered is remembered, so the next call goes straight to it
  await directComplete({ prompt: 'again' });
  assert.equal(calls.length, 4);
});

test('Gemini asks the API for usable models when every known one fails', async () => {
  updateAiSettings({ provider: 'gemini', apiKey: 'key-list', model: '' });
  stubFetch((url) => {
    if (url.includes('/v1beta/models?')) return reply(200, { models: [{ name: 'models/gemini-9-flash', supportedGenerationMethods: ['generateContent'] }, { name: 'models/gemini-9-flash-tts', supportedGenerationMethods: ['generateContent'] }] });
    return url.includes('gemini-9-flash:') ? ok('fine') : fail(404, 'model is not found', 'NOT_FOUND');
  });
  assert.equal(await directComplete({ prompt: 'hi' }), 'fine');
  assert.equal(lastGeminiModel, 'gemini-9-flash');
});

test('a rejected key stops at once with a plain reason', async () => {
  updateAiSettings({ provider: 'gemini', apiKey: 'key-bad', model: '' });
  const calls = stubFetch(() => fail(400, 'API key not valid. Please pass a valid API key.', 'INVALID_ARGUMENT'));
  await assert.rejects(directComplete({ prompt: 'hi' }), /rejected this API key/);
  assert.equal(calls.length, 1);
});

test('provider errors read as plain sentences', () => {
  assert.match(friendlyAiError(new Error('{"error":{"code":429,"message":"Quota exceeded","status":"RESOURCE_EXHAUSTED"}}')), /quota/);
  assert.match(friendlyAiError(new TypeError('Failed to fetch')), /internet/);
  assert.match(friendlyAiError(new Error('503: The model is overloaded.')), /busy/);
});

test('a cut-off JSON answer keeps its complete recipes', () => {
  const cut = '```json\n{"recipes":[{"title":"A","steps":[{"n":1}]},{"title":"B","steps":[{"n":1},{"n":2}]},{"title":"C","steps":[{"n":1},{"instr';
  const parsed = parseLooseJson<{ recipes: any[] }>(cut);
  assert.deepEqual(parsed.recipes.slice(0, 2).map((r) => r.title), ['A', 'B']);
  assert.deepEqual(parseLooseJson('Here you go: {"a":[1,2]} enjoy'), { a: [1, 2] });
});
