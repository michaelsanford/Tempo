<script lang="ts">
	import IconStar from '$lib/components/icons/IconStar.svelte';

	interface Props {
		levelLabel: string;
		starsThisSession: number;
	}

	let { levelLabel, starsThisSession }: Props = $props();
</script>

<div class="header">
	<span class="level-badge">{levelLabel}</span>
	<div class="stars-badge">
		<IconStar size="1.25rem" color="var(--color-accent)" />
		<span class="stars-count">{starsThisSession}</span>
	</div>
</div>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0.25rem;
	}

	.level-badge {
		font-weight: 700;
		font-size: 0.85rem;
		color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
		border: 1.5px solid var(--color-primary);
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
	}

	.stars-badge {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 15%, var(--color-surface));
		border: 1.5px solid var(--color-accent);
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
	}

	.stars-count {
		font-variant-numeric: tabular-nums;
	}
</style>
