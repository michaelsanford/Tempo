<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '1.5rem', color = 'currentColor' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	style:width={size}
	style:height={size}
	style:fill="none"
	style:stroke={color}
	role="img"
	aria-hidden="true"
>
	<circle
		cx="12"
		cy="12"
		r="9.5"
		stroke-width="2"
		fill="color-mix(in srgb, currentColor 10%, transparent)"
	/>
	<path d="M12 7V12L15.5 14" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
	<circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
</svg>
