<script lang="ts">
	import Navbar from '$lib/components/global/navbar.svelte';
	import TaskDashboard from '$lib/components/task/taskDashboard.svelte';

	const pages = [{ title: 'Dashboard', href: '/' }];
</script>

<div class="text-text h-screen bg-background">
	<Navbar {pages} />
	<main class="h-[calc(100vh-4rem)]">
		<TaskDashboard class="h-full pt-10" />
	</main>
</div>
