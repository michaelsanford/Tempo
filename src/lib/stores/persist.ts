import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * A writable store backed by localStorage. Corrupt or missing JSON falls back to `initial`
 * rather than crashing — this app must never brick mid-use for a young child on first run
 * or after storage corruption.
 */
export function persistedStore<T>(
	key: string,
	initial: T,
	migrate?: (raw: unknown) => T
): Writable<T> {
	const store = writable<T>(readInitial());

	function readInitial(): T {
		if (!browser) return initial;
		try {
			const raw = localStorage.getItem(key);
			if (raw === null) return initial;
			const parsed = JSON.parse(raw);
			return migrate ? migrate(parsed) : (parsed as T);
		} catch {
			return initial;
		}
	}

	if (browser) {
		store.subscribe((value) => {
			try {
				localStorage.setItem(key, JSON.stringify(value));
			} catch {
				// storage unavailable or full — silently ignore, in-memory state still works
			}
		});
	}

	return store;
}
