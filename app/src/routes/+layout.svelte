<script lang="ts">
	import '../app.css';

	import '$lib/i18n';
	import favicon from '$lib/assets/favicon.svg';
	import { setTaskStore } from '$lib/stores/taskStore.svelte';
	import { onMount } from 'svelte';

	const taskStore = setTaskStore();
    
    onMount(async () => {
        await taskStore.initialize();
    });

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
