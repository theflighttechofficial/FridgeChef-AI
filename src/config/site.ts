// Site-wide constants. Contact details come from env vars so no placeholder address ever ships.
// Set VITE_CONTACT_EMAIL and VITE_CONTACT_ADDRESS in .env to show them on the contact page.
export const SITE_NAME = 'FridgeChef';

export const CONTACT_EMAIL: string | undefined = import.meta.env.VITE_CONTACT_EMAIL || undefined;
export const CONTACT_ADDRESS: string | undefined = import.meta.env.VITE_CONTACT_ADDRESS || undefined;

export const DEFAULT_DESCRIPTION =
  'Photograph your fridge and FridgeChef suggests a meal from what you already have, then talks you through cooking it.';
