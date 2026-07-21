<script lang="ts">
  import { submitResponse, getAsyncResponses, getQuizUserId } from "$lib/services/quiz";
  import type { Quiz, QuizResponse } from "$lib/services/quiz";
  import QuizQuestion from "./QuizQuestion.svelte";
  import QuizResults from "./QuizResults.svelte";

  interface Props {
    quiz: Quiz;
  }

  let { quiz }: Props = $props();

  let currentIndex = $state(0);
  let selectedAnswers = $state<Map<string, number>>(new Map());
  let startTimes = $state<Map<string, number>>(new Map());
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let existingResponses = $state<QuizResponse[]>([]);
  let isLoading = $state(true);

  const studentId = $derived(getQuizUserId());
  const currentQuestion = $derived(quiz.questions[currentIndex]);
  const allAnswered = $derived(selectedAnswers.size === quiz.questions.length);
  const alreadyTaken = $derived(existingResponses.length > 0);

  $effect(() => {
    if (studentId && quiz.id) {
      getAsyncResponses(quiz.id, studentId).then((responses) => {
        existingResponses = responses;
        if (responses.length > 0) {
          submitted = true;
          for (const r of responses) {
            selectedAnswers.set(r.questionId, r.selectedIndex);
          }
          selectedAnswers = new Map(selectedAnswers);
        }
        isLoading = false;
      });
    } else {
      isLoading = false;
    }
  });

  function handleSelect(questionId: string, index: number) {
    if (submitted) return;
    if (!startTimes.has(questionId)) {
      startTimes.set(questionId, Date.now());
      startTimes = new Map(startTimes);
    }
    selectedAnswers.set(questionId, index);
    selectedAnswers = new Map(selectedAnswers);
  }

  function startQuestionTimer() {
    const qid = currentQuestion.id;
    if (!startTimes.has(qid)) {
      startTimes.set(qid, Date.now());
      startTimes = new Map(startTimes);
    }
  }

  function goNext() {
    if (currentIndex < quiz.questions.length - 1) {
      currentIndex++;
      startQuestionTimer();
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    }
  }

  async function submitAll() {
    if (!allAnswered || isSubmitting) return;
    isSubmitting = true;

    const responses: QuizResponse[] = [];
    for (const question of quiz.questions) {
      const selected = selectedAnswers.get(question.id);
      if (selected === undefined) continue;

      const startTime = startTimes.get(question.id) ?? Date.now();
      const responseTimeMs = Date.now() - startTime;

      const response = {
        quizId: quiz.id,
        sessionId: null,
        questionId: question.id,
        studentId,
        selectedIndex: selected,
        isCorrect: selected === question.correctIndex,
        responseTimeMs
      };

      await submitResponse(response);
      responses.push({ ...response, id: "", submittedAt: new Date().toISOString() });
    }

    existingResponses = responses;
    submitted = true;
    isSubmitting = false;
  }

  $effect(() => {
    if (!submitted && !isLoading) {
      startQuestionTimer();
    }
  });
</script>

{#if isLoading}
  <div class="text-center py-12 text-surface-500">Loading...</div>
{:else if submitted}
  <div class="mx-4 mt-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">{quiz.title} - Results</h2>
    {#if alreadyTaken && existingResponses.length > 0}
      <QuizResults {quiz} responses={existingResponses} {studentId} />
    {:else}
      <QuizResults {quiz} responses={existingResponses} {studentId} />
    {/if}
  </div>
{:else}
  <div class="mx-4 mt-4 max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">{quiz.title}</h2>
      <span class="text-sm text-surface-500">
        Question {currentIndex + 1} of {quiz.questions.length}
      </span>
    </div>

    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
      <div
        class="bg-primary-500 h-2 rounded-full transition-all"
        style="width: {((currentIndex + 1) / quiz.questions.length) * 100}%"
      ></div>
    </div>

    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-6">
      <QuizQuestion
        questionIndex={currentIndex}
        text={currentQuestion.text}
        options={currentQuestion.options}
        questionType={currentQuestion.type}
        selectedIndex={selectedAnswers.get(currentQuestion.id) ?? null}
        disabled={false}
        showCorrect={false}
        onselect={(index) => handleSelect(currentQuestion.id, index)}
      />
    </div>

    <div class="flex items-center justify-between">
      <button
        class="px-4 py-2 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800 disabled:opacity-50"
        onclick={goPrev}
        disabled={currentIndex === 0}
      >
        Previous
      </button>

      <div class="flex gap-2">
        {#each quiz.questions as _, i}
          <button
            class="w-8 h-8 rounded-full text-xs font-medium transition-colors
              {i === currentIndex
                ? 'bg-primary-500 text-white'
                : selectedAnswers.has(quiz.questions[i].id)
                  ? 'bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500'}"
            onclick={() => { currentIndex = i; startQuestionTimer(); }}
          >
            {i + 1}
          </button>
        {/each}
      </div>

      {#if currentIndex === quiz.questions.length - 1}
        <button
          class="px-4 py-2 rounded-lg text-sm preset-filled-primary-500 disabled:opacity-50"
          onclick={submitAll}
          disabled={!allAnswered || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit All"}
        </button>
      {:else}
        <button
          class="px-4 py-2 rounded-lg text-sm preset-filled-primary-500"
          onclick={goNext}
        >
          Next
        </button>
      {/if}
    </div>
  </div>
{/if}
