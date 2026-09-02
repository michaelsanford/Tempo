<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '1.5rem', color = '#f97316' }: Props = $props();
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
	<!-- Outer flame -->
	<path
		d="M12 2C10 6 7 8 7 13C7 16.866 10.134 20 14 20C17.866 20 21 16.866 21 13C21 7.5 16 4 15 2C15 5 13 6 12 2Z"
		fill={color}
		stroke={color}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<!-- Inner flame highlight -->
	<path
		d="M14 11C13 13 11 14 11 16.5C11 18.433 12.567 20 14.5 20C16.433 20 18 18.433 18 16.5C18 13.5 15.5 12 15 11C15 12.5 14.5 13 14 11Z"
		fill="#fef08a"
		stroke="none"
	/>
</svg>
