export type TaskCategory = 'work' | 'personal' | 'shopping' | 'others';

export type Task = {
	id: string;
	title: string;
	description?: string;
	due_date: Date | null;
	photo_url?: string;
};

export type TaskDB = {
	id: string;
	title: string;
	description: string;
	due_date: string | null;
	photo_url: string | null;
};
