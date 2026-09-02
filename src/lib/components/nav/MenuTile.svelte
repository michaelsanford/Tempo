<script lang="ts">
	interface Props {
		href: string;
		label: string;
		color?: string;
		bgGradient?: string;
		icon?: import('svelte').Snippet;
		emoji?: string;
	}

	let { href, label, color = 'var(--color-primary)', bgGradient, icon, emoji }: Props = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- href is always pre-resolved by the caller via $app/paths resolve() -->
<a
	class="tile touch-target"
	{href}
	style:--tile-color={color}
	style:--tile-bg-gradient={bgGradient ??
		`linear-gradient(150deg, color-mix(in srgb, ${color} 22%, var(--color-surface)), var(--color-surface))`}
>
	<div class="icon-wrap" style:color>
		{#if icon}
			{@render icon()}
		{:else if emoji}
			<span class="emoji" aria-hidden="true">{emoji}</span>
		{/if}
	</div>
	<span class="label">{label}</span>
</a>

<style>
	.tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		text-decoration: none;
		color: var(--color-text);
		background: var(--tile-bg-gradient);
		border: 3px solid var(--tile-color);
		border-radius: var(--radius-xl);
		padding: 0.85rem 0.4rem 0.65rem;
		min-height: 8.5rem;
		text-align: center;
		box-shadow:
			0 5px 0 color-mix(in srgb, var(--tile-color) 60%, black),
			0 10px 20px var(--color-shadow);
		transition:
			transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.12s ease;
	}

	.tile:active {
		transform: translateY(3px);
		box-shadow:
			0 2px 0 color-mix(in srgb, var(--tile-color) 60%, black),
			0 4px 10px var(--color-shadow);
	}

	.icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(4.5rem, 18vw, 5.25rem);
		height: clamp(4.5rem, 18vw, 5.25rem);
		background: color-mix(in srgb, var(--tile-color) 20%, transparent);
		border-radius: 50%;
		border: 2px solid color-mix(in srgb, var(--tile-color) 35%, transparent);
		box-shadow: 0 4px 14px color-mix(in srgb, var(--tile-color) 25%, transparent);
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35));
		transition: transform 0.15s ease;
	}

	.tile:active .icon-wrap {
		transform: scale(0.95);
	}

	.emoji {
		font-size: clamp(2.8rem, 13vw, 3.5rem);
		line-height: 1;
	}

	.label {
		font-size: clamp(0.72rem, 2.6vw, 0.82rem);
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--color-text-muted);
		background: color-mix(in srgb, var(--color-bg) 65%, transparent);
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--tile-color) 25%, transparent);
		max-width: 95%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
