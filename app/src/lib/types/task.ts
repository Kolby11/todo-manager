export type TaskCategory = 'work' | 'personal' | 'shopping' | 'others';

export enum TaskStatus {
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE'
}

export type Task = {
	id: number;
	title: string;
	description?: string;
	due_date: Date | null;
	status?: TaskStatus;
	photo?: string;
};

export type TaskWithFile = Omit<Task, "photo"> & {
	photo?: File
}

export type TaskDB = {
	id: number;
	title: string;
	description: string;
	due_date: string | null;
	status: TaskStatus | null;
	photo: string | null;
};
