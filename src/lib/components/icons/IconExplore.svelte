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
	<!-- Outer ring -->
	<circle
		cx="24"
		cy="24"
		r="20"
		stroke-width="3"
		fill="color-mix(in srgb, currentColor 10%, transparent)"
	/>
	<!-- Compass / Star pointers -->
	<path
		d="M24 6L28 20L42 24L28 28L24 42L20 28L6 24L20 20Z"
		stroke-width="2.5"
		fill="color-mix(in srgb, currentColor 25%, transparent)"
		stroke-linejoin="round"
	/>
	<!-- Center circle -->
	<circle cx="24" cy="24" r="3" fill={color} stroke="none" />
</svg>
