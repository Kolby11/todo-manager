<script lang="ts">
	import ListTaskItem from '$lib/components/task/list/listTaskItem.svelte';
	import type { Task } from '$lib/types/task';

	type ListTaskDashboardProps = {
		tasks: Task[];
	};

	let { tasks = [] }: ListTaskDashboardProps = $props();

	let sortedTasks = $derived([...tasks].sort((a, b) => {
		if (!a.due_date && !b.due_date) return 0;
		if (!a.due_date) return 1;
		if (!b.due_date) return -1;
		
		const dateA = new Date(a.due_date);
		const dateB = new Date(b.due_date);
		
		return dateA.getTime() - dateB.getTime();
	}))
</script>

<ul class="flex flex-col gap-y-2 h-full">
	{#each sortedTasks as task (task.id)}
		<li>
			<ListTaskItem {task} />
		</li>
	{/each}
</ul>