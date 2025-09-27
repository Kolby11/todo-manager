<script lang="ts">
	import * as Dialog from '$lib/components/ui/alert-dialog/index.js';
	import TaskForm from './taskForm.svelte';
	import { t } from 'svelte-i18n';
	import type { Snippet } from 'svelte';
	import { getTaskActionDialogStore } from '$lib/stores/taskActionDialogStore.svelte';
	import { getTaskStore } from '$lib/stores/taskStore.svelte';

	type TaskActionDialogProps = {
        children?: Snippet;
    };

	let { children }: TaskActionDialogProps = $props();

	let submitTaskForm: (() => void) | undefined = $state();

	const taskStore = getTaskStore();
	const taskActionDialogStore = getTaskActionDialogStore();

	async function handleDialogAction() {
		if (taskActionDialogStore.action == 'delete') {
			await taskStore.deleteTask(taskActionDialogStore.task?.id || '');
			taskActionDialogStore.closeDialog();
		}
		else if (submitTaskForm) {
			submitTaskForm();
		}
	}
</script>

<Dialog.Root bind:open={taskActionDialogStore.isDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$t(`task.actions.${taskActionDialogStore.action}.title`)}</Dialog.Title>
		</Dialog.Header>
		
        {#if taskActionDialogStore.action !== 'delete'}
            <TaskForm data={taskActionDialogStore.task} action={taskActionDialogStore.action} bind:submitForm={submitTaskForm} bind:onSubmit={taskActionDialogStore.closeDialog} />
        {:else}
            <p class="text-center">{@html $t('task.actions.delete.warning')}</p>
		{/if}

		<Dialog.Footer>
			<Dialog.Cancel>{$t('actions.cancel')}</Dialog.Cancel>
			<Dialog.Action type="submit" data-testid="submit-button" onclick={handleDialogAction}>
				{$t(`actions.${taskActionDialogStore.action}`)}
			</Dialog.Action>
		</Dialog.Footer>
	</Dialog.Content>
	{@render children?.()}
</Dialog.Root>