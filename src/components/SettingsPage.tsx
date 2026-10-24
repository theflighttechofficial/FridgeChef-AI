import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Brain, Check, CircleAlert, Cloud, Cpu, ExternalLink, Eye, EyeOff, KeyRound, Loader2, Palette, RotateCcw, Server, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import { PROVIDERS, providerById } from '../ai/providers';
import { activeProvider, hasServer, isNativeApp, updateAiSettings, useAiSettings } from '../ai/settings';
import { directComplete } from '../ai/directLlm';
import { SEEDS, setSeed, useSeed } from '../theme/dynamicColor';
import { getTasteState, resetTaste, subscribeTaste, topTastes } from '../ml/tasteModel';
import model from '../ml/model.json';
import { deleteAccount, initials, signOut, updateProfile, useAccount } from '../auth/account';

const Card: React.FC<{ icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string; children: React.ReactNode }> = ({ icon: Icon, title, subtitle, children }) => (
  <section className="rounded-[1.75rem] bg-surface-container p-5 sm:p-6 space-y-5">
    <header className="flex items-start gap-4">
      <span className="w-11 h-11 shrink-0 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center">
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-on-surface leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
      </div>
    </header>
    {children}
  </section>
);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-on-surface">{label}</span>
    {children}
    {hint && <span className="block text-xs text-on-surface-variant">{hint}</span>}
  </label>
);

const inputClass =
  'w-full h-14 px-4 rounded-2xl bg-surface-highest/60 border border-outline-variant text-on-surface placeholder:text-on-surface-variant/70 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-base';

const AccountCard: React.FC = () => {
  const { account } = useAccount();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(account?.name || '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!account) return null;
  const joined = new Date(account.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return (
    <section className="rounded-[1.75rem] bg-primary-container text-on-primary-container p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-16 h-16 shrink-0 rounded-full bg-primary text-on-primary grid place-items-center text-2xl font-semibold">{initials(account.name)}</span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) updateProfile({ name: name.trim() });
                setEditing(false);
              }}
              className="flex gap-2"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                aria-label="Your name"
                className="min-w-0 flex-1 h-11 px-3 rounded-xl bg-surface/40 outline-none focus:ring-2 focus:ring-primary text-base"
              />
              <button className="h-11 px-4 rounded-full bg-primary text-on-primary text-sm font-semibold">Save</button>
            </form>
          ) : (
            <>
              <p className="text-xl font-semibold truncate">{account.name}</p>
              <p className="text-sm opacity-80 truncate">{account.email || 'No email added'} · on this device since {joined}</p>
            </>
          )}
        </div>
      </div>
      {!!(account.dietary.length || account.regions.length) && (
        <div className="flex flex-wrap gap-2">
          {[...account.dietary, ...account.regions].map((t) => (
            <span key={t} className="h-7 px-3 rounded-lg bg-surface/30 text-xs font-medium inline-flex items-center">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {!editing && (
          <button onClick={() => setEditing(true)} className="h-10 px-4 rounded-full bg-surface/30 text-sm font-semibold state-layer">
            Edit name
          </button>
        )}
        <button onClick={signOut} className="h-10 px-4 rounded-full bg-surface/30 text-sm font-semibold state-layer">
          Sign out
        </button>
        <button onClick={() => setConfirmDelete(true)} className="h-10 px-4 rounded-full text-sm font-semibold state-layer text-rose-200">
          Delete account
        </button>
      </div>
      {confirmDelete && (
        <div className="rounded-2xl bg-surface/40 p-4 space-y-3" role="alert">
          <p className="text-sm">Delete your account from this device? Your pantry, saved recipes, shopping list, history and AI key are removed too.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirmDelete(false)} className="h-10 px-4 rounded-full text-sm font-semibold state-layer">
              Cancel
            </button>
            <button onClick={deleteAccount} className="h-10 px-4 rounded-full bg-rose-300 text-rose-950 text-sm font-semibold">
              Delete
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

type TestState = { status: 'idle' } | { status: 'running' } | { status: 'ok'; reply: string; via: string } | { status: 'error'; error: string };

interface SettingsPageProps {
  onTryLocalModel: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onTryLocalModel }) => {
  const settings = useAiSettings();
  const seed = useSeed();
  const taste = useSyncExternalStore(subscribeTaste, getTasteState, getTasteState);
  const [showKey, setShowKey] = useState(false);
  const [test, setTest] = useState<TestState>({ status: 'idle' });
  const provider = providerById(settings.provider) || PROVIDERS[0];
  const native = isNativeApp();

  // A new provider or key invalidates the last test result
  useEffect(() => setTest({ status: 'idle' }), [settings.provider, settings.apiKey, settings.model, settings.baseUrl]);

  const runTest = async () => {
    const active = activeProvider(settings);
    if (!active) return setTest({ status: 'error', error: 'Enter an API key first.' });
    setTest({ status: 'running' });
    if (!active.def.deviceOnly && hasServer()) {
      try {
        const res = await fetch('/api/llm/test', { method: 'POST' });
        const data = await res.json();
        return setTest(data.ok ? { status: 'ok', reply: data.reply, via: 'through the FridgeChef server' } : { status: 'error', error: data.error || 'Unknown error' });
      } catch {
        // Server unreachable; fall through to a direct call
      }
    }
    try {
      const reply = await directComplete({ prompt: 'Reply with the single word OK.', maxTokens: 64 });
      setTest({ status: 'ok', reply: reply.trim().slice(0, 40), via: 'directly from this device' });
    } catch (err: any) {
      setTest({ status: 'error', error: String(err?.message || err).slice(0, 200) });
    }
  };

  const metrics = model.metrics;
  const pct = (x: number) => `${Math.round(x * 100)}%`;

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      <AccountCard />
      {/* Recipe engine */}
      <Card icon={Sparkles} title="Recipe engine" subtitle="Where recipe ideas come from.">
        <div className="grid grid-cols-2 p-1 rounded-full border border-outline-variant" role="radiogroup" aria-label="Recipe engine">
          {[
            { id: 'auto' as const, label: 'Cloud + device', icon: Cloud },
            { id: 'local' as const, label: 'Device only', icon: Cpu },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="radio"
              aria-checked={settings.engine === id}
              onClick={() => updateAiSettings({ engine: id })}
              className={`h-11 rounded-full text-sm font-semibold flex items-center justify-center gap-2 px-2 ${
                settings.engine === id ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant state-layer'
              }`}
            >
              {settings.engine === id ? <Check className="w-4 h-4 shrink-0" /> : <Icon className="w-4 h-4 shrink-0" />}
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-on-surface-variant">
          {settings.engine === 'auto'
            ? 'Recipes come from cloud AI. If it is offline or out of quota, the on-device model answers instead, so you always get suggestions.'
            : 'Recipes come only from the model built into the app. Instant, private and works offline. Photo reading still needs cloud AI.'}
        </p>
      </Card>

      {/* Own AI provider */}
      <Card icon={KeyRound} title="Your AI provider" subtitle="Use your own API key from any supported provider.">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="AI provider">
          {PROVIDERS.map((p) => {
            const selected = p.id === provider.id;
            return (
              <button
                key={p.id}
                role="radio"
                aria-checked={selected}
                onClick={() => updateAiSettings({ provider: p.id, model: '' })}
                className={`h-9 px-3 rounded-lg text-sm font-medium flex items-center gap-1.5 border ${
                  selected ? 'bg-secondary-container text-on-secondary-container border-transparent' : 'border-outline-variant text-on-surface-variant state-layer'
                }`}
              >
                {selected && <Check className="w-4 h-4" />}
                {p.label}
              </button>
            );
          })}
        </div>

        <Field
          label={provider.id === 'custom' ? 'API key (optional)' : 'API key'}
          hint={provider.keyUrl ? undefined : 'Leave empty for local servers such as Ollama or LM Studio.'}
        >
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => updateAiSettings({ apiKey: e.target.value })}
              placeholder={provider.keyHint}
              autoComplete="off"
              spellCheck={false}
              className={`${inputClass} pr-14 font-mono text-sm`}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full state-layer text-on-surface-variant"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </Field>
        {provider.keyUrl && (
          <a href={provider.keyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline -mt-2">
            Get a {provider.label} key <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <Field label="Model" hint={`Default: ${provider.defaultModel}${provider.vision ? ' · reads photos' : ' · text only, photo reading uses the server'}`}>
          <input
            list={`models-${provider.id}`}
            value={settings.model}
            onChange={(e) => updateAiSettings({ model: e.target.value })}
            placeholder={provider.defaultModel}
            spellCheck={false}
            className={inputClass}
          />
          <datalist id={`models-${provider.id}`}>
            {provider.models.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>

        {provider.id === 'custom' && (
          <Field label="Endpoint URL" hint="An OpenAI-compatible /v1 endpoint. Called directly from this device.">
            <input
              value={settings.baseUrl}
              onChange={(e) => updateAiSettings({ baseUrl: e.target.value })}
              placeholder={provider.baseUrl}
              spellCheck={false}
              inputMode="url"
              className={inputClass}
            />
          </Field>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={runTest}
            disabled={test.status === 'running'}
            className="h-10 px-5 rounded-full bg-emerald-300 text-emerald-950 text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            {test.status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Test connection
          </button>
          {settings.apiKey && (
            <button
              onClick={() => updateAiSettings({ apiKey: '' })}
              className="h-10 px-4 rounded-full text-sm font-semibold text-rose-300 state-layer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove key
            </button>
          )}
        </div>
        {test.status === 'ok' && (
          <p className="flex items-start gap-2 text-sm text-emerald-300" role="status">
            <Check className="w-4 h-4 mt-0.5 shrink-0" /> Connected {test.via}. Reply: “{test.reply || 'OK'}”
          </p>
        )}
        {test.status === 'error' && (
          <p className="flex items-start gap-2 text-sm text-rose-300" role="alert">
            <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" /> {test.error}
          </p>
        )}

        <p className="text-xs text-on-surface-variant leading-relaxed rounded-2xl bg-surface-low p-3">
          Your key is saved only on this device. When you use FridgeChef features, it is sent with each request
          {provider.deviceOnly ? ' straight to your endpoint' : ' to the FridgeChef server, which passes it to ' + provider.label + ' for that request and never stores or logs it'}.
          Usage is billed to your {provider.id === 'custom' ? 'server' : provider.label} account.
        </p>
      </Card>

      {/* Server URL: the Android app needs one; on the web it is optional */}
      {(native || settings.serverUrl) && (
        <Card icon={Server} title="FridgeChef server" subtitle="The Android app talks to this server for cloud AI features.">
          <Field label="Server URL" hint={native ? 'Leave empty to run fully on-device with your own key or the built-in model.' : 'Only needed if this site should use a different server.'}>
            <input
              value={settings.serverUrl}
              onChange={(e) => updateAiSettings({ serverUrl: e.target.value.trim() })}
              placeholder="https://fridgechef.example.com"
              inputMode="url"
              spellCheck={false}
              className={inputClass}
            />
          </Field>
        </Card>
      )}

      {/* On-device model */}
      <Card icon={Cpu} title="On-device recipe model" subtitle={`Trained ${model.trainedAt} · runs offline in this app`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            ['Recipes', String(model.recipes)],
            ['Cuisines', String(model.cuisineModel.cuisines.length)],
            ['Ingredients', String(model.vocab.length)],
            ['Top-3 accuracy', pct(metrics.model.top3)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-surface-low p-3">
              <p className="text-2xl font-semibold text-on-surface tabular-nums">{value}</p>
              <p className="text-xs text-on-surface-variant">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Covers every Indian region from Kashmir to Kerala plus {model.cuisineModel.metrics.regions - 1} world regions. Learned ingredient
          embeddings ({model.dim} dimensions) spot substitutes like kale for spinach, and a cuisine classifier reads your fridge's flavour
          profile. On {metrics.testSessions.toLocaleString()} held-out simulated pantries, each with 8 near-miss decoys, the ranker puts the
          right recipe in its top 3 {pct(metrics.model.top3)} of the time (plain ingredient matching: {pct(metrics.coverageBaseline.top3)}).
          Any ingredient mix the recipes do not cover gets a recipe composed on the spot.
        </p>
        <button onClick={onTryLocalModel} className="h-10 px-5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Suggest recipes from my fridge
        </button>
      </Card>

      {/* Taste model */}
      <Card icon={Brain} title="Your taste" subtitle={taste.events ? `Learned from ${taste.events} saves and cooks on this device` : 'Save or cook recipes and FridgeChef learns what you like.'}>
        {taste.events > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {topTastes(10).map((t) => (
                <span
                  key={t.key}
                  className={`h-8 px-3 rounded-lg text-sm font-medium inline-flex items-center ${t.weight > 0 ? 'bg-emerald-900/60 text-emerald-200' : 'bg-rose-950/60 text-rose-200'}`}
                >
                  {t.weight > 0 ? '+' : '−'} {t.label}
                </span>
              ))}
            </div>
            <button onClick={resetTaste} className="h-10 px-4 rounded-full text-sm font-semibold text-on-surface-variant state-layer flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset what it learned
            </button>
          </>
        ) : (
          <p className="text-sm text-on-surface-variant">Nothing learned yet. Everything stays on this device.</p>
        )}
      </Card>

      {/* Appearance */}
      <Card icon={Palette} title="Colours" subtitle="Material You: the whole app re-tints from one colour.">
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Theme colour">
          {SEEDS.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={seed.id === s.id}
              aria-label={s.label}
              title={s.label}
              onClick={() => setSeed(s)}
              className={`w-14 h-14 rounded-2xl grid place-items-center overflow-hidden relative ${seed.id === s.id ? 'ring-2 ring-offset-2 ring-offset-surface-container ring-on-surface' : ''}`}
              style={{ background: `oklch(80% 0.13 ${s.hue})` }}
            >
              <span className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `oklch(45% 0.09 ${s.hue})` }} />
              {seed.id === s.id && <Check className="relative w-5 h-5 text-white drop-shadow" />}
            </button>
          ))}
        </div>
      </Card>

      <nav className="flex flex-wrap gap-x-5 gap-y-2 px-2 pt-2 text-sm text-on-surface-variant">
        <a href="#/privacy" className="hover:text-on-surface">Privacy</a>
        <a href="#/terms" className="hover:text-on-surface">Terms</a>
        <a href="#/contact" className="hover:text-on-surface">Contact</a>
        <button onClick={() => window.dispatchEvent(new Event('fridgechef:open-consent'))} className="hover:text-on-surface">
          Cookie settings
        </button>
        <span className="ml-auto">FridgeChef {native ? 'for Android' : 'web'} · © 2026</span>
      </nav>
    </div>
  );
};
