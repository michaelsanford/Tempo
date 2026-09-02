<script lang="ts">
	import type { Badge } from '$lib/types/progress';
	import IconStar from '$lib/components/icons/IconStar.svelte';
	import IconFlame from '$lib/components/icons/IconFlame.svelte';
	import IconClock from '$lib/components/icons/IconClock.svelte';
	import IconTrophy from '$lib/components/icons/IconTrophy.svelte';
	import IconMedal from '$lib/components/icons/IconMedal.svelte';

	interface Props {
		badge: Badge;
		earned: boolean;
	}

	let { badge, earned }: Props = $props();
</script>

<div class="badge" class:earned>
	<div class="icon-wrap">
		{#if badge.icon === 'star'}
			<IconStar size="2rem" color={earned ? '#fbbf24' : 'var(--color-text-muted)'} />
		{:else if badge.icon === 'streak'}
			<IconFlame size="2rem" color={earned ? '#f97316' : 'var(--color-text-muted)'} />
		{:else if badge.icon === 'clock'}
			<IconClock size="2rem" color={earned ? '#38bdf8' : 'var(--color-text-muted)'} />
		{:else if badge.icon === 'trophy'}
			<IconTrophy size="2rem" color={earned ? '#c084fc' : 'var(--color-text-muted)'} />
		{:else}
			<IconMedal size="2rem" color={earned ? '#fbbf24' : 'var(--color-text-muted)'} />
		{/if}
	</div>
	<span class="name">{badge.name}</span>
	<span class="description">{badge.description}</span>
</div>

<style>
	.badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		text-align: center;
		padding: 0.85rem 0.5rem;
		border-radius: var(--radius-md);
		background: var(--color-surface);
		border: 1.5px solid var(--color-card-border);
		opacity: 0.45;
		filter: grayscale(0.85);
		transition:
			opacity 0.2s ease,
			filter 0.2s ease,
			transform 0.2s ease;
	}

	.badge.earned {
		opacity: 1;
		filter: none;
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px var(--color-shadow);
	}

	.icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 2.25rem;
	}

	.name {
		font-weight: 800;
		font-size: 0.85rem;
		color: var(--color-text);
	}

	.description {
		font-size: 0.7rem;
		line-height: 1.25;
		color: var(--color-text-muted);
	}
</style>
