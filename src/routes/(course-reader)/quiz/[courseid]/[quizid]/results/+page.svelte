<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import { isLecturer } from "$lib/services/quiz";
  import type { Quiz, QuizResponse } from "$lib/services/quiz";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import QuizResults from "$lib/ui/quiz/QuizResults.svelte";

  interface Props {
    data: { course: any; lo: any; quiz: Quiz | null; responses: QuizResponse[] };
  }
  let { data }: Props = $props();

  const courseId = $derived(currentCourse.value?.courseId ?? "");
  const lecturer = $derived(isLecturer(currentCourse.value, tutorsId.value?.login));
  const studentId = $derived(tutorsId.value?.login);
</script>

<svelte:head>
  <title>{data.quiz?.title ?? "Quiz"} - Results</title>
</svelte:head>

<SecondaryNavigator lo={data?.lo} parentCourse={data.lo?.parentCourse?.properties?.parent} />

{#if !data.quiz}
  <div class="text-center py-12 text-surface-500">Quiz not found</div>
{:else}
  <div class="w-full max-w-4xl mx-auto mx-4 mt-4">
    <div class="flex items-center justify-between mb-6 mx-4">
      <h2 class="text-xl font-bold">{data.quiz.title} - Results</h2>
      <button
        class="px-3 py-1.5 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800"
        onclick={() => goto(`/quiz/${courseId}`)}
      >
        Back to Quizzes
      </button>
    </div>
    <div class="mx-4">
      <QuizResults
        quiz={data.quiz}
        responses={data.responses}
        studentId={lecturer ? undefined : studentId}
      />
    </div>
  </div>
{/if}
