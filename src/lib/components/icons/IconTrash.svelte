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
	<path d="M3 6H21" stroke-width="2.2" stroke-linecap="round" />
	<path
		d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6"
		stroke-width="2.2"
		stroke-linecap="round"
	/>
	<path
		d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
		stroke-width="2.2"
		stroke-linecap="round"
	/>
	<line x1="10" y1="11" x2="10" y2="17" stroke-width="2" stroke-linecap="round" />
	<line x1="14" y1="11" x2="14" y2="17" stroke-width="2" stroke-linecap="round" />
</svg>
