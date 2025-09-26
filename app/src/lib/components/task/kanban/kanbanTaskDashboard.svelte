<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { TaskStatus, type Task as Task } from '$lib/types/task';
	import KanbanTaskItem from './kanbanTaskItem.svelte';
	import { t } from 'svelte-i18n';

	type KanbanTaskDashboardProps = {
		tasks: Task[];
	};

	let { tasks = [] }: KanbanTaskDashboardProps = $props();

	let columns: { id: string; name: string; items: Task[] }[] = $derived.by(() => {
		const cols = [
			{ id: 'todo', name: $t('task.status.todo', { default: 'To Do' }), items: [] as Task[] },
			{ id: 'inprogress', name: $t('task.status.inprogress', { default: 'In Progress' }), items: [] as Task[] },
			{ id: 'done', name: $t('task.status.done', { default: 'Done' }), items: [] as Task[] }
		];
		
		for (const task of tasks) {
			switch (task.status) {
				case TaskStatus.TODO:
					cols[0].items.push(task);
					break;
				case TaskStatus.IN_PROGRESS:
					cols[1].items.push(task);
					break;
				case TaskStatus.DONE:
					cols[2].items.push(task);
					break;
			}
		}
		return cols;
	});

	const flipDurationMs = 200;

	function handleDndConsiderItems(cid: string, e: CustomEvent<{ items: Task[] }>) {
		const colIdx = columns.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			// Create a new columns array to trigger reactivity
			const newColumns = [...columns];
			newColumns[colIdx] = { ...newColumns[colIdx], items: e.detail.items };
			columns = newColumns;
		}
	}

	function handleDndFinalizeItems(cid: string, e: CustomEvent<{ items: Task[] }>) {
		const colIdx = columns.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			// Update the column with new items
			const newColumns = [...columns];
			newColumns[colIdx] = { ...newColumns[colIdx], items: e.detail.items };
			columns = newColumns;
			
			// Update task statuses based on their new columns and create updated tasks array
			const updatedTasks = columns.flatMap(col => 
				col.items.map(task => ({
					...task,
					status: col.id === 'todo' ? TaskStatus.TODO :
						col.id === 'inprogress' ? TaskStatus.IN_PROGRESS :
						TaskStatus.DONE
				}))
			);
		}
	}
</script>

<section class="h-full w-full flex gap-2">
	{#each columns as column (column.id)}
		<div class="grow border rounded-md overflow-y-hidden flex flex-col">
			<div class="justify-center items-center py-2 flex border-b">
				<p class="text-lg font-medium">{column.name}</p>
			</div>
			<div
				class="flex-1 overflow-y-auto flex flex-col gap-2 p-2"
				use:dndzone={{ 
					items: column.items, 
					flipDurationMs,
					dropTargetStyle: {},
					transformDraggedElement: (element) => {
						element && (element.style.opacity = '0.8');
					}
				}}
				onconsider={(e) => handleDndConsiderItems(column.id, e)}
				onfinalize={(e) => handleDndFinalizeItems(column.id, e)}
			>
				{#each column.items as task (task.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<KanbanTaskItem {task} />
					</div>
				{/each}
			</div>
		</div>
	{/each}
</section>