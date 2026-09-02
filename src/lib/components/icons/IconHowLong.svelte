<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '2.5rem', color = 'currentColor' }: Props = $props();
</script>

<svg
	viewBox="0 0 48 48"
	style:width={size}
	style:height={size}
	style:fill="none"
	style:stroke={color}
	role="img"
	aria-hidden="true"
>
	<!-- Outer Clock Frame -->
	<circle
		cx="24"
		cy="24"
		r="19"
		stroke-width="3"
		fill="color-mix(in srgb, currentColor 8%, transparent)"
	/>

	<!-- Shaded duration wedge (90 degree slice from 12 to 3) -->
	<path
		d="M24 24 L24 8 A16 16 0 0 1 40 24 Z"
		fill="color-mix(in srgb, currentColor 35%, transparent)"
		stroke={color}
		stroke-width="2"
	/>

	<!-- Center point and hands -->
	<circle cx="24" cy="24" r="2.5" fill={color} stroke="none" />
	<path d="M24 24V8" stroke-width="3" stroke-linecap="round" />
	<path d="M24 24H40" stroke-width="3" stroke-linecap="round" />

	<!-- Sweeping time arc indicator with arrow -->
	<path
		d="M12 18C14 13 18 10 23 9"
		stroke-width="2"
		stroke-linecap="round"
		stroke-dasharray="2 3"
	/>
</svg>
