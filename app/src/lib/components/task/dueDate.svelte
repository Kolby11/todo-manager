<script lang="ts">
	import { TaskStatus } from '$lib/types/task';
	import { Calendar } from '@lucide/svelte';
	import { t } from 'svelte-i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	type DueDateProps = {
		dueDate: Date;
        taskStatus?: TaskStatus
	} & HTMLAttributes<HTMLDivElement>;

	let { dueDate, taskStatus, ...rest }: DueDateProps = $props();

	let formattedDate = $derived(
		dueDate?.toLocaleDateString('sk-SK', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
		}) || ''
	);

	let isOverdue = $derived(
		dueDate && taskStatus !== TaskStatus.DONE && new Date() > dueDate
	);

	let isNearing = $derived.by(() => {
		if (!dueDate || taskStatus === TaskStatus.DONE) return false;
		
		const now = new Date();
		const timeDiff = dueDate.getTime() - now.getTime();
		const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
		
		return daysDiff > 0 && daysDiff <= 1;
	});

	let deadlineStatusText = $derived.by(() => {
		if (isOverdue) return `${$t("task.due_date.overdue")}: ${formattedDate}`;
		if (isNearing) return `${$t("task.due_date.due_soon")}: ${formattedDate}`;
		return formattedDate;
	});

	let dateTextClass = $derived.by(() => {
		if (isOverdue) return 'text-destructive font-medium';
		if (isNearing) return 'text-yellow-600 font-medium';
		return '';
	});
</script>

<div class="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50" {...rest}>
    <Calendar class="w-3 h-3" />
    <span class={dateTextClass}>
        {deadlineStatusText}
    </span>
    {#if isNearing}
        <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full ml-1" title="Due within 24 hours"></div>
    {/if}
</div>