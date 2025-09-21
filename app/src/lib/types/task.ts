export type TaskCategory = 'work' | 'personal' | 'shopping' | 'others';

export enum TaskStatus {
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE'
}

export type Task = {
	id: string;
	title: string;
	description?: string;
	due_date: Date | null;
	status?: TaskStatus;
	photo_url?: string;
};

export type TaskDB = {
	id: string;
	title: string;
	description: string;
	due_date: string | null;
	photo_url: string | null;
};
