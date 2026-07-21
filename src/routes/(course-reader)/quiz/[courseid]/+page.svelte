<script lang="ts">
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import QuizDashboard from "$lib/ui/quiz/QuizDashboard.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Quizzes</title>
</svelte:head>

<SecondaryNavigator lo={data?.lo} parentCourse={data.lo?.parentCourse?.properties?.parent} />
<div class="w-full max-w-4xl mx-auto">
  <QuizDashboard />
</div>
