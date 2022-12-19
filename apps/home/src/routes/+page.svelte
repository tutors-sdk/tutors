<script>
	import { GradientHeading, storeLightSwitch } from "@skeletonlabs/skeleton";
</script>
<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900 bg-opacity-90">
	<div class="container flex justify-center items-center mx-auto">
	<div class="lg:w-1/2 mx-4 my-48">
		<h1 class="font-bold text-6xl inline-block my-4">An <GradientHeading class="font-bold !text-6xl inline-block">Open Learning</GradientHeading> Web Toolkit</h1>
		<p class="font-bold !text-xl my-4">A collection of open source components & services supporting the creation of transformative learning experiences using open web standards.</p>
		<div class="space-x-4 space-y-4">
			<a class="btn btn-xl bg-primary-500 text-white font-bold" href="https://github.com/tutors-sdk/tutors" target="_blank" rel="noreferrer">View Repo</a>
			<a class="btn btn-xl bg-surface-100-800-token font-bold" href="https://docs.tutors.dev/" target="_blank" rel="noreferrer">Documentation</a>
		</div>
	</div>
	<div class="w-1/2">
			<img src={$storeLightSwitch === false ? '/tutors-reader-light.png' : '/tutors-reader-dark.png'} alt="tutors reader screenshot" />
	</div>
	</div>
</div>
<div class="container mx-auto flex justify-center items-center">
	<div class="w-full lg:w-1/2 m-4">
		<h2 class="font-bold text-6xl inline-block my-4">An <GradientHeading class="font-bold !text-6xl inline-flex">Open Learning</GradientHeading> Web Toolkit</h2>
		<p class="font-bold !text-xl my-4">A collection of open source components & services supporting the creation of transformative learning experiences using open web standards.</p>
		<div class="space-x-4 space-y-4">
			<a class="btn btn-xl bg-primary-500 font-bold" href="https://github.com/tutors-sdk/tutors" target="_blank" rel="noreferrer">View Repo</a>
			<a class="btn btn-xl bg-surface-500 font-bold" href="https://docs.tutors.dev/" target="_blank" rel="noreferrer">Documentation</a>
		</div>
	</div>
	<div class="w-1/2">
	</div>
</div>
