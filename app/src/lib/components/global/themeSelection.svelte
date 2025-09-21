<script lang="ts">
	import { THEME, theme } from '$lib/stores/themeStore';
	import { Sun, Moon } from '@lucide/svelte';
	import { t } from 'svelte-i18n';

	type ThemeSelectionProps = {
		class?: string;
	};

	const { class: className = '' }: ThemeSelectionProps = $props();

	function toggleDarkMode() {
		theme.update((current) => (current === THEME.light ? THEME.dark : THEME.light));
	}
</script>

<button
	class="focus-outline relative flex size-6 items-center justify-center"
	onclick={toggleDarkMode}
	aria-label={$t('controls.theme.toggle')}
>
	<div
		style="font-size:larger;"
		class={`${$theme === 'dark' ? 'opacity-100' : 'opacity-0'} absolute inset-0 transition duration-300`}
	>
		<Moon />
	</div>
	<div
		style="font-size:larger;"
		class={`${$theme === 'dark' ? 'opacity-0' : 'opacity-100'} absolute inset-0 transition duration-300`}
	>
		<Sun />
	</div>
</button>
