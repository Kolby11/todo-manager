<script lang="ts">
	import ListTaskItem from '$lib/components/task/list/listTaskItem.svelte';
	import type { Task } from '$lib/types/task';
	import EditTaskFormDialog from '../form/editTaskFormDialog.svelte';

	type ListTaskDashboardProps = {
		tasks: Task[];
	};

	let { tasks = [] }: ListTaskDashboardProps = $props();

	let dialogAction = $state('all');

</script>

<EditTaskFormDialog data={{ form: { name: '', email: '' } }}>
	<ul class="flex flex-col gap-y-2 h-full">
		{#each tasks as task (task.id)}
			<li>
				<ListTaskItem {task} />
			</li>
		{/each}
	</ul>
</EditTaskFormDialog>
