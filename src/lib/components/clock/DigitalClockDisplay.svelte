<script lang="ts">
	import type { Time } from '$lib/types/time';
	import { formatTime } from '$lib/logic/time';

	interface Props {
		time: Time;
	}

	let { time }: Props = $props();
</script>

<div class="digital-pill">
	<span class="digital">{formatTime(time)}</span>
</div>

<style>
	.digital-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-secondary);
		border: 2px solid var(--color-card-border);
		border-radius: var(--radius-xl);
		padding: 0.35rem 1.25rem;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.3),
			0 2px 8px var(--color-shadow);
	}

	.digital {
		font-variant-numeric: tabular-nums;
		font-weight: 800;
		font-size: clamp(2rem, 9vw, 2.75rem);
		color: var(--color-primary);
		letter-spacing: 0.08em;
		text-align: center;
		text-shadow: 0 0 12px rgba(var(--color-primary-rgb), 0.35);
	}
</style>
