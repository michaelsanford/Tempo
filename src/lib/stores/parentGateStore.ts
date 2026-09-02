import { writable } from 'svelte/store';

/** In-memory only (not persisted) — cleared on reload, so settings always re-gates after a fresh launch. */
export const settingsUnlocked = writable(false);
