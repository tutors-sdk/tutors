<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { hideMainNavigator, currentCourse } from "$lib/runes.svelte";
  import { parseQuizMarkdown } from "$lib/services/quiz/services/quiz-parser";
  import QuizAsync from "$lib/ui/quiz/QuizAsync.svelte";
  import type { Lo } from "@tutors/tutors-model-lib";
  import type { Quiz } from "$lib/services/quiz";

  interface Props {
    lo: Lo;
  }
  let { lo }: Props = $props();

  const parsed = $derived(lo.contentMd ? parseQuizMarkdown(lo.contentMd) : null);

  const quiz = $derived.by((): Quiz | null => {
    if (!parsed) return null;
    return {
      id: lo.route,
      courseId: currentCourse.value?.courseId ?? "",
      title: parsed.title,
      questions: parsed.questions,
      createdBy: "course",
      source: "course",
      timeLimit: parsed.timeLimit,
      status: "published",
      createdAt: ""
    };
  });

  onMount(() => { hideMainNavigator.value = true; });
  onDestroy(() => { hideMainNavigator.value = false; });
</script>

{#if quiz}
  <QuizAsync {quiz} />
{:else}
  <div class="text-center py-12 text-error-500">
    Invalid quiz format in this learning object
  </div>
{/if}
