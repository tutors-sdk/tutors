<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import { isLecturer } from "$lib/services/quiz";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import QuizCreator from "$lib/ui/quiz/QuizCreator.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  const courseId = $derived(currentCourse.value?.courseId ?? "");
  const lecturer = $derived(isLecturer(currentCourse.value, tutorsId.value?.login));

  $effect(() => {
    if (courseId && !lecturer) {
      goto(`/quiz/${courseId}`);
    }
  });
</script>

<svelte:head>
  <title>Create Quiz</title>
</svelte:head>

<SecondaryNavigator lo={data?.lo} parentCourse={data.lo?.parentCourse?.properties?.parent} />
{#if lecturer}
  <div class="w-full max-w-4xl mx-auto">
    <QuizCreator />
  </div>
{/if}
