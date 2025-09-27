import type { Task, TaskDB } from '$lib/types/task';
import { fetchServer } from '$lib/utils/fetch';
import { getContext, setContext } from 'svelte';

interface ITaskStore {
	tasks: Task[];
	isLoading: boolean;
	fetchTasks: () => Promise<void>;
	createTask: (formData: FormData) => void;
	updateTask: (taskId: string, formData: FormData) => void;
	deleteTask: (taskId: string) => void;
	initialize: () => Promise<void>;
}

class TaskStore implements ITaskStore {
	tasks: Task[] = $state([]);
	isLoading: boolean = $state(false);
	private initialized = false;

    async initialize(): Promise<void> {
        if (!this.initialized) {
            await this.fetchTasks();
            this.initialized = true;
        }
    }

	async fetchTasks(): Promise<void> {
		try {
			const response = await fetchServer('/api/tasks/', { method: 'GET' });
			if (response.ok) {
				const tasks = await response.json();
				this.tasks = tasks.map((task: TaskDB) => ({
					...task,
					due_date: task.due_date ? new Date(task.due_date) : null
				}));
			}
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
		}
	}

	async createTask(formData: FormData): Promise<void> {
		try {
			const response = await fetchServer('/api/tasks/', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const newTask = await response.json();
				this.tasks.push({ ...newTask , due_date: newTask.due_date ? new Date(newTask.due_date) : null });
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Failed to create task with image:', error);
			throw error;
		}
	}

	async updateTaskStatus(taskId: string, status: string): Promise<void> {
		const formData = new FormData();
		formData.append('status', status);

		try {
			const response = await fetchServer(`/api/tasks/${taskId}/`, {
				method: 'PATCH',
				body: formData
			});
			if (response.ok) {
				const taskIndex = this.tasks.findIndex(task => task.id === taskId);
				const updatedTask = await response.json();
				this.tasks[taskIndex] = { ...updatedTask, due_date: updatedTask.due_date ? new Date(updatedTask.due_date) : null };
			}
		} catch (error) {
			console.error('Failed to update task status:', error);
		}
	}

	async updateTask(taskId: string, formData: FormData): Promise<void> {
        try {
            this.isLoading = true;
            
            if (!taskId) {
                throw new Error('Task ID is required for update');
            }

            const response = await fetchServer(`/api/tasks/${taskId}/`, {
                method: 'PUT',
                body: formData
            });
            
            if (response.ok) {
				const taskIndex = this.tasks.findIndex(task => task.id === taskId);
				const updatedTask = await response.json();
				this.tasks[taskIndex] = { ...updatedTask, due_date: updatedTask.due_date ? new Date(updatedTask.due_date) : null };
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

	async deleteTask(taskId: string): Promise<void> {
		try {
			const response = await fetchServer(`/api/tasks/${taskId}/`, {
				method: 'DELETE',
				body: JSON.stringify({ id: taskId })
			});
			if (response.ok) {
				this.tasks = this.tasks.filter(task => task.id !== taskId);
			}
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
		}
	}
}

const DEFAULT_KEY = 'default';

export function getTaskStore(key = DEFAULT_KEY): TaskStore {
	return getContext<TaskStore>(`taskStore_${key}`);
}

export function setTaskStore(key = DEFAULT_KEY): TaskStore {
	const store = new TaskStore();
	return setContext<TaskStore>(`taskStore_${key}`, store);
}
