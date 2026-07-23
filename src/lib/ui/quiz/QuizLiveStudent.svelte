<script lang="ts">
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import { quizSessionState, getSessionById, getQuizById, submitResponse, getQuizUserId, getQuizUserName, getQuizUserAvatar } from "$lib/services/quiz";
  import type { Quiz, QuizSession } from "$lib/services/quiz";
  import QuizQuestion from "./QuizQuestion.svelte";

  interface Props {
    sessionId: string;
  }

  let { sessionId }: Props = $props();

  let session = $state<QuizSession | null>(null);
  let quiz = $state<Quiz | null>(null);
  let isLoading = $state(true);
  let answered = $state(false);
  let selectedAnswer = $state<number | null>(null);
  let questionStartTime = $state(0);
  let responseTimeMs = $state(0);

  const courseId = $derived(currentCourse.value?.courseId ?? "");
  const studentId = $derived(getQuizUserId());
  const studentName = $derived(getQuizUserName());
  const avatar = $derived(getQuizUserAvatar());

  const currentQuestion = $derived(quizSessionState.currentQuestion.value);
  const revealData = $derived(quizSessionState.revealData.value);
  const sessionEnded = $derived(quizSessionState.sessionEnded.value);
  const participants = $derived(quizSessionState.participantCount.value);

  $effect(() => {
    loadSession();
  });

  async function loadSession() {
    isLoading = true;
    session = await getSessionById(sessionId);
    if (session) {
      quiz = await getQuizById(session.quizId);
      quizSessionState.connect(courseId, sessionId);
      quizSessionState.joinSession(studentId, studentName, avatar);
    }
    isLoading = false;
  }

  $effect(() => {
    if (currentQuestion) {
      answered = false;
      selectedAnswer = null;
      questionStartTime = Date.now();
      responseTimeMs = 0;
    }
  });

  async function handleSelect(index: number) {
    if (answered || !currentQuestion || !quiz) return;

    selectedAnswer = index;
    answered = true;
    responseTimeMs = Date.now() - questionStartTime;

    quizSessionState.submitAnswer(studentId, currentQuestion.questionIndex, index, responseTimeMs);

    const question = quiz.questions[currentQuestion.questionIndex];
    if (question) {
      await submitResponse({
        quizId: quiz.id,
        sessionId,
        questionId: question.id,
        studentId,
        selectedIndex: index,
        isCorrect: index === question.correctIndex,
        responseTimeMs
      });
    }
  }

  onDestroy(() => {
    quizSessionState.disconnect();
  });
</script>

{#if isLoading}
  <div class="text-center py-12 text-surface-500">Joining session...</div>
{:else if sessionEnded}
  <div class="mx-4 mt-4 max-w-3xl mx-auto text-center space-y-4">
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-8">
      <h2 class="text-2xl font-bold mb-2">Quiz Complete!</h2>
      <p class="text-surface-500">The quiz session has ended</p>
      {#if quiz}
        <button
          class="mt-4 px-4 py-2 rounded-lg text-sm preset-filled-primary-500"
          onclick={() => goto(`/quiz/${courseId}/${quiz!.id}/results`)}
        >
          View Your Results
        </button>
      {/if}
    </div>
  </div>
{:else if !currentQuestion}
  <div class="mx-4 mt-4 max-w-3xl mx-auto text-center space-y-4">
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-8">
      <div class="animate-pulse text-4xl mb-4">&#9203;</div>
      <h2 class="text-xl font-bold mb-2">Waiting for the quiz to start...</h2>
      <p class="text-surface-500">{participants} participant{participants !== 1 ? "s" : ""} connected</p>
      {#if quiz}
        <p class="text-sm text-surface-400 mt-2">{quiz.title}</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="mx-4 mt-4 max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <span class="text-sm text-surface-500">
        Question {currentQuestion.questionIndex + 1}
        {#if quiz}
          of {quiz.questions.length}
        {/if}
      </span>
      {#if answered && !revealData}
        <span class="text-sm text-success-500 font-medium">Answer submitted ({(responseTimeMs / 1000).toFixed(1)}s)</span>
      {/if}
    </div>

    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-6">
      <QuizQuestion
        questionIndex={currentQuestion.questionIndex}
        text={currentQuestion.text}
        options={currentQuestion.options}
        questionType={currentQuestion.questionType}
        selectedIndex={selectedAnswer}
        disabled={answered}
        showCorrect={revealData !== null}
        correctIndex={revealData?.correctIndex}
        distribution={revealData?.distribution}
        onselect={handleSelect}
      />
    </div>

    {#if revealData && selectedAnswer !== null}
      <div class="text-center">
        {#if selectedAnswer === revealData.correctIndex}
          <span class="text-2xl font-bold text-success-500">Correct!</span>
        {:else}
          <span class="text-2xl font-bold text-error-500">Incorrect</span>
        {/if}
        <p class="text-sm text-surface-500 mt-1">
          Response time: {(responseTimeMs / 1000).toFixed(1)}s
        </p>
      </div>
    {/if}
  </div>
{/if}
