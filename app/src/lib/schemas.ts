import { z } from 'zod';

export const taskSchema = z.object({
	name: z.string().min(2).default('New Task'),
	description: z.string().max(200).default('')
});

export type TaskSchema = typeof taskSchema;
