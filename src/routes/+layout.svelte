<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { initPwa, initFullscreenOnGesture } from '$lib/stores/pwaInstallStore';

	let { children } = $props();
	// Compare against the resolved home path so this still works under the /clock base path.
	let homePath = $derived(resolve('/'));
	let isHome = $derived(page.url.pathname.replace(/\/$/, '') === homePath.replace(/\/$/, ''));
	let currentTheme = $derived($settingsStore.theme ?? 'dark');

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', currentTheme);
			initPwa();
			initFullscreenOnGesture();
		}
	});
</script>

<svelte:head>
	<title>{$t('appName')}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-shell" data-theme={currentTheme}>
	<div class="app-content">
		{#if !isHome}
			<a class="back-link touch-target" href={homePath} aria-label={$t('nav.home')}>
				<IconArrowLeft size="1.5rem" color="var(--color-primary)" />
			</a>
		{/if}
		{@render children()}
	</div>
</div>

<style>
	.back-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		align-self: flex-start;
		text-decoration: none;
		color: var(--color-primary);
		background: var(--color-surface);
		border: 2px solid var(--color-card-border);
		border-radius: 50%;
		width: 3rem;
		height: 3rem;
		box-shadow:
			0 3px 0 var(--color-card-border),
			0 4px 10px var(--color-shadow);
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	.back-link:active {
		transform: translateY(2px);
		box-shadow:
			0 1px 0 var(--color-card-border),
			0 2px 4px var(--color-shadow);
	}
</style>
