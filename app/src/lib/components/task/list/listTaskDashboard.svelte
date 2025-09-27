<script lang="ts">
	import ListTaskItem from '$lib/components/task/list/listTaskItem.svelte';
	import type { Task } from '$lib/types/task';

	type ListTaskDashboardProps = {
		tasks: Task[];
	};

	let { tasks = [] }: ListTaskDashboardProps = $props();
</script>

<ul class="flex flex-col gap-y-2 h-full">
	{#each tasks as task (task.id)}
		<li>
			<ListTaskItem {task} />
		</li>
	{/each}
</ul>
