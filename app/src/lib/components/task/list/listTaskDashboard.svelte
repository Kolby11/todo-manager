<script lang="ts">
	import ListTaskItem from '$lib/components/task/list/listTaskItem.svelte';
	import type { Task as TaskType } from '$lib/types/task';
	import EditTaskFormDialog from '../form/editTaskFormDialog.svelte';

	type ListTaskDashboardProps = {
		tasks: TaskType[];
	};

	let { tasks }: ListTaskDashboardProps = $props();
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
