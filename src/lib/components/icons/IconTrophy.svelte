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
	<!-- Trophy Cup -->
	<path
		d="M13 8H35V20C35 26.0751 30.0751 31 24 31C17.9249 31 13 26.0751 13 20V8Z"
		stroke-width="3"
		stroke-linecap="round"
		stroke-linejoin="round"
		fill="color-mix(in srgb, currentColor 15%, transparent)"
	/>

	<!-- Handles -->
	<path
		d="M13 12H9C7.34315 12 6 13.3431 6 15V18C6 21.3137 8.68629 24 12 24H13"
		stroke-width="2.5"
		stroke-linecap="round"
	/>
	<path
		d="M35 12H39C40.6569 12 42 13.3431 42 15V18C42 21.3137 39.3137 24 36 24H35"
		stroke-width="2.5"
		stroke-linecap="round"
	/>

	<!-- Stem and Base -->
	<path d="M24 31V37" stroke-width="3.5" stroke-linecap="round" />
	<path d="M14 41H34" stroke-width="3.5" stroke-linecap="round" />
	<path
		d="M17 37H31L33 41H15L17 37Z"
		fill="color-mix(in srgb, currentColor 25%, transparent)"
		stroke-width="2"
	/>

	<!-- Star on cup -->
	<path
		d="M24 13L25.5 16.5L29 17L26.5 19.5L27 23L24 21.2L21 23L21.5 19.5L19 17L22.5 16.5L24 13Z"
		fill={color}
		stroke="none"
	/>
</svg>
