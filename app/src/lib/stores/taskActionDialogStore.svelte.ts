import type { Task } from '$lib/types/task';
import { getContext, setContext } from 'svelte';

type TaskActionDialogAction = 'create' | 'edit' | 'delete';

interface ITaskActionDialogStore {
    task?: Task;
    action: TaskActionDialogAction;
    isDialogOpen?: boolean;
    openDialog: (task?: Task, action?: TaskActionDialogAction) => void;
    closeDialog: () => void;
}

class TaskActionDialogStore implements ITaskActionDialogStore {
    task?: Task;
    action: TaskActionDialogAction;
    isDialogOpen?: boolean;

    constructor() {
        this.action = $state<TaskActionDialogAction>('create');
        this.isDialogOpen = $state<boolean>(false);
    }

    openDialog = (task?: Task, action?: TaskActionDialogAction) => {
        this.task = task;
        this.action = action || 'create';
        this.isDialogOpen = true;
    };

    closeDialog = () => {
        this.task = undefined;
        this.action = 'create';
        this.isDialogOpen = false;
    };
}

const DEFAULT_KEY = 'default';

export function getTaskActionDialogStore(key = DEFAULT_KEY): TaskActionDialogStore {
    return getContext<TaskActionDialogStore>(`taskActionDialogStore_${key}`);
}

export function setTaskActionDialogStore(key = DEFAULT_KEY): TaskActionDialogStore {
    const store = new TaskActionDialogStore();
    return setContext<TaskActionDialogStore>(`taskActionDialogStore_${key}`, store);
}
