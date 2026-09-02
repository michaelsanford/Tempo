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
	<!-- Top handle -->
	<path
		d="M19 12V8C19 6.34315 20.3431 5 22 5H26C27.6569 5 29 6.34315 29 8V12"
		stroke-width="3"
		stroke-linecap="round"
	/>

	<!-- Main Backpack Body -->
	<rect
		x="11"
		y="12"
		width="26"
		height="28"
		rx="7"
		stroke-width="3"
		fill="color-mix(in srgb, currentColor 12%, transparent)"
	/>

	<!-- Front Pocket -->
	<rect
		x="15"
		y="25"
		width="18"
		height="12"
		rx="4"
		stroke-width="2.5"
		fill="color-mix(in srgb, currentColor 20%, transparent)"
	/>

	<!-- Pocket Zipper / Badge -->
	<path d="M19 25H29" stroke-width="2.5" stroke-linecap="round" />
	<circle cx="24" cy="31" r="2" fill={color} stroke="none" />

	<!-- Little keychain star tag -->
	<path d="M37 20L40 22L39 25L36 24L34 26L35 22Z" fill={color} stroke="none" />
</svg>
