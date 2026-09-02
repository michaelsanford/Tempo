<script lang="ts">
	interface Props {
		onclick: () => void;
		disabled?: boolean;
		state?: 'default' | 'correct' | 'incorrect';
		children?: import('svelte').Snippet;
	}

	let { onclick, disabled = false, state = 'default', children }: Props = $props();
</script>

<button
	class="choice touch-target"
	class:correct={state === 'correct'}
	class:incorrect={state === 'incorrect'}
	{onclick}
	{disabled}
>
	{@render children?.()}
</button>

<style>
	.choice {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem;
		min-height: 5.5rem;
		border-radius: var(--radius-lg);
		border: 2.5px solid var(--color-primary);
		background: var(--color-surface);
		cursor: pointer;
		font-size: clamp(1.2rem, 5.5vw, 1.6rem);
		font-weight: 800;
		color: var(--color-text);
		box-shadow:
			0 4px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 6px 14px var(--color-shadow);
		transition:
			transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.12s ease,
			border-color 0.2s ease,
			background 0.2s ease;
	}

	.choice:active:not(:disabled) {
		transform: translateY(3px);
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 3px 6px var(--color-shadow);
	}

	.choice.correct {
		border-color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 20%, var(--color-surface));
		box-shadow:
			0 4px 0 color-mix(in srgb, var(--color-success) 60%, black),
			0 0 20px rgba(52, 211, 153, 0.35);
		transform: scale(1.02);
	}

	.choice.incorrect {
		border-color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 20%, var(--color-surface));
		box-shadow:
			0 4px 0 color-mix(in srgb, var(--color-danger) 60%, black),
			0 4px 10px var(--color-shadow);
		animation: shake 0.35s ease;
	}

	.choice:disabled {
		cursor: default;
		opacity: 0.8;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20%,
		60% {
			transform: translateX(-4px);
		}
		40%,
		80% {
			transform: translateX(4px);
		}
	}
</style>
