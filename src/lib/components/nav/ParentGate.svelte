<script lang="ts">
	import { t } from '$lib/i18n';
	import IconGear from '$lib/components/icons/IconGear.svelte';

	interface Props {
		onUnlock: () => void;
	}

	let { onUnlock }: Props = $props();

	const HOLD_MS = 2000;
	let progress = $state(0);
	let holding = $state(false);
	let frame: number;
	let startedAt = 0;

	function tick() {
		const elapsed = performance.now() - startedAt;
		progress = Math.min(1, elapsed / HOLD_MS);
		if (progress >= 1) {
			cancelHold();
			onUnlock();
			return;
		}
		frame = requestAnimationFrame(tick);
	}

	function startHold() {
		holding = true;
		startedAt = performance.now();
		frame = requestAnimationFrame(tick);
	}

	function cancelHold() {
		holding = false;
		progress = 0;
		if (frame) cancelAnimationFrame(frame);
	}
</script>

<button
	class="gate touch-target"
	class:holding
	onpointerdown={startHold}
	onpointerup={cancelHold}
	onpointerleave={cancelHold}
	onpointercancel={cancelHold}
	aria-label={$t('settings.holdToEnter')}
>
	<div class="ring-wrap">
		<svg viewBox="0 0 44 44" class="ring" class:visible={holding} aria-hidden="true">
			<circle
				cx="22"
				cy="22"
				r="18"
				fill="none"
				stroke="var(--color-bg-secondary)"
				stroke-width="3.5"
			/>
			<circle
				cx="22"
				cy="22"
				r="18"
				fill="none"
				stroke="var(--color-primary)"
				stroke-width="3.5"
				stroke-linecap="round"
				stroke-dasharray={2 * Math.PI * 18}
				stroke-dashoffset={2 * Math.PI * 18 * (1 - progress)}
				transform="rotate(-90 22 22)"
			/>
		</svg>
		<div class="icon-inner" class:spinning={holding}>
			<IconGear
				size="1.4rem"
				color={holding ? 'var(--color-primary)' : 'var(--color-text-muted)'}
			/>
		</div>
	</div>
	<span class="hint">{$t('settings.holdToEnter')}</span>
</button>

<style>
	/*
	 * Deliberately recessive: this is a grown-up escape hatch sitting among the
	 * children's tiles, so it carries no card chrome and sits at low opacity. The
	 * button still spans the full width, so the tap target stays as large as it
	 * ever was — only the visual weight is reduced. Holding brings it to full
	 * strength so the progress feedback is unmistakable.
	 */
	.gate {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		background: none;
		border: none;
		border-radius: var(--radius-lg);
		padding: 0.5rem;
		min-height: var(--touch-target-min);
		width: 100%;
		cursor: pointer;
		opacity: 0.4;
		transition:
			opacity 0.2s ease,
			transform 0.1s ease;
	}

	.gate:hover,
	.gate:focus-visible {
		opacity: 0.75;
	}

	.gate.holding {
		opacity: 1;
		transform: scale(0.98);
	}

	.ring-wrap {
		position: relative;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ring {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.ring.visible {
		opacity: 1;
	}

	.icon-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.icon-inner.spinning {
		animation: rotate-gear 2s linear infinite;
	}

	@keyframes rotate-gear {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.hint {
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: var(--color-text-muted);
	}
</style>
