<script lang="ts">
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import {
    quizSessionState,
    getSessionById,
    getQuizById,
    updateSessionStatus,
    endSession,
    getResponsesForQuestion,
    computeQuestionAnalytics
  } from "$lib/services/quiz";
  import type { Quiz, QuizSession, QuizResponse } from "$lib/services/quiz";
  import QuizQuestion from "./QuizQuestion.svelte";
  import QuizResultsChart from "./QuizResultsChart.svelte";

  interface Props {
    sessionId: string;
  }

  let { sessionId }: Props = $props();

  let session = $state<QuizSession | null>(null);
  let quiz = $state<Quiz | null>(null);
  let isLoading = $state(true);
  let questionIndex = $state(-1);
  let revealed = $state(false);
  let currentDistribution = $state<number[]>([]);
  let questionResponses = $state<QuizResponse[]>([]);

  const courseId = $derived(currentCourse.value?.courseId ?? "");
  const participants = $derived(quizSessionState.participantCount.value);
  const answers = $derived(quizSessionState.answers.value);
  const answerCount = $derived(answers.length);
  const currentQ = $derived(quiz?.questions[questionIndex] ?? null);
  const isLastQuestion = $derived(quiz ? questionIndex >= quiz.questions.length - 1 : false);
  const quizStarted = $derived(questionIndex >= 0);

  $effect(() => {
    loadSession();
  });

  async function loadSession() {
    isLoading = true;
    session = await getSessionById(sessionId);
    if (session) {
      quiz = await getQuizById(session.quizId);
      quizSessionState.connect(courseId, sessionId);
      questionIndex = session.currentQuestion > 0 ? session.currentQuestion : -1;
    }
    isLoading = false;
  }

  function pushNextQuestion() {
    if (!quiz) return;
    const nextIndex = questionIndex + 1;
    if (nextIndex >= quiz.questions.length) return;

    questionIndex = nextIndex;
    revealed = false;
    currentDistribution = [];
    questionResponses = [];

    const q = quiz.questions[nextIndex];
    quizSessionState.pushQuestion(
      nextIndex,
      q.text,
      q.options,
      q.type,
      quiz.timeLimit
    );
    updateSessionStatus(sessionId, "active", nextIndex);
  }

  async function revealResults() {
    if (!quiz || !currentQ) return;

    questionResponses = await getResponsesForQuestion(sessionId, currentQ.id);
    const dist = new Array(currentQ.options.length).fill(0);
    for (const r of questionResponses) {
      if (r.selectedIndex >= 0 && r.selectedIndex < dist.length) {
        dist[r.selectedIndex]++;
      }
    }
    currentDistribution = dist;
    revealed = true;

    quizSessionState.revealAnswer(questionIndex, currentQ.correctIndex, dist);
    updateSessionStatus(sessionId, "reviewing", questionIndex);
  }

  async function handleEndQuiz() {
    quizSessionState.endQuiz();
    await endSession(sessionId);
    await new Promise((r) => setTimeout(r, 200));
    if (quiz) {
      goto(`/quiz/${courseId}/${quiz.id}/results`);
    } else {
      goto(`/quiz/${courseId}`);
    }
  }

  const correctCount = $derived(
    revealed ? questionResponses.filter((r) => r.isCorrect).length : 0
  );
  const avgTime = $derived(
    revealed && questionResponses.length > 0
      ? Math.round(questionResponses.reduce((a, r) => a + r.responseTimeMs, 0) / questionResponses.length / 100) / 10
      : 0
  );

  onDestroy(() => {
    quizSessionState.disconnect();
  });
</script>

{#if isLoading}
  <div class="text-center py-12 text-surface-500">Loading session...</div>
{:else if !quiz}
  <div class="text-center py-12 text-surface-500">Session not found</div>
{:else}
  <div class="mx-4 mt-4 max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">{quiz.title}</h2>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-sm text-surface-500">
          <span class="bg-success-500 h-2 w-2 rounded-full"></span>
          {participants} participant{participants !== 1 ? "s" : ""}
        </div>
        <button
          class="px-3 py-1.5 rounded-lg text-sm text-error-500 border-[1px] border-error-500 hover:bg-error-500/10"
          onclick={handleEndQuiz}
        >
          End Quiz
        </button>
      </div>
    </div>

    {#if !quizStarted}
      <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-8 text-center space-y-4">
        <div class="text-6xl font-bold text-primary-500">{participants}</div>
        <p class="text-surface-500">participant{participants !== 1 ? "s" : ""} connected</p>
        <p class="text-sm text-surface-400">Waiting for students to join...</p>
        <button
          class="px-6 py-3 rounded-lg text-lg preset-filled-primary-500 mt-4"
          onclick={pushNextQuestion}
        >
          Start Quiz
        </button>
      </div>
    {:else if currentQ}
      <div class="grid grid-cols-3 gap-4">
        <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
          <div class="text-2xl font-bold">{answerCount}</div>
          <div class="text-sm text-surface-500">Answers</div>
        </div>
        <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
          <div class="text-2xl font-bold">{questionIndex + 1}/{quiz.questions.length}</div>
          <div class="text-sm text-surface-500">Question</div>
        </div>
        {#if revealed}
          <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
            <div class="text-2xl font-bold {correctCount > answerCount / 2 ? 'text-success-500' : 'text-error-500'}">
              {correctCount}/{answerCount}
            </div>
            <div class="text-sm text-surface-500">Correct</div>
          </div>
        {:else}
          <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 text-center">
            <div class="text-2xl font-bold text-surface-400">--</div>
            <div class="text-sm text-surface-500">Correct</div>
          </div>
        {/if}
      </div>

      <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-6">
        {#if revealed}
          <QuizQuestion
            {questionIndex}
            text={currentQ.text}
            options={currentQ.options}
            questionType={currentQ.type}
            selectedIndex={null}
            disabled={true}
            showCorrect={true}
            correctIndex={currentQ.correctIndex}
            distribution={currentDistribution}
          />
          {#if avgTime > 0}
            <div class="mt-4 text-sm text-surface-500 text-center">
              Average response time: {avgTime}s
            </div>
          {/if}
        {:else}
          <QuizQuestion
            {questionIndex}
            text={currentQ.text}
            options={currentQ.options}
            questionType={currentQ.type}
            selectedIndex={null}
            disabled={true}
            showCorrect={false}
          />
        {/if}
      </div>

      <div class="flex justify-center gap-4">
        {#if !revealed}
          <button
            class="px-6 py-3 rounded-lg text-sm preset-filled-primary-500"
            onclick={revealResults}
          >
            Reveal Answer
          </button>
        {:else if !isLastQuestion}
          <button
            class="px-6 py-3 rounded-lg text-sm preset-filled-primary-500"
            onclick={pushNextQuestion}
          >
            Next Question
          </button>
        {:else}
          <button
            class="px-6 py-3 rounded-lg text-sm preset-filled-primary-500"
            onclick={handleEndQuiz}
          >
            Finish Quiz
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}
