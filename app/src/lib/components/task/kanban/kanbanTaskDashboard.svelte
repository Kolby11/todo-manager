<script lang="ts">
	// This is done in a single file for clarity. A more factored version here: https://svelte.dev/repl/288f827275db4054b23c437a572234f6?version=3.38.2
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Task from '$lib/components/global/task.svelte';
	import type { Task as TaskType } from '$lib/types/task';

	type ListContainerProps = {
		tasks: TaskType[];
	};

	let { tasks }: ListContainerProps = $props();

	// let columns = $derived.by(()=>{
	// 	const cols = [
	// 		{ id: 'todo', name: 'To Do', items: [] },
	// 		{ id: 'inprogress', name: 'In Progress', items: [] },
	// 		{ id: 'done', name: 'Done', items: [] }
	// 	];
	// 	for (const task of tasks) {
	// 		if (task.status === 'todo') {
	// 			cols[0].items.push(task);
	// 		} else if (task.status === 'inprogress') {
	// 			cols[1].items.push(task);
	// 		} else if (task.status === 'done') {
	// 			cols[2].items.push(task);
	// 		}
	// 	}
	// 	return cols;
	// })

	const flipDurationMs = 200;
	function handleDndConsiderColumns(e) {
		tasks = e.detail.items;
	}
	function handleDndFinalizeColumns(e) {
		tasks = e.detail.items;
	}
	function handleDndConsiderCards(cid, e) {
		const colIdx = tasks.findIndex((c) => c.id === cid);
		tasks[colIdx].items = e.detail.items;
		tasks = [...tasks];
	}
	function handleDndFinalizeCards(cid, e) {
		const colIdx = tasks.findIndex((c) => c.id === cid);
		tasks[colIdx].items = e.detail.items;
		tasks = [...tasks];
	}
	function handleClick(e) {
		alert('dragabble elements are still clickable :)');
	}
</script>

<section
	class="board"
	use:dndzone={{ items: tasks, flipDurationMs, type: 'columns' }}
	onconsider={handleDndConsiderColumns}
	onfinalize={handleDndFinalizeColumns}
>
	{#each tasks as column (column.id)}
		<div class="column" animate:flip={{ duration: flipDurationMs }}>
			<div class="column-title">{column.name}</div>
			<div
				class="column-content"
				use:dndzone={{ items: column.items, flipDurationMs }}
				onconsider={(e) => handleDndConsiderCards(column.id, e)}
				onfinalize={(e) => handleDndFinalizeCards(column.id, e)}
			>
				{#each tasks as task (task.id)}
					<Task
						{task}
						class="card"
						animate:flip={{ duration: flipDurationMs }}
						onclick={handleClick}
					/>
				{/each}
			</div>
		</div>
	{/each}
</section>

<style>
	.board {
		height: 90vh;
		width: 100%;
		padding: 0.5em;
		margin-bottom: 40px;
	}
	.column {
		height: 100%;
		width: 250px;
		padding: 0.5em;
		margin: 1em;
		float: left;
		border: 1px solid #333333;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.column-content {
		height: 100%;
		/* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
		overflow-y: scroll;
	}
	.column-title {
		margin-bottom: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card {
		height: 15%;
		width: 100%;
		margin: 0.4em 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #dddddd;
		border: 1px solid #333333;
	}
</style>
