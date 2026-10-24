import { test } from 'node:test';
import assert from 'node:assert/strict';

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => store.set(k, v),
  removeItem: (k: string) => store.delete(k),
  get length() {
    return store.size;
  },
  key: (i: number) => [...store.keys()][i] ?? null,
};

const auth = await import('../src/auth/account');

test('account is created, stays signed in, and checks the password', async () => {
  await auth.createAccount({ name: 'Asha Rao', email: '', seedId: 'basil', dietary: ['Vegetarian'], regions: ['Indian'] }, 'secret12');
  const saved = JSON.parse(store.get('fridgechef.account.v1')!);
  assert.equal(saved.name, 'Asha Rao');
  assert.ok(!JSON.stringify(saved).includes('secret12'), 'password must not be stored');
  assert.equal(JSON.parse(store.get('fridgechef.session.v1')!).signedIn, true);

  auth.signOut();
  assert.equal(await auth.signIn('wrong-pass'), false);
  assert.equal(await auth.signIn('secret12'), true);
  assert.equal(auth.initials('Asha Rao'), 'AR');

  store.set('fridgechef.u.pantry', '[{"name":"Eggs"}]');
  store.set('fridgechef.aiSettings.v1', '{"apiKey":"k"}');
  store.set('fridgechef.theme.v1', 'basil');
  auth.deleteAccount();
  assert.equal(store.get('fridgechef.account.v1'), undefined);
  // Everything personal goes with the account; device appearance stays
  assert.equal(store.get('fridgechef.u.pantry'), undefined);
  assert.equal(store.get('fridgechef.aiSettings.v1'), undefined);
  assert.equal(store.get('fridgechef.theme.v1'), 'basil');
});
