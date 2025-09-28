<script lang="ts">
	import { locale, locales, t } from 'svelte-i18n'
	import * as Select from '$lib/components/ui/select';

	function getLanguage() {
		const loc = $locale;
		if (!loc) {
		locale.set('en')
		}
		return loc || 'en';
	}

	function setLanguage(language: string) {
		locale.set(language)
	}
</script>

<Select.Root type="single" bind:value={getLanguage, setLanguage}>
	<Select.Trigger>
		<span class="capitalize">{$locale?.toUpperCase()}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{$t('controls.language.title')}</Select.Label> 
			{#each $locales as language}
				<Select.Item value={language} label={language}>
					{language.toUpperCase()}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>