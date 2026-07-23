<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import { getActiveSession, isQuizEnabled } from "$lib/services/quiz";
  import Icon from "$lib/ui/components/Icon.svelte";

  let hasActiveSession = $state(false);

  const enabled = $derived(isQuizEnabled(currentCourse.value));

  $effect(() => {
    const courseId = currentCourse.value?.courseId;
    if (courseId && enabled) {
      getActiveSession(courseId).then((session) => {
        hasActiveSession = session !== null;
      });
    } else {
      hasActiveSession = false;
    }
  });

  function navigateToQuiz() {
    goto("/quiz/" + currentCourse?.value?.courseId);
  }
</script>

{#if enabled}
  <button onclick={navigateToQuiz}>
    <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary flex items-center gap-2 rounded-lg p-3 text-sm font-bold">
      <Icon type={hasActiveSession ? "quizLive" : "quiz"} tip="Course Quizzes" />
      <span class="hidden lg:block">Quiz</span>
      {#if hasActiveSession}
        <span class="bg-error-500 h-2 w-2 rounded-full animate-pulse"></span>
      {/if}
    </div>
  </button>
{/if}
