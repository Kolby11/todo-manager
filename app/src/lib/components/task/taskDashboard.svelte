<script lang="ts">
	import * as Dialog from '../ui/dialog';
	import ToggleSlider from '$lib/components/global/toggleSlider.svelte';
	import { Plus as PlusIcon } from '@lucide/svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import ListContainer from '$lib/components/task/list/listTaskDashboard.svelte';
	import CreateTaskFormDialog from './form/createTaskFormDialog.svelte';
	import { t } from 'svelte-i18n';
	import { getTaskStore } from '$lib/stores/taskStore.svelte';

	let activeDashboardType: 'list' | 'kanban' = $state('list');

	const taskStore = getTaskStore();

	const dashboardOptions = [
		{ label: 'List', value: 'list' },
		{ label: 'Kanban', value: 'kanban' }
	];
</script>

<div class="px-6 py-10">
	<!-- Dashboard option -->
	<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
		<ToggleSlider options={dashboardOptions} bind:value={activeDashboardType} />
		<CreateTaskFormDialog data={{ form: { name: '', email: '' } }}>
			<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
				<PlusIcon />
				{$t('task.options.create')}
			</Dialog.Trigger>
		</CreateTaskFormDialog>
	</div>
	<!-- Dashboard Content -->
	<div class="mt-2 rounded-lg border-2 p-2">
		{#if activeDashboardType === 'kanban'}
			<p>Kanban view is under construction.</p>
		{:else}
			<ListContainer tasks={taskStore.tasks} />
		{/if}
	</div>
</div>
