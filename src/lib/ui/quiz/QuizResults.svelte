<script lang="ts">
  import { computeQuestionAnalytics } from "$lib/services/quiz";
  import type { Quiz, QuizResponse } from "$lib/services/quiz";
  import QuizResultsChart from "./QuizResultsChart.svelte";

  interface Props {
    quiz: Quiz;
    responses: QuizResponse[];
    studentId?: string;
  }

  let { quiz, responses, studentId }: Props = $props();

  const filteredResponses = $derived(
    studentId ? responses.filter((r) => r.studentId === studentId) : responses
  );

  const analytics = $derived(computeQuestionAnalytics(filteredResponses, quiz.questions));

  const overallCorrect = $derived(filteredResponses.filter((r) => r.isCorrect).length);
  const overallTotal = $derived(quiz.questions.length);
  const overallPct = $derived(overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0);

  const uniqueStudents = $derived(new Set(responses.map((r) => r.studentId)).size);
  const avgTime = $derived(
    filteredResponses.length > 0
      ? Math.round(filteredResponses.reduce((a, r) => a + r.responseTimeMs, 0) / filteredResponses.length / 1000 * 10) / 10
      : 0
  );
</script>

<div class="space-y-6">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
      <div class="text-3xl font-bold text-primary-500">{overallCorrect}/{overallTotal}</div>
      <div class="text-sm text-surface-500">{studentId ? "Your Score" : "Avg Score"}</div>
    </div>
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
      <div class="text-3xl font-bold {overallPct >= 70 ? 'text-success-500' : overallPct >= 40 ? 'text-warning-500' : 'text-error-500'}">
        {overallPct}%
      </div>
      <div class="text-sm text-surface-500">Correct</div>
    </div>
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
      <div class="text-3xl font-bold">{avgTime}s</div>
      <div class="text-sm text-surface-500">Avg Time</div>
    </div>
    {#if !studentId}
      <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
        <div class="text-3xl font-bold">{uniqueStudents}</div>
        <div class="text-sm text-surface-500">Participants</div>
      </div>
    {/if}
  </div>

  <div class="space-y-6">
    {#each quiz.questions as question, i}
      {@const qa = analytics[i]}
      {@const studentResponse = studentId ? filteredResponses.find((r) => r.questionId === question.id) : null}
      <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4">
        <div class="flex items-start gap-3 mb-4">
          <span class="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
            {i + 1}
          </span>
          <div class="flex-1">
            <p class="font-medium">{question.text}</p>
            <div class="flex gap-4 mt-1 text-xs text-surface-500">
              <span>{qa.totalResponses} responses</span>
              <span>{qa.correctCount} correct ({qa.totalResponses > 0 ? Math.round((qa.correctCount / qa.totalResponses) * 100) : 0}%)</span>
              <span>Avg: {(qa.avgResponseTimeMs / 1000).toFixed(1)}s</span>
            </div>
          </div>
          {#if studentResponse}
            <span class="text-sm font-medium {studentResponse.isCorrect ? 'text-success-500' : 'text-error-500'}">
              {studentResponse.isCorrect ? "Correct" : "Incorrect"}
            </span>
          {/if}
        </div>
        <QuizResultsChart
          options={question.options}
          distribution={qa.distribution}
          correctIndex={question.correctIndex}
        />
      </div>
    {/each}
  </div>
</div>
