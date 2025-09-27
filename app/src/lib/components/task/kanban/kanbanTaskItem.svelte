<script lang="ts">
	import { TaskStatus, type Task } from '$lib/types/task';
	import { Trash as TrashIcon, Pencil as PencilIcon, Calendar } from '@lucide/svelte';
	import { buttonVariants } from '../../ui/button';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getTaskActionDialogStore } from '$lib/stores/taskActionDialogStore.svelte';

	type KanbanTaskItemProps = {
		task: Task;
	} & HTMLAttributes<HTMLDivElement>;

	let { task, ...rest }: KanbanTaskItemProps = $props();

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
			<div class="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
				<Calendar class="w-3 h-3" />
				<span class={isOverdue ? 'text-destructive font-medium' : ''}>
					{#if isOverdue}
						Overdue: {formattedDate}
					{:else}
						{formattedDate}
					{/if}
				</span>
			</div>
		{/if}
	</div>
</div>