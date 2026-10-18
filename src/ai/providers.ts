/**
 * AI providers a person can plug their own API key into. Shared by the app (settings screen,
 * direct-from-device calls) and the server (per-request proxy), so both agree on base URLs.
 *
 * `kind` picks the wire format: Gemini's own API, Anthropic's Messages API, or the
 * OpenAI-compatible chat completions API that most other providers expose.
 */
export type ProviderKind = 'gemini' | 'anthropic' | 'openai';

export interface ProviderDef {
  id: string;
  label: string;
  kind: ProviderKind;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  keyHint: string;
  keyUrl?: string;
  vision: boolean;
  // Custom endpoints run only from the device; the server never fetches user-supplied URLs
  deviceOnly?: boolean;
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: 'gemini',
    label: 'Google Gemini',
    kind: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-3.5-flash-lite',
    models: ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'],
    keyHint: 'AIza…',
    keyUrl: 'https://aistudio.google.com/apikey',
    vision: true,
  },
  {
    id: 'openai',
    label: 'OpenAI',
    kind: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-5-mini',
    models: ['gpt-5-mini', 'gpt-5', 'gpt-5-nano', 'gpt-4.1-mini', 'gpt-4o-mini'],
    keyHint: 'sk-…',
    keyUrl: 'https://platform.openai.com/api-keys',
    vision: true,
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    kind: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-haiku-5-5',
    models: ['claude-haiku-5-5', 'claude-sonnet-5-5', 'claude-opus-5-5'],
    keyHint: 'sk-ant-…',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    vision: true,
  },
  {
    id: 'groq',
    label: 'Groq',
    kind: 'openai',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b'],
    keyHint: 'gsk_…',
    keyUrl: 'https://console.groq.com/keys',
    vision: false,
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    kind: 'openai',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openrouter/auto',
    models: ['openrouter/auto', 'google/gemini-2.5-flash', 'anthropic/claude-haiku-4.5', 'meta-llama/llama-3.3-70b-instruct'],
    keyHint: 'sk-or-…',
    keyUrl: 'https://openrouter.ai/keys',
    vision: true,
  },
  {
    id: 'mistral',
    label: 'Mistral AI',
    kind: 'openai',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest',
    models: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest'],
    keyHint: 'Mistral API key',
    keyUrl: 'https://console.mistral.ai/api-keys',
    vision: true,
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    kind: 'openai',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    keyHint: 'sk-…',
    keyUrl: 'https://platform.deepseek.com/api_keys',
    vision: false,
  },
  {
    id: 'xai',
    label: 'xAI Grok',
    kind: 'openai',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-3-mini',
    models: ['grok-3-mini', 'grok-4'],
    keyHint: 'xai-…',
    keyUrl: 'https://console.x.ai',
    vision: true,
  },
  {
    id: 'custom',
    label: 'Custom (OpenAI-compatible)',
    kind: 'openai',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3.2',
    models: [],
    keyHint: 'Optional for local servers',
    vision: false,
    deviceOnly: true,
  },
];

export const providerById = (id: string | undefined) => PROVIDERS.find((p) => p.id === id);

// Request headers the app sends so the server can use the person's own key for that request
export const HEADER_PROVIDER = 'x-fc-provider';
export const HEADER_KEY = 'x-fc-key';
export const HEADER_MODEL = 'x-fc-model';
