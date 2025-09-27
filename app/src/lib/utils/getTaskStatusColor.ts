import { TaskStatus } from "$lib/types/task";

export function getTaskStatusColor(status?: string): string {
    switch (status) {
        case TaskStatus.TODO:
            return 'text-blue-400';
        case TaskStatus.IN_PROGRESS:
            return 'text-yellow-400';
        case TaskStatus.DONE:
            return 'text-green-400';
        default:
            return 'text-gray-400';
    }
}