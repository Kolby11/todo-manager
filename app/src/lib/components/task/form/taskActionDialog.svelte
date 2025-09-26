<script lang="ts">
	import { clsx } from 'clsx';
	import * as Dialog from '$lib/components/ui/alert-dialog/index.js';
	import TaskForm from './taskForm.svelte';
	import { t } from 'svelte-i18n';
	import type { Task } from '$lib/types/task';
	import type { Snippet } from 'svelte';

	type TaskActionDialogProps = {
        task?: Task;
        action: 'create' | 'edit' | 'delete';
        children: Snippet;
    };

	let { task, action=$bindable(), children }: TaskActionDialogProps = $props();

	let open = $state(false);

	let submitTaskForm: (() => void) | undefined = $state();

	let closeDialog = $state(() => {
		if (open) open = false;
	});

	function handleCreateClick() {
		if (submitTaskForm) {
			submitTaskForm();
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$t(`task.actions.${action}.title`)}</Dialog.Title>
		</Dialog.Header>
		
        {#if action !== 'delete'}
            <TaskForm data={task} bind:submitForm={submitTaskForm} bind:onSubmit={closeDialog} />
        {:else}
            <p class="text-center">{$t('task.actions.delete.warning')}</p>
		{/if}

		<Dialog.Footer>
			<Dialog.Cancel>{$t('actions.cancel')}</Dialog.Cancel>
			<Dialog.Action onclick={handleCreateClick}>
				{$t(`actions.${action}`)}
			</Dialog.Action>
		</Dialog.Footer>
	</Dialog.Content>
	{@render children?.()}
</Dialog.Root>