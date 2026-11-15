/**
 * Pure rules for the device vault (see native/deviceVault.ts): what goes into the copy that
 * survives a reinstall, and what to do with a copy found on a fresh install.
 */
export const ACCOUNT_KEY = 'fridgechef.account.v1';
export const SESSION_KEY = 'fridgechef.session.v1';
const PREFIX = 'fridgechef.';
// A fridge photo can be several megabytes; the vault keeps the ingredient list, not the picture
const MAX_VALUE_CHARS = 200_000;

export interface VaultSnapshot {
  version: 1;
  deviceId: string;
  savedAt: string;
  data: Record<string, string>;
}

/** Everything personal worth keeping, as stored. The signed-in flag is decided again on restore. */
export const collectVaultData = (entries: Iterable<[string, string]>): Record<string, string> => {
  const data: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (key.startsWith(PREFIX) && key !== SESSION_KEY && value.length <= MAX_VALUE_CHARS) data[key] = value;
  }
  return data;
};

export interface RestorePlan {
  writes: Record<string, string>;
  // Same device as the one that saved the copy: sign in without asking for the password
  autoSignIn: boolean;
  name: string;
}

/**
 * Restore only onto an install that has no account yet, and only a copy that holds one.
 * A copy from another device (cloud restore or phone transfer) comes back too, but the person
 * must enter their password there.
 */
export const planRestore = (hasLocalAccount: boolean, snapshot: VaultSnapshot | null, deviceId: string): RestorePlan | null => {
  if (hasLocalAccount || !snapshot || snapshot.version !== 1 || typeof snapshot.data !== 'object') return null;
  const rawAccount = snapshot.data[ACCOUNT_KEY];
  if (!rawAccount) return null;
  let name = '';
  try {
    name = String(JSON.parse(rawAccount)?.name || '');
  } catch {
    return null;
  }
  const autoSignIn = !!deviceId && snapshot.deviceId === deviceId;
  return { writes: { ...snapshot.data, [SESSION_KEY]: JSON.stringify({ signedIn: autoSignIn }) }, autoSignIn, name };
};
