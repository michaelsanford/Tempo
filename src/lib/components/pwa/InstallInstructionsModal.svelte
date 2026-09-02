<script lang="ts">
	import { t } from '$lib/i18n';
	import IconShare from '$lib/components/icons/IconShare.svelte';
	import IconCheck from '$lib/components/icons/IconCheck.svelte';

	interface Props {
		isIos?: boolean;
		onClose: () => void;
	}

	let { isIos = false, onClose }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" onclick={handleBackdropClick} role="presentation">
	<div class="modal-content card" role="dialog" aria-modal="true" aria-labelledby="install-title">
		<h2 id="install-title" class="modal-title">
			{isIos ? $t('settings.installIosTitle') : $t('settings.installOtherTitle')}
		</h2>

		{#if isIos}
			<ol class="step-list">
				<li class="step-item">
					<span class="step-num">1</span>
					<div class="step-text">
						{$t('settings.installIosStep1')}
						<span class="icon-inline">
							<IconShare size="1.25rem" color="var(--color-primary)" />
						</span>
					</div>
				</li>
				<li class="step-item">
					<span class="step-num">2</span>
					<div class="step-text">
						{$t('settings.installIosStep2')}
					</div>
				</li>
				<li class="step-item">
					<span class="step-num">3</span>
					<div class="step-text">
						{$t('settings.installIosStep3')}
					</div>
				</li>
			</ol>
		{:else}
			<p class="generic-step">
				{$t('settings.installOtherStep')}
			</p>
		{/if}

		<button type="button" class="close-button touch-target" onclick={onClose}>
			<IconCheck size="1.25rem" color="#0c1222" />
			<span>{$t('settings.closeModal')}</span>
		</button>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		animation: fadeIn 0.15s ease-out;
	}

	.modal-content {
		width: 100%;
		max-width: 380px;
		background: var(--color-surface);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-xl);
		padding: 1.5rem;
		box-shadow: 0 12px 32px var(--color-shadow);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		animation: scaleUp 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.modal-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-text);
		text-align: center;
	}

	.step-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.step-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-text);
		line-height: 1.4;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		min-width: 1.75rem;
		background: color-mix(in srgb, var(--color-primary) 20%, var(--color-surface));
		border: 1.5px solid var(--color-primary);
		border-radius: 50%;
		color: var(--color-primary);
		font-weight: 800;
		font-size: 0.9rem;
	}

	.step-text {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.icon-inline {
		display: inline-flex;
		align-items: center;
		padding: 0.1rem 0.35rem;
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-card-border);
		border-radius: var(--radius-sm, 0.4rem);
		vertical-align: middle;
	}

	.generic-step {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-text);
		line-height: 1.5;
		text-align: center;
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: var(--radius-md);
		background: var(--color-primary);
		color: #0c1222;
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		box-shadow:
			0 4px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 6px 12px var(--color-shadow);
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	.close-button:active {
		transform: translateY(2px);
		box-shadow:
			0 2px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 3px 6px var(--color-shadow);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleUp {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
