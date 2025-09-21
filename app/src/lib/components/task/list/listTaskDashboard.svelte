<script lang="ts">
	import Task from '$lib/components/global/task.svelte';
	import type { Task as TaskType } from '$lib/types/task';
	import EditTaskFormDialog from '../form/editTaskFormDialog.svelte';

	type ListContainerProps = {
		tasks: TaskType[];
	};

	let { tasks }: ListContainerProps = $props();
</script>

<EditTaskFormDialog data={{ form: { name: '', email: '' } }}>
	<ul class="flex flex-col gap-y-2">
		{#each tasks as task (task.id)}
			<li>
				<Task {task} />
			</li>
		{/each}
	</ul>
</EditTaskFormDialog>
