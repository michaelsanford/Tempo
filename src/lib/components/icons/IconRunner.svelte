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
	<!-- Head -->
	<circle cx="14" cy="5" r="2.5" fill={color} stroke="none" />
	<!-- Body & limbs -->
	<path
		d="M12 8L9 13L13 14L11 21"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M7 11L12 8L16 11L20 9"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path d="M13 14L17 18L19 17" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
