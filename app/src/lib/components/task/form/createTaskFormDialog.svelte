<script lang="ts">
	import * as Dialog from '$lib/components/ui/alert-dialog/index.js';
	import TaskForm from './taskForm.svelte';
	import { t } from 'svelte-i18n';
	let { data, children } = $props();
</script>

<Dialog.Root>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$t('task.options.create')}</Dialog.Title>
		</Dialog.Header>
		<TaskForm {data} />
		<Dialog.Footer>
			<Dialog.Cancel>{$t('options.cancel')}</Dialog.Cancel>
			<Dialog.Action>{$t('options.create')}</Dialog.Action>
		</Dialog.Footer>
	</Dialog.Content>
	{@render children?.()}
</Dialog.Root>
