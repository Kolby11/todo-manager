<script lang="ts">
	import { TaskStatus} from '$lib/types/task';
	import { Check, Clock } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { t } from 'svelte-i18n';

	type TaskStatusBadgeProps = {
		status?: TaskStatus;
	} & HTMLAttributes<HTMLDivElement>;

	let { status = TaskStatus.TODO }: TaskStatusBadgeProps = $props();


	let statusBadgeVariant = $derived(() => {
		switch (status) {
			case TaskStatus.TODO:
				return 'secondary';
			case TaskStatus.IN_PROGRESS:
				return 'default';
			case TaskStatus.DONE:
				return 'default';
			default:
				return 'secondary';
		}
	});

	let statusBadgeExtraClasses = $derived(() => {
		if (status === TaskStatus.DONE) {
			return 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/20 dark:text-green-300';
		}
		return '';
	});

	let statusIconData = $derived(() => {
		switch (status) {
			case TaskStatus.TODO:
				return { component: Clock };
			case TaskStatus.IN_PROGRESS:
				return { component: Clock };
			case TaskStatus.DONE:
				return { component: Check };
			default:
				return { component: Clock };
		}
	});
</script>

<Badge variant={statusBadgeVariant()} class={`gap-1 ${statusBadgeExtraClasses()}`}>
    {@const IconComponent = statusIconData().component}
    <IconComponent class="w-3 h-3" />
    {$t(`task.status.${status}`)}
</Badge>
