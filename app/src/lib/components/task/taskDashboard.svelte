<script lang="ts">
	import * as Dialog from '../ui/dialog';
	import ToggleSlider from '$lib/components/global/toggleSlider.svelte';
	import { Plus as PlusIcon } from '@lucide/svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import ListContainer from '$lib/components/task/list/listTaskDashboard.svelte';
	import CreateTaskFormDialog from './form/createTaskFormDialog.svelte';
	import { t } from 'svelte-i18n';
	import { getTaskStore } from '$lib/stores/taskStore.svelte';
	import KanbanTaskDashboard from './kanban/kanbanTaskDashboard.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import TaskActionDialog from './form/taskActionDialog.svelte';

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();

	let activeDashboardType: 'list' | 'kanban' = $state('list');

	const taskStore = getTaskStore();

	const dashboardOptions = [
		{ label: 'List', value: 'list' },
		{ label: 'Kanban', value: 'kanban' }
	];
</script>

<div  {...rest} class={cn('px-6 mt-auto', rest.class)}>
	<TaskActionDialog task={undefined} action={'create'} />
	<!-- Dashboard option -->
	<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
		<ToggleSlider options={dashboardOptions} bind:value={activeDashboardType} />
		<CreateTaskFormDialog data={{ form: { name: '', email: '' } }}>
			<Dialog.Trigger class={buttonVariants({ variant: 'default' })} onclick={() => {
				console.log('Create task clicked');
			}}>
				<PlusIcon />
				{$t('task.actions.create.title')}
			</Dialog.Trigger>
		</CreateTaskFormDialog>
	</div>
	<!-- Dashboard Content -->
	<div class="mt-2 rounded-lg border-2 p-2 h-[80vh] overflow-y-auto">
		{#if activeDashboardType === 'kanban'}
		<KanbanTaskDashboard tasks={taskStore.tasks} />
		{:else}
		<ListContainer tasks={taskStore.tasks} />
		{/if}
	</div>
	<TaskActionDialog />
</div>
