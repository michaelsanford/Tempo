<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '1.5rem', color = '#fbbf24' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	style:width={size}
	style:height={size}
	style:fill="none"
	role="img"
	aria-hidden="true"
>
	<!-- Ribbon tails -->
	<path d="M7 2L10 9L6 10L7 2Z" fill="#3b82f6" />
	<path d="M17 2L14 9L18 10L17 2Z" fill="#ef4444" />
	<path d="M12 2L10 9H14L12 2Z" fill="#10b981" />

	<!-- Medal disc -->
	<circle cx="12" cy="14" r="7.5" fill={color} stroke="#d97706" stroke-width="1.5" />
	<circle
		cx="12"
		cy="14"
		r="5"
		fill="none"
		stroke="#d97706"
		stroke-width="1"
		stroke-dasharray="1 1.5"
	/>

	<!-- Star in center -->
	<path
		d="M12 11L13 13.5L15.5 13.8L13.7 15.5L14.2 18L12 16.7L9.8 18L10.3 15.5L8.5 13.8L11 13.5L12 11Z"
		fill="#d97706"
	/>
</svg>
