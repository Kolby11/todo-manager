import { z } from 'zod';
import { TaskStatus } from './types/task';

export const taskSchema = z.object({
	id: z.string().uuid().optional(),
	title: z.string().min(2).default('New Task'),
	description: z.string().max(200).default(''),
	due_date: z.date().optional().nullable(),
	status: z.enum(TaskStatus).default(TaskStatus.TODO),
});

export type TaskSchema = typeof taskSchema;
