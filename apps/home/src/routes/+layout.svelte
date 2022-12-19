<script>
	import 'tutors-ui/lib/themes/tutors.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-100-800-token" shadow="none" class="h-20">
			<svelte:fragment slot="lead">
				<div class="flex space-x-4">
					<img src="logo.svg" alt="tutors logo" />
					<span class="text-2xl font-bold">Tutors</span>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
