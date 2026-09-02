<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '2rem', color = 'currentColor' }: Props = $props();
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
		r="10"
		stroke-width="2.2"
		fill="color-mix(in srgb, currentColor 10%, transparent)"
	/>
	<circle cx="12" cy="12" r="6" stroke-width="2" />
	<circle cx="12" cy="12" r="2.5" fill={color} stroke="none" />
</svg>
