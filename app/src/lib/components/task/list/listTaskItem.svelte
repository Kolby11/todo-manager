<script lang="ts">
	import ListTaskItem from './listTaskItem.svelte';
	import * as Dialog from '../../ui/dialog';
	import type { Task } from '$lib/types/task';
	import { Trash as TrashIcon, Pencil as PencilIcon } from '@lucide/svelte';
	import { buttonVariants } from '../../ui/button';
	import type { HTMLAttributes } from 'svelte/elements';

	type ListTaskItemProps = {
		task: Task;
	} & HTMLAttributes<HTMLDivElement>;

	let { task, ...rest }: ListTaskItemProps = $props();

	let formattedDate = $derived(
		task.due_date
			? task.due_date.toLocaleDateString('sk-SK', {
					month: '2-digit',
					day: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			: ''
	);
</script>

<div class="gap-2 rounded-md border-2 p-2" {...rest}>
	<div class="flex justify-between">
		<h3 class="text-lg font-semibold">
			{task.title}
		</h3>
		<p class="text-muted-foreground">{formattedDate}</p>
	</div>
	<div class="flex justify-between">
		<div>
			<p class="text-muted-foreground">{task.description}</p>
		</div>
		<div>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
				<PencilIcon />
			</Dialog.Trigger>
			<button class={buttonVariants({ variant: 'destructive', size: 'sm' })}><TrashIcon /></button>
		</div>
	</div>
</div>
