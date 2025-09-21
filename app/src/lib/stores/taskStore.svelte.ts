import type { Task, TaskDB } from '$lib/types/task';
import { fetchServer } from '$lib/utils/fetch';
import { getContext, onMount, setContext } from 'svelte';

interface ITaskStore {
	tasks: Task[];
	isLoading: boolean;
	fetchTask: () => Promise<void>;
	createTask: (task: Task) => void;
	updateTask: (updatedTask: Task) => void;
	deleteTask: (taskId: string) => void;
}

class TaskStore implements ITaskStore {
	tasks: Task[] = $state([]);
	isLoading: boolean = $state(false);

	constructor() {
		onMount(() => {
			this.fetchTask();
		});
	}

	async fetchTask(): Promise<void> {
		try {
			const response = await fetchServer('/api/tasks', { method: 'GET' });
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

	async createTask(task: Task): Promise<void> {
		try {
			const response = await fetchServer('/api/tasks', {
				method: 'POST',
				body: JSON.stringify(task)
			});
			if (response.ok) {
				const tasks = await response.json();
				this.tasks = tasks;
			}
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
		}
	}

	async updateTask(updatedTask: Task): Promise<void> {
		try {
			const response = await fetchServer('/api/tasks', {
				method: 'PUT',
				body: JSON.stringify(updatedTask)
			});
			if (response.ok) {
				const tasks = await response.json();
				this.tasks = tasks;
			}
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
		}
	}

	async deleteTask(taskId: string): Promise<void> {
		try {
			const response = await fetchServer('/api/tasks', {
				method: 'DELETE',
				body: JSON.stringify({ id: taskId })
			});
			if (response.ok) {
				const tasks = await response.json();
				this.tasks = tasks;
			}
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
		}
	}
}

const DEFAULT_KEY = 'default';

export function getTaskStore(key = DEFAULT_KEY): TaskStore {
	return getContext<TaskStore>(key);
}

export function setTaskStore(key = DEFAULT_KEY): TaskStore {
	const store = new TaskStore();
	return setContext<TaskStore>(key, store);
}
