<script lang="ts">
	import type { RoutineEvent } from '$lib/types/routine';
	import { formatTime } from '$lib/logic/time';
	import { t } from '$lib/i18n';
	import IconTrash from '$lib/components/icons/IconTrash.svelte';

	interface Props {
		event: RoutineEvent;
		onEdit: () => void;
		onDelete: () => void;
		onToggle: () => void;
	}

	let { event, onEdit, onDelete, onToggle }: Props = $props();
</script>

<div class="card row">
	<button class="info touch-target" onclick={onEdit}>
		<span class="label">{event.label}</span>
		<span class="time">{formatTime(event.leaveBy)}</span>
	</button>
	<div class="actions">
		<label class="toggle">
			<input type="checkbox" checked={event.enabled} onchange={onToggle} />
		</label>
		<button class="delete touch-target" onclick={onDelete} aria-label={$t('settings.delete')}>
			<IconTrash size="1.4rem" color="var(--color-danger)" />
		</button>
	</div>
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		flex: 1;
		cursor: pointer;
	}

	.label {
		font-weight: 700;
		color: var(--color-text);
	}

	.time {
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
		font-weight: 600;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.delete {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: var(--radius-md);
		transition: background 0.15s ease;
	}

	.delete:hover {
		background: color-mix(in srgb, var(--color-danger) 15%, transparent);
	}
</style>
