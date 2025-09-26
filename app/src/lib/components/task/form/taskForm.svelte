<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { taskSchema } from '$lib/schemas';
	import { getTaskStore } from '$lib/stores/taskStore.svelte';
	import { TaskStatus, type Task } from '$lib/types/task';
	import * as Form from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const taskStore = getTaskStore();

	let {
		data = { id: '', title: '', description: '', due_date: new Date(), status: TaskStatus.TODO },
		submitForm = $bindable(),
		onSubmit = $bindable()
	}: {
		data: Task;
		submitForm?: () => void;
		onSubmit?: () => void;
	} = $props();

	const form = superForm(data, {
		validators: zod4Client(taskSchema)
	});

	const { form: formData, enhance } = form;

	let selectedImage: File | null = $state(null);
	let imagePreviewUrl: string | null = $state(null);
	let fileInput: FileList | undefined = $state();

	function handleImageSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file');
				return;
			}

			selectedImage = file;

			// Create preview URL
			if (imagePreviewUrl) {
				URL.revokeObjectURL(imagePreviewUrl);
			}
			imagePreviewUrl = URL.createObjectURL(file);
		}
	}

	function removeImage() {
		selectedImage = null;
		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
			imagePreviewUrl = null;
		}
		if (fileInput !== undefined) {
			fileInput = undefined;
		}
	}

	async function handleSubmit() {
		try {
			debugger;
			const formDataToSend = new FormData();

			formDataToSend.append('title', $formData.title || '');
			formDataToSend.append('description', $formData.description || '');

			const dueDate = $formData.due_date;
			if (dueDate) {
				const dateString =
					dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : String(dueDate);
				formDataToSend.append('due_date', dateString);
			} else {
				formDataToSend.append('due_date', '');
			}

			formDataToSend.append('status', $formData.status || TaskStatus.TODO);

			if (selectedImage) {
				formDataToSend.append('photo', selectedImage);
			}

			await taskStore.createTask(formDataToSend);
			console.log('Submitting form with data:', Object.fromEntries(formDataToSend));

			if (onSubmit) onSubmit();
			resetForm();
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}

	function resetForm() {
		$formData.title = '';
		$formData.description = '';
		$formData.due_date = new Date();
		$formData.status = TaskStatus.TODO;

		removeImage();
	}

	submitForm = handleSubmit;

	let formElement: HTMLFormElement;

	function getStatusLabel(status?: TaskStatus): string {
		switch (status) {
			case TaskStatus.TODO:
				return 'To Do';
			case TaskStatus.IN_PROGRESS:
				return 'In Progress';
			case TaskStatus.DONE:
				return 'Done';
			default:
				return 'Select status';
		}
	}

	// Cleanup on destroy
	$effect(() => {
		return () => {
			if (imagePreviewUrl) {
				URL.revokeObjectURL(imagePreviewUrl);
			}
		};
	});
</script>

<form bind:this={formElement} method="POST" use:enhance>
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Title</Form.Label>
				<Input {...props} type="text" bind:value={$formData.title} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="due_date">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Due Date</Form.Label>
				<Input {...props} type="date" bind:value={$formData.due_date} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="status">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Status</Form.Label>
				<Select.Root type="single" name="status" bind:value={$formData.status}>
					<Select.Trigger class="w-[180px]">
						{getStatusLabel($formData.status)}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Status</Select.Label>
							{#each Object.values(TaskStatus) as status}
								<Select.Item value={status} label={getStatusLabel(status)}>
									{getStatusLabel(status)}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Image Upload Field -->
	<div class="space-y-2">
		<label
			for="photo"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Photo (optional)
		</label>

		<div class="flex flex-col space-y-2">
			<Input
				bind:files={fileInput}
				id="photo"
				name="photo"
				type="file"
				accept="image/*"
				onchange={handleImageSelect}
				class="cursor-pointer"
			/>

			{#if imagePreviewUrl}
				<div class="relative inline-block">
					<img
						src={imagePreviewUrl}
						alt="Preview"
						class="max-h-48 max-w-xs rounded-md border object-cover"
					/>
					<button
						type="button"
						onclick={removeImage}
						class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
					>
						×
					</button>
				</div>
			{/if}

			{#if selectedImage}
				<p class="text-sm text-gray-600">
					Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
				</p>
			{/if}
		</div>
	</div>
</form>
