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
	<!-- Digital display card (top-left) -->
	<rect
		x="5"
		y="7"
		width="22"
		height="15"
		rx="4"
		stroke-width="2.5"
		fill="color-mix(in srgb, currentColor 18%, transparent)"
	/>
	<!-- Digital time text lines -->
	<path d="M10 14.5H13M10 11.5H13V17.5" stroke-width="2" stroke-linecap="round" />
	<circle cx="16" cy="13" r="0.8" fill={color} stroke="none" />
	<circle cx="16" cy="16" r="0.8" fill={color} stroke="none" />
	<rect x="18.5" y="11.5" width="4.5" height="6" rx="1" stroke-width="1.5" />

	<!-- Matching arrow -->
	<path
		d="M16 25C16 30 19 32 23 32"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-dasharray="2 3"
	/>
	<path d="M21 29L25 32L21 35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

	<!-- Analog clock face (bottom-right) -->
	<circle
		cx="33"
		cy="31"
		r="12"
		stroke-width="3"
		fill="color-mix(in srgb, currentColor 12%, transparent)"
	/>
	<circle cx="33" cy="31" r="1.5" fill={color} stroke="none" />
	<path d="M33 31V24" stroke-width="2.2" stroke-linecap="round" />
	<path d="M33 31L38 31" stroke-width="2.2" stroke-linecap="round" />
</svg>
