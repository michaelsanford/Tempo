<script lang="ts">
	interface Props {
		/** 0 (just started) to 1 (deadline reached) */
		fraction: number;
		label: string;
		overdue?: boolean;
	}

	let { fraction, label, overdue = false }: Props = $props();
	const RADIUS = 45;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
	let dashOffset = $derived(CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, fraction))));
</script>

<div class="ring-wrap">
	<svg viewBox="0 0 100 100" class="ring" role="img" aria-label={label}>
		<circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--color-bg)" stroke-width="8" />
		<circle
			cx="50"
			cy="50"
			r={RADIUS}
			fill="none"
			stroke={overdue ? 'var(--color-danger)' : 'var(--color-primary)'}
			stroke-width="8"
			stroke-linecap="round"
			stroke-dasharray={CIRCUMFERENCE}
			stroke-dashoffset={dashOffset}
			transform="rotate(-90 50 50)"
		/>
	</svg>
	<div class="label">{label}</div>
</div>

<style>
	.ring-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(60vw, 260px);
		aspect-ratio: 1;
	}

	.ring {
		width: 100%;
		height: 100%;
	}

	.label {
		position: absolute;
		font-weight: 700;
		font-size: clamp(1rem, 5vw, 1.5rem);
		text-align: center;
		padding: 0 1rem;
	}
</style>
