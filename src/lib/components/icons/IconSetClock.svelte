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
	<!-- Outer clock dial -->
	<circle
		cx="20"
		cy="20"
		r="15"
		stroke-width="3"
		fill="color-mix(in srgb, currentColor 10%, transparent)"
	/>
	<circle cx="20" cy="20" r="2" fill={color} />
	<path d="M20 20V12" stroke-width="2.5" stroke-linecap="round" />
	<path d="M20 20L27 20" stroke-width="3" stroke-linecap="round" />

	<!-- Curved rotation motion hint arrow -->
	<path
		d="M28 10C32 13 34 17 33 22"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-dasharray="2 3"
	/>
	<path d="M30 8L35 10L32 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

	<!-- Friendly pointing hand / touch finger -->
	<g transform="translate(18, 16)">
		<path
			d="M10 14V6C10 4.34315 11.3431 3 13 3C14.6569 3 16 4.34315 16 6V13C16 11.9 16.9 11 18 11C19.1 11 20 11.9 20 13V15C20 14.45 20.45 14 21 14C21.55 14 22 14.45 22 15.5V20C22 24.4183 18.4183 28 14 28H12C8.68629 28 6 25.3137 6 22L6 18C6 16.3431 7.34315 15 9 15L10 15V14Z"
			fill="color-mix(in srgb, currentColor 25%, var(--color-surface, #1e293b))"
			stroke={color}
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</g>
</svg>
