<script lang="ts">
	import '../app.css';

	import '$lib/i18n';
	import favicon from '$lib/assets/favicon.svg';
	import { setTaskStore } from '$lib/stores/taskStore.svelte';

	setTaskStore();

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
