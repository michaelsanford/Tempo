<script lang="ts">
	import type { LocaleMeta } from '$lib/i18n/locales';
	import IconFlagCanada from './IconFlagCanada.svelte';
	import IconFlagQuebec from './IconFlagQuebec.svelte';
	import IconFlagFrance from './IconFlagFrance.svelte';
	import IconFlagChina from './IconFlagChina.svelte';
	import IconFlagIndia from './IconFlagIndia.svelte';

	interface Props {
		flagType: LocaleMeta['flagType'];
		size?: string;
	}

	let { flagType, size = '1.75rem' }: Props = $props();

	const FLAGS = {
		canada: IconFlagCanada,
		quebec: IconFlagQuebec,
		france: IconFlagFrance,
		china: IconFlagChina,
		india: IconFlagIndia
	} as const;

	let Flag = $derived(FLAGS[flagType]);
</script>

<Flag {size} />
