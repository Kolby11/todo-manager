import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import TaskForm from './taskForm.svelte';
import { TaskStatus, type Task } from '$lib/types/task';

vi.mock('$lib/stores/taskStore.svelte', () => ({
	getTaskStore: () => ({
		createTask: vi.fn(),
		updateTask: vi.fn()
	})
}));

vi.mock('svelte-i18n', () => ({
	t: (key: string) => {
		const translations: Record<string, string> = {
			'task.fields.title.title': 'Title',
			'task.fields.description.title': 'Description',
			'task.fields.due_date.title': 'Due Date',
			'task.fields.status.title': 'Status',
			'task.fields.photo.title': 'Photo',
			'task.status.todo': 'To Do',
			'task.status.inprogress': 'In Progress',
			'task.status.done': 'Done'
		};
		return translations[key] || key;
	}
}));

vi.mock('sveltekit-superforms', () => ({
	superForm: (data: Task) => ({
		form: {
			title: data?.title || '',
			description: data?.description || '',
			due_date: data?.due_date
				? (data.due_date instanceof Date
					? data.due_date.toISOString().split('T')[0]
					: data.due_date)
				: new Date().toISOString().split('T')[0],
			status: data?.status || TaskStatus.TODO
		},
		enhance: vi.fn()
	})
}));


describe('TaskForm Component', () => {
	const mockTask: Task = {
		id: '1',
		title: 'Test Task',
		description: 'This is a test task',
		due_date: new Date('2024-12-25'),
		status: TaskStatus.TODO
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock URL functions for image preview
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
		vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
	});

	test('renders form fields correctly for new task', async () => {
		render(TaskForm, {
			target: document.body,
			props: {
				action: 'create'
			}
		});

		await expect.element(page.getByLabelText('Title')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Description')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Due Date')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Status')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Photo')).toBeInTheDocument();
	});

	test('populates form when editing existing task', async () => {
		render(TaskForm, {
			target: document.body,
			props: {
				data: mockTask,
				action: 'edit'
			}
		});

		await expect.element(page.getByLabelText('Title')).toHaveValue('Test Task');
		await expect.element(page.getByLabelText('Description')).toHaveValue('This is a test task');
		await expect.element(page.getByLabelText('Due Date')).toHaveValue('2024-12-25');
	});

	test('allows filling out form fields', async () => {
		render(TaskForm, {
			target: document.body,
			props: {
				action: 'create'
			}
		});

		const titleInput = page.getByLabelText('Title');
		const descriptionTextarea = page.getByLabelText('Description');
		const dueDateInput = page.getByLabelText('Due Date');

		await titleInput.fill('New Task Title');
		await descriptionTextarea.fill('New task description');
		await dueDateInput.fill('2024-12-31');

		await expect.element(titleInput).toHaveValue('New Task Title');
		await expect.element(descriptionTextarea).toHaveValue('New task description');
		await expect.element(dueDateInput).toHaveValue('2024-12-31');
	});

	test('handles status selection', async () => {
		render(TaskForm, {
			target: document.body,
			props: {
				action: 'create'
			}
		});

		const statusTrigger = page.getByRole('button', { name: /To Do|Status/i });
		await statusTrigger.click();

		const inProgressOption = page.getByText('In Progress');
		await inProgressOption.click();

		// FIX 1: Use toContain instead of toContainText
		await expect.element(statusTrigger).toContain('In Progress'); 
	});

	test('handles image file selection', async () => {
		render(TaskForm, {
			target: document.body,
			props: {
				action: 'create'
			}
		});

		const fileInput = page.getByLabelText('Photo');
		
		const mockFile = new File(['test content'], 'test-image.jpg', { 
			type: 'image/jpeg' 
		});

		// FIX 2: Manually set files and dispatch change event
		// Get the raw DOM element
		const inputElement = await fileInput.element();
		// Use Object.defineProperty to set the read-only 'files' property
		Object.defineProperty(inputElement, 'files', {
			value: [mockFile],
			writable: false,
		});
		// Dispatch a change event to trigger the Svelte component's onchange handler
		inputElement.dispatchEvent(new Event('change', { bubbles: true }));

		await expect.element(page.getByText(/test-image.jpg/)).toBeInTheDocument();
		await expect.element(page.getByAltText('Preview')).toBeInTheDocument();
		expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
	});

	test('handles image removal', async () => {
		render(TaskForm, { 
			target: document.body,
			props: { 
				action: 'create'
			} 
		});

		const fileInput = page.getByLabelText('Photo');
		const mockFile = new File(['test content'], 'test-image.jpg', { 
			type: 'image/jpeg' 
		});
		
		// Select the image using the fixed method
		const inputElement = await fileInput.element();
		Object.defineProperty(inputElement, 'files', { value: [mockFile], writable: false });
		inputElement.dispatchEvent(new Event('change', { bubbles: true }));

		// Verify elements are present
		const imageInfo = page.getByText(/test-image.jpg/);
		const previewImage = page.getByAltText('Preview');
		await expect.element(imageInfo).toBeInTheDocument();
		await expect.element(previewImage).toBeInTheDocument();

		// Click the remove button
		const removeButton = page.getByRole('button', { name: '×' });
		await removeButton.click();

		// Verify elements are removed
		await expect.element(imageInfo).not.toBeInTheDocument();
		await expect.element(previewImage).not.toBeInTheDocument();
		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
	});

	test('shows file size information when image is selected', async () => {
		render(TaskForm, { 
			target: document.body,
			props: { 
				action: 'create'
			} 
		});

		const fileInput = page.getByLabelText('Photo');
		
		const fileSizeInBytes = 200000;
		const content = 'x'.repeat(fileSizeInBytes);
		const mockFile = new File([content], 'large-image.jpg', { 
			type: 'image/jpeg' 
		});

		// Select the file using the fixed method
		const inputElement = await fileInput.element();
		Object.defineProperty(inputElement, 'files', { value: [mockFile], writable: false });
		inputElement.dispatchEvent(new Event('change', { bubbles: true }));

		const expectedMb = (fileSizeInBytes / 1024 / 1024).toFixed(2);
		
		await expect.element(page.getByText(`Selected: large-image.jpg (${expectedMb} MB)`)).toBeInTheDocument();
	});

	test('calls onSubmit callback when provided on submission', async () => {
		const mockOnSubmit = vi.fn();
		render(TaskForm, { 
			target: document.body,
			props: { 
				action: 'create',
				onSubmit: mockOnSubmit
			} 
		});

		// FIX 3: Click the hidden submit button (added in TaskForm.svelte)
		const submitButton = page.getByTestId('submit-button');
		await submitButton.click();

		await vi.waitFor(() => expect(mockOnSubmit).toHaveBeenCalledOnce());
	});

	test('displays different status options', async () => {
		render(TaskForm, { 
			target: document.body,
			props: { 
				action: 'create'
			} 
		});

		const statusTrigger = page.getByRole('button', { name: /To Do|Status/i });
		await statusTrigger.click();

		await expect.element(page.getByText('To Do')).toBeInTheDocument();
		await expect.element(page.getByText('In Progress')).toBeInTheDocument();
		await expect.element(page.getByText('Done')).toBeInTheDocument();
	});

	test('prevents non-image file uploads', async () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
		
		render(TaskForm, { 
			target: document.body,
			props: { 
				action: 'create'
			} 
		});

		const fileInput = page.getByLabelText('Photo');
		
		const textFile = new File(['test content'], 'test.txt', { 
			type: 'text/plain' 
		});
		
		const inputElement = await fileInput.element();
		Object.defineProperty(inputElement, 'files', { value: [textFile], writable: false });
		inputElement.dispatchEvent(new Event('change', { bubbles: true }));

		expect(alertSpy).toHaveBeenCalledWith('Please select an image file');
		
		await expect.element(page.getByText(/test.txt/)).not.toBeInTheDocument();
		
		alertSpy.mockRestore();
	});

	test('handles create vs edit modes correctly', async () => {
		// Test create mode default values
		const { unmount } = render(TaskForm, { 
			target: document.body,
			props: { 
				action: 'create'
			} 
		});

		await expect.element(page.getByLabelText('Title')).toHaveValue('');
		
		unmount();

		render(TaskForm, {
			target: document.body,
			props: {
				data: mockTask,
				action: 'edit'
			}
		});

		await expect.element(page.getByLabelText('Title')).toHaveValue('Test Task');
	});
});