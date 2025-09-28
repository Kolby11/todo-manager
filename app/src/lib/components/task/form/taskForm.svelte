<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { taskFormSchema } from '$lib/schemas';
	import { getTaskStore } from '$lib/stores/taskStore.svelte';
	import { TaskStatus, type Task, type TaskWithFile } from '$lib/types/task';
	import * as Form from 'formsnap';
	import { t } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import TranslatedFieldErrors from './translatedFieldErrors.svelte';
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
	} from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { urlToFile } from '$lib/utils/urlToFile';
	import { getTaskStatusColor } from '$lib/utils/getTaskStatusColor';

	let {
		data = { id: 0, title: '', description: '', due_date: new Date(), status: TaskStatus.TODO },
		action = "create",
		submitForm = $bindable(),
		onSubmit
	}: {
		data?: Task;
		action?: "create" | "edit";
		submitForm?: (fn: () => void) => void;
		onSubmit?: () => void;
	} = $props();

	const taskStore = getTaskStore();
	const dateFormatter = new DateFormatter("en-US", { dateStyle: "long" });

	let formData: TaskWithFile = $state({ ...data, photo: undefined });
	let imagePreviewUrl: string | null = $state(null);
	let placeholder: DateValue = $state(today(getLocalTimeZone()));
	let isLoadingPhoto = $state(false);

	$effect(() => {
		if (action === 'edit' && data.photo && typeof data.photo === 'string') {
			loadExistingPhoto();
		} else {
			formData = { ...data, photo: undefined };
		}
	});

	const form = superForm(formData, {
		validators: zod4Client(taskFormSchema),
		dataType: "form",
		SPA: true,
		onUpdated: handleFormSubmit
	});

	const { form: formDataProxy, enhance } = form;

	async function loadExistingPhoto() {
		if (!data.photo || typeof data.photo !== 'string') return;
		
		isLoadingPhoto = true;
		try {
			const file = await urlToFile(data.photo);
			formData = { ...data, photo: file || undefined };
			imagePreviewUrl = data.photo;
		} catch (error) {
			console.error('Error loading existing photo:', error);
			formData = { ...data, photo: undefined };
		} finally {
			isLoadingPhoto = false;
		}
	}

	async function handleFormSubmit({ form }: { form: any }) {
		if (!form.valid) return;

		try {
			const formDataToSubmit = createFormData(form.data);
			
			if (action === 'edit' && data?.id) {
				await taskStore.updateTask(data.id, formDataToSubmit);
			} else if (action === 'create') {
				await taskStore.createTask(formDataToSubmit);
			}
			
			onSubmit?.();
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}

	function createFormData(data: any): FormData {
		const formData = new FormData();
		
		Object.entries(data).forEach(([key, value]) => {
			if (value == null) return;
			
			if (key === 'due_date' && value instanceof Date) {
				formData.append(key, value.toISOString().split('T')[0]);
			} else if (key === 'photo' && value instanceof File) {
				formData.append(key, value);
			} else if (key !== 'photo') {
				formData.append(key, String(value));
			}
		});
		
		return formData;
	}

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		
		cleanupImagePreview();
		
		if (file?.type.startsWith('image/')) {
			try {
				imagePreviewUrl = URL.createObjectURL(file);
				$formDataProxy.photo = file;
			} catch (error) {
				console.error('Error creating object URL:', error);
			}
		} else {
			$formDataProxy.photo = undefined;
		}
	}

	function removeImage() {
		cleanupImagePreview();
		$formDataProxy.photo = undefined;
		
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
	}

	function cleanupImagePreview() {
		if (imagePreviewUrl?.startsWith('blob:')) {
			URL.revokeObjectURL(imagePreviewUrl);
		}
		imagePreviewUrl = null;
	}

	function handleDateChange(date: DateValue | undefined) {
		$formDataProxy.due_date = date?.toDate(getLocalTimeZone()) ?? null;
	}

	$effect(() => {
		return cleanupImagePreview;
	});

	submitForm = () => {
		document.querySelector('form')?.requestSubmit();
	};
</script>

<form method="POST" use:enhance enctype="multipart/form-data" class="space-y-1">
	<!-- Title Field -->
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{$t('task.fields.title.title')}</Form.Label>
				<Input {...props} type="text" bind:value={$formDataProxy.title} />
			{/snippet}
		</Form.Control>
		<TranslatedFieldErrors />
	</Form.Field>

	<!-- Description Field -->
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{$t('task.fields.description.title')}</Form.Label>
				<Textarea {...props} bind:value={$formDataProxy.description} />
			{/snippet}
		</Form.Control>
		<TranslatedFieldErrors />
	</Form.Field>

	<!-- Due Date Field -->
	<div class="flex flex-wrap gap-x-2 gap-y-1">
		<Form.Field {form} name="due_date">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col">
						<Form.Label>{$t('task.fields.due_date.title')}</Form.Label>
						<Popover.Root>
							<Popover.Trigger
								{...props}
								class={cn(
									buttonVariants({ variant: "outline" }),
									"w-[180px] justify-start pl-4 text-left font-normal",
									!$formDataProxy.due_date && "text-muted-foreground"
								)}
							>
								{$formDataProxy.due_date
									? dateFormatter.format($formDataProxy.due_date)
									: $t('task.fields.due_date.placeholder')}
								<CalendarIcon class="ml-auto size-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									bind:placeholder
									minValue={today(getLocalTimeZone())}
									calendarLabel={$t('task.fields.due_date.title')}
									onValueChange={handleDateChange}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>

					<TranslatedFieldErrors />
					<input 
						hidden 
						value={$formDataProxy.due_date?.toISOString().split('T')[0] || ''} 
						name={props.name} 
					/>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Status Field -->
		<Form.Field {form} name="status">
			<Form.Control>
				{#snippet children()}
				<div class="flex flex-col">

					<Form.Label>{$t('task.fields.status.title')}</Form.Label>
					<Select.Root type="single" name="status" bind:value={$formDataProxy.status}>
						<Select.Trigger class={`${getTaskStatusColor($formDataProxy.status)} w-[180px]`}>
							{$t(`task.status.${$formDataProxy.status}`)}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>{$t('task.fields.status.title')}</Select.Label>
								{#each Object.values(TaskStatus) as status}
									<Select.Item value={status} label={$t(`task.status.${status}`)} class={` ${getTaskStatusColor(status)} data-[highlighted]:${getTaskStatusColor(status)} `}>
										{$t(`task.status.${status}`)}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				{/snippet}
			</Form.Control>
			<TranslatedFieldErrors />
		</Form.Field>
	</div>

	<!-- Photo Upload Field -->
	<Form.Field {form} name="photo">
		<Form.Control>
			{#snippet children({ props })}
				<div class="space-y-2">
					<Form.Label>{$t('task.fields.photo.title')}</Form.Label>

					{#if isLoadingPhoto}
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
					{/if}

					<div class="flex flex-col space-y-2 w-fit">
						<Input
							{...props}
							type="file"
							accept="image/png, image/jpeg"
							class="cursor-pointer"
							onchange={handleFileChange}
							disabled={isLoadingPhoto}
						/>

						{#if imagePreviewUrl}
							<div class="relative inline-block mt-2">
								<img 
									src={imagePreviewUrl} 
									alt="Preview" 
									class="max-h-48 max-w-xs rounded-md border object-cover" 
								/>
								<button
									type="button"
									onclick={removeImage}
									class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-white"
									disabled={isLoadingPhoto}
									aria-label="Remove image"
								>
									×
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/snippet}
		</Form.Control>
		<TranslatedFieldErrors />
	</Form.Field>
</form>