<script lang="ts">
	import { TaskStatus, type Task } from '$lib/types/task';
	import { Trash as TrashIcon, Pencil as PencilIcon, Calendar } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getTaskActionDialogStore } from '$lib/stores/taskActionDialogStore.svelte';
	import TaskStatusBadge from './taskStatusBadge.svelte';

	type ListTaskItemProps = {
		task: Task;
	} & HTMLAttributes<HTMLDivElement>;

	let { task, ...rest }: ListTaskItemProps = $props();

	let taskActionDialogStore = getTaskActionDialogStore();

	let formattedDate = $derived(
		task.due_date?.toLocaleDateString('sk-SK', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
		}) || ''
	);

	let isOverdue = $derived(
		task.due_date && task.status !== TaskStatus.DONE && new Date() > task.due_date
	);
</script>

<div class="group relative flex gap-x-2 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-border/80" {...rest}>
	{#if task.photo}
		<div class="flex-shrink-0">
			<div class="size-12 overflow-hidden rounded-lg border" draggable="false">
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
		<div class="flex items-start justify-between gap-3 mb-2">
			<div class="flex justify-center items-center gap-x-4">
				<h4 class="text-lg font-semibold text-foreground leading-tight truncate">
					{task.title}
				</h4>
				<TaskStatusBadge status={task.status}/>
			</div>

			<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<Button 
					size="sm" 
					variant="ghost"
					class="h-8 w-8 p-0 hover:bg-muted"
					onclick={() => taskActionDialogStore.openDialog(task, "edit")}
				>
					<PencilIcon class="w-4 h-4" />
				</Button>
				<Button 
					size="sm" 
					variant="ghost"
					class="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
					onclick={() => taskActionDialogStore.openDialog(task, "delete")}
				>
					<TrashIcon class="w-4 h-4" />
				</Button>
			</div>
		</div>

		{#if task.description}
			<p class="text-muted-foreground text-sm leading-relaxed mb-3">
				{task.description}
			</p>
		{/if}

		{#if task.due_date}
			<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
				<Calendar class="w-3.5 h-3.5" />
				<span class={isOverdue ? 'text-destructive font-medium' : ''}>
					{#if isOverdue}
						Overdue: {formattedDate}
					{:else}
						Due: {formattedDate}
					{/if}
				</span>
			</div>
		{/if}
	</div>
</div>