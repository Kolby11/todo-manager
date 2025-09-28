<script lang="ts">
	import { TaskStatus, type Task } from '$lib/types/task';
	import { Trash as TrashIcon, Pencil as PencilIcon } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getTaskActionDialogStore } from '$lib/stores/taskActionDialogStore.svelte';
	import DueDate from '../dueDate.svelte';

	type KanbanTaskItemProps = {
		task: Task;
	} & HTMLAttributes<HTMLDivElement>;

	let { task, ...rest }: KanbanTaskItemProps = $props();

	let taskActionDialogStore = getTaskActionDialogStore();
</script>

<div class="group flex gap-x-2 relative rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-border/80 cursor-pointer" {...rest}>
	{#if task.photo}
		<div class="mb-3">
			<div class="size-12 overflow-hidden rounded-md border" draggable="false">
				<img 
				src={task.photo} 
				loading="lazy" 
				alt="Task" 
				class="w-full h-full object-cover transition-transform" 
				/>
			</div>
		</div>
	{/if}

	<div class="w-full">
		<div class="mb-2">
			<h3 class="text-base font-semibold text-foreground leading-tight mb-1">
				{task.title}
			</h3>
			
			<div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<Button 
					size="sm" 
					variant="ghost"
					class="h-7 w-7 p-0 hover:bg-muted"
					onclick={() => taskActionDialogStore.openDialog(task, "edit")}
				>
					<PencilIcon class="w-3.5 h-3.5" />
				</Button>
				<Button 
					size="sm" 
					variant="ghost"
					class="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
					onclick={() => taskActionDialogStore.openDialog(task, "delete")}
				>
					<TrashIcon class="w-3.5 h-3.5" />
				</Button>
			</div>
		</div>

		{#if task.description}
			<p class="text-muted-foreground text-sm leading-relaxed mb-3">
				{task.description}
			</p>
		{/if}

		{#if task.due_date}
			<DueDate dueDate={task.due_date} taskStatus={task.status}/>
		{/if}
	</div>
</div>