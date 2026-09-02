<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
		filled?: boolean;
	}

	let { size = '1.5rem', color = 'var(--color-accent)', filled = true }: Props = $props();
</script>

<svg viewBox="0 0 24 24" style:width={size} style:height={size} role="img" aria-hidden="true">
	<path
		d="M12 2.5L14.9 8.4L21.4 9.3L16.7 13.9L17.8 20.4L12 17.3L6.2 20.4L7.3 13.9L2.6 9.3L9.1 8.4L12 2.5Z"
		fill={filled ? color : 'none'}
		stroke={color}
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
