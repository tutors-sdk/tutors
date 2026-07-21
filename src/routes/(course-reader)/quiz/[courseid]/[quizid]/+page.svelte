<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import { isLecturer, createSession, getActiveSession } from "$lib/services/quiz";
  import type { Quiz, QuizSession } from "$lib/services/quiz";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import QuizCreator from "$lib/ui/quiz/QuizCreator.svelte";
  import QuizAsync from "$lib/ui/quiz/QuizAsync.svelte";

  interface Props {
    data: { course: any; lo: any; quiz: Quiz | null };
  }
  let { data }: Props = $props();

  const courseId = $derived(currentCourse.value?.courseId ?? "");
  const lecturer = $derived(isLecturer(currentCourse.value, tutorsId.value?.login));

  let activeSession = $state<QuizSession | null>(null);

  $effect(() => {
    if (courseId) {
      getActiveSession(courseId).then((s) => {
        activeSession = s;
      });
    }
  });

  async function handleStartSession() {
    if (!data.quiz) return;
    const session = await createSession(data.quiz.id, courseId, tutorsId.value!.login);
    if (session) {
      goto(`/quiz/${courseId}/live/${session.id}`);
    }
  }
</script>

<svelte:head>
  <title>{data.quiz?.title ?? "Quiz"}</title>
</svelte:head>

<SecondaryNavigator lo={data?.lo} parentCourse={data.lo?.parentCourse?.properties?.parent} />

{#if !data.quiz}
  <div class="text-center py-12 text-surface-500">Quiz not found</div>
{:else if lecturer}
  <div class="w-full max-w-4xl mx-auto">
    <div class="mx-4 mt-4 flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">{data.quiz.title}</h2>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800"
          onclick={() => goto(`/quiz/${courseId}/${data.quiz!.id}/results`)}
        >
          View Results
        </button>
        <button
          class="px-3 py-1.5 rounded-lg text-sm preset-filled-primary-500"
          onclick={handleStartSession}
          disabled={activeSession !== null}
        >
          {activeSession ? "Session Active" : "Start Live Session"}
        </button>
      </div>
    </div>
    <QuizCreator existingQuiz={data.quiz} />
  </div>
{:else if data.quiz.status === "published"}
  <div class="w-full max-w-4xl mx-auto">
    <QuizAsync quiz={data.quiz} />
  </div>
{:else}
  <div class="text-center py-12 text-surface-500">This quiz is not available</div>
{/if}
