import { readable } from 'svelte/store';
import { browser } from '$app/environment';

/** A single shared ticker (1s) powering every "current time" display in the app. */
export const clockTickStore = readable<Date>(new Date(), (set) => {
	if (!browser) return;
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
