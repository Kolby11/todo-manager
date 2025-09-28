import { z } from 'zod';
import { TaskStatus } from './types/task';

export const taskDataSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(2, { message: 'task.fields.title.errors.required' }).default('New Task'),
	description: z.string().max(200).default(''),
	due_date: z.date().min(new Date().setHours(0, 0, 0, 0), { message: 'task.fields.due_date.errors.due_date_in_past' }).optional().nullable(),
	status: z.enum(TaskStatus).default(TaskStatus.TODO),
	photo: z.string().optional()
});

export const taskFormSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(2, { message: 'task.fields.title.errors.required' }),
	description: z.string().max(200).default(''),
	due_date: z.date().min(new Date().setHours(0, 0, 0, 0), { message: 'task.fields.due_date.errors.due_date_in_past' }).optional().nullable(),
	status: z.enum(TaskStatus).default(TaskStatus.TODO),
	photo: z.union([z.instanceof(File).refine((file) => file.size <= 1_000_000, {
		message: "File size should be less than 1MB"
	}).refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
		message: "task.fields.photo.errors.invalid_image_type"
	}), z.undefined()]).optional()
});

export type TaskData = z.infer<typeof taskDataSchema>;
export type TaskForm = z.infer<typeof taskFormSchema>;

export const taskSchema = taskFormSchema;
export type TaskSchema = typeof taskSchema;