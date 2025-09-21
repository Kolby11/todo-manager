<script lang="ts">
	import type { Page } from '$lib/types/page';
	import ThemeSelection from './themeSelection.svelte';

	type NavbarProps = {
		pages: Page[];
	};

	let { pages = [] }: NavbarProps = $props();
</script>

<nav class="bg-background-secondary flex h-16 w-full items-center justify-start border-b px-4">
	<div class="flex items-center space-x-4">
		<a href="/" class="text-xl font-semibold text-foreground">Todo Manager</a>
	</div>
	<!-- <div class="ml-16 flex items-center gap-x-4">
		{#each pages as page}
			<a href={page.href} class="text-foreground">{page.title}</a>
		{/each}
	</div> -->
	<div class="ml-auto">
		<ThemeSelection />
	</div>
</nav>
