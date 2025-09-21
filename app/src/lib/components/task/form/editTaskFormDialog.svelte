<script lang="ts">
	import * as Dialog from '$lib/components/ui/alert-dialog/index.js';
	import TaskForm from './taskForm.svelte';

	let { data, children } = $props();
</script>

<Dialog.Root>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit task</Dialog.Title>
		</Dialog.Header>
		<TaskForm {data} />
		<Dialog.Footer>
			<Dialog.Cancel>Cancel</Dialog.Cancel>
			<Dialog.Action>Save</Dialog.Action>
		</Dialog.Footer>
	</Dialog.Content>
	{@render children?.()}
</Dialog.Root>
