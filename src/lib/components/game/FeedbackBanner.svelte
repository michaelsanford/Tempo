<script lang="ts">
	import { t } from '$lib/i18n';
	import IconCheck from '$lib/components/icons/IconCheck.svelte';

	interface Props {
		correct: boolean;
	}

	let { correct }: Props = $props();
</script>

<div class="banner" class:correct role="status">
	{#if correct}
		<IconCheck size="1.75rem" color="var(--color-success)" />
		<span>{$t('game.correct')}</span>
	{:else}
		<span>{$t('game.tryAgain')}</span>
	{/if}
</div>

<style>
	.banner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		text-align: center;
		font-size: clamp(1.2rem, 5.5vw, 1.6rem);
		font-weight: 800;
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-danger) 18%, var(--color-surface));
		border: 2px solid var(--color-danger);
		color: var(--color-danger);
		box-shadow: 0 4px 12px var(--color-shadow);
		animation: pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.banner.correct {
		background: color-mix(in srgb, var(--color-success) 20%, var(--color-surface));
		border-color: var(--color-success);
		color: var(--color-success);
		box-shadow: 0 0 20px rgba(52, 211, 153, 0.25);
	}

	@keyframes pop-in {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
