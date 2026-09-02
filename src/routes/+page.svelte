<script lang="ts">
	import MenuTile from '$lib/components/nav/MenuTile.svelte';
	import ParentGate from '$lib/components/nav/ParentGate.svelte';
	import AnalogClockFace from '$lib/components/clock/AnalogClockFace.svelte';
	import IconReadClock from '$lib/components/icons/IconReadClock.svelte';
	import IconMatchClock from '$lib/components/icons/IconMatchClock.svelte';
	import IconSetClock from '$lib/components/icons/IconSetClock.svelte';
	import IconHowLong from '$lib/components/icons/IconHowLong.svelte';
	import IconLeaveBy from '$lib/components/icons/IconLeaveBy.svelte';
	import IconTrophy from '$lib/components/icons/IconTrophy.svelte';
	import IconExplore from '$lib/components/icons/IconExplore.svelte';
	import { t } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { settingsUnlocked } from '$lib/stores/parentGateStore';
	import { clockTickStore } from '$lib/stores/clockTickStore';

	let now = $derived({ hour: $clockTickStore.getHours(), minute: $clockTickStore.getMinutes() });

	function unlockSettings() {
		settingsUnlocked.set(true);
		goto(resolve('/settings'));
	}
</script>

<h1 class="visually-hidden">{$t('appName')}</h1>

<!-- Free play / Explore hero tile -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is pre-resolved -->
<a class="hero" href={resolve('/explore')} aria-label={$t('nav.explore')}>
	<div class="hero-badge">
		<IconExplore size="1.25rem" color="var(--color-accent)" />
		<span>{$t('nav.explore')}</span>
	</div>
	<AnalogClockFace time={now} size="min(46vw, 30vh, 180px)" />
	<span class="hero-subtext">{$t('explore.title')}</span>
</a>

<div class="grid">
	{#snippet iconRead()}
		<IconReadClock size="clamp(3.1rem, 13vw, 3.6rem)" color="#38bdf8" />
	{/snippet}
	<MenuTile
		href={resolve('/play/read-the-clock')}
		label={$t('nav.readClock')}
		color="#38bdf8"
		icon={iconRead}
	/>

	{#snippet iconMatch()}
		<IconMatchClock size="clamp(3.1rem, 13vw, 3.6rem)" color="#2dd4bf" />
	{/snippet}
	<MenuTile
		href={resolve('/play/match-the-clock')}
		label={$t('nav.matchClock')}
		color="#2dd4bf"
		icon={iconMatch}
	/>

	{#snippet iconSet()}
		<IconSetClock size="clamp(3.1rem, 13vw, 3.6rem)" color="#34d399" />
	{/snippet}
	<MenuTile
		href={resolve('/play/set-the-clock')}
		label={$t('nav.setClock')}
		color="#34d399"
		icon={iconSet}
	/>

	{#snippet iconHowLong()}
		<IconHowLong size="clamp(3.1rem, 13vw, 3.6rem)" color="#fbbf24" />
	{/snippet}
	<MenuTile
		href={resolve('/play/how-long-until')}
		label={$t('nav.howLongUntil')}
		color="#fbbf24"
		icon={iconHowLong}
	/>

	{#snippet iconLeaveBy()}
		<IconLeaveBy size="clamp(3.1rem, 13vw, 3.6rem)" color="#fb7185" />
	{/snippet}
	<MenuTile
		href={resolve('/leave-by')}
		label={$t('nav.leaveBy')}
		color="#fb7185"
		icon={iconLeaveBy}
	/>

	{#snippet iconProgress()}
		<IconTrophy size="clamp(3.1rem, 13vw, 3.6rem)" color="#c084fc" />
	{/snippet}
	<MenuTile
		href={resolve('/progress')}
		label={$t('nav.progress')}
		color="#c084fc"
		icon={iconProgress}
	/>
</div>

<div class="settings-slot">
	<ParentGate onUnlock={unlockSettings} />
</div>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.45rem;
		padding: 0.85rem 0.75rem 0.75rem;
		text-decoration: none;
		color: var(--color-text);
		background: linear-gradient(
			160deg,
			color-mix(in srgb, var(--color-accent) 18%, var(--color-surface)),
			var(--color-surface)
		);
		border: 3px solid var(--color-accent);
		border-radius: var(--radius-xl);
		box-shadow:
			0 5px 0 color-mix(in srgb, var(--color-accent) 60%, black),
			0 10px 24px var(--color-shadow);
		transition:
			transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.12s ease;
	}

	.hero:active {
		transform: translateY(3px);
		box-shadow:
			0 2px 0 color-mix(in srgb, var(--color-accent) 60%, black),
			0 4px 10px var(--color-shadow);
	}

	.hero-badge {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.25rem 0.75rem;
		background: color-mix(in srgb, var(--color-accent) 20%, var(--color-bg));
		border: 1.5px solid var(--color-accent);
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 800;
		color: var(--color-accent);
		letter-spacing: 0.02em;
	}

	.hero-subtext {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.85rem;
	}

	.settings-slot {
		margin-top: auto;
		padding-top: 0.35rem;
	}
</style>
