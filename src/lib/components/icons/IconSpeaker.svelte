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
	<!-- Speaker body -->
	<path
		d="M11 5L6 9H2V15H6L11 19V5Z"
		stroke-width="2.2"
		stroke-linecap="round"
		stroke-linejoin="round"
		fill="currentColor"
	/>
	<!-- Sound waves -->
	<path
		d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53"
		stroke-width="2.5"
		stroke-linecap="round"
	/>
	<path
		d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
		stroke-width="2.5"
		stroke-linecap="round"
	/>
</svg>
