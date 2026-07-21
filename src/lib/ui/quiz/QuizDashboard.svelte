<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import {
    getQuizzesByCourse,
    getActiveSession,
    isLecturer,
    publishQuiz,
    archiveQuiz,
    createSession,
    getQuizUserId,
    getQuizUserName,
    seedRemoteQuiz
  } from "$lib/services/quiz";
  import type { Quiz, QuizSession } from "$lib/services/quiz";
  import { presenceService } from "$lib/services/community";
  import { toaster } from "$lib/stores/toaster";
  import { filterByType, flattenLos } from "@tutors/tutors-model-lib";
  import { parseQuizMarkdown } from "$lib/services/quiz/services/quiz-parser";

  let dynamicQuizzes = $state<Quiz[]>([]);
  let activeSession = $state<QuizSession | null>(null);
  let isLoading = $state(true);

  const lecturer = $derived(isLecturer(currentCourse.value, getQuizUserId()));
  const courseId = $derived(currentCourse.value?.courseId ?? "");

  const courseQuizzes = $derived.by((): Quiz[] => {
    const course = currentCourse.value;
    if (!course?.los) return [];
    const quizLos = filterByType(flattenLos(course.los), "quiz");
    return quizLos
      .map((lo) => {
        if (!lo.contentMd) return null;
        const parsed = parseQuizMarkdown(lo.contentMd);
        if (!parsed) return null;
        return {
          id: lo.id,
          courseId: course.courseId ?? "",
          title: parsed.title,
          questions: parsed.questions,
          createdBy: "course",
          source: "course" as const,
          timeLimit: parsed.timeLimit,
          status: "published" as const,
          createdAt: ""
        };
      })
      .filter((q): q is Quiz => q !== null);
  });

  $effect(() => {
    if (!courseId) return;
    isLoading = true;
    Promise.all([
      getQuizzesByCourse(courseId),
      getActiveSession(courseId)
    ]).then(([q, s]) => {
      dynamicQuizzes = q;
      activeSession = s;
    }).finally(() => {
      isLoading = false;
    });
  });

  const quizzes = $derived([...courseQuizzes, ...dynamicQuizzes]);
  const publishedQuizzes = $derived(quizzes.filter((q) => q.status === "published"));
  const draftQuizzes = $derived(quizzes.filter((q) => q.status === "draft"));
  const archivedQuizzes = $derived(quizzes.filter((q) => q.status === "archived"));

  async function handlePublish(quiz: Quiz) {
    await publishQuiz(quiz.id);
    dynamicQuizzes = dynamicQuizzes.map((q) => (q.id === quiz.id ? { ...q, status: "published" as const } : q));
  }

  async function handleArchive(quiz: Quiz) {
    await archiveQuiz(quiz.id);
    dynamicQuizzes = dynamicQuizzes.map((q) => (q.id === quiz.id ? { ...q, status: "archived" as const } : q));
  }

  async function handleStartSession(quiz: Quiz) {
    const plainQuiz = JSON.parse(JSON.stringify(quiz)) as Quiz;
    seedRemoteQuiz(plainQuiz);
    const session = await createSession(plainQuiz.id, courseId, getQuizUserId());
    if (session) {
      const notification = {
        type: "quiz:live-started",
        sessionId: session.id,
        quizTitle: quiz.title,
        courseId,
        lecturerName: getQuizUserName(),
        quiz,
        session
      };
      if (presenceService.listeningTo !== "") {
        try {
          presenceService.partyKitCourse.send(JSON.stringify(notification));
        } catch { /* PartyKit unavailable */ }
      }
      try {
        const plain = JSON.parse(JSON.stringify(notification));
        const bc = new BroadcastChannel("tutors-quiz-notifications");
        bc.postMessage(plain);
      } catch { /* BroadcastChannel unavailable */ }
      toaster.create({
        title: `Live Quiz Started`,
        description: quiz.title,
        type: "success"
      });
      sessionStorage.setItem("quizHostSession", session.id);
      goto(`/quiz/${courseId}/live/${session.id}`);
    }
  }
</script>

<div class="mx-4 mt-4 space-y-6">
  {#if activeSession}
    <button
      class="w-full bg-error-500/10 border-error-500 border-[1px] rounded-xl p-6 text-center cursor-pointer hover:bg-error-500/20 transition-colors"
      onclick={() => goto(`/quiz/${courseId}/live/${activeSession!.id}`)}
    >
      <div class="flex items-center justify-center gap-3">
        <span class="bg-error-500 h-3 w-3 rounded-full animate-pulse"></span>
        <span class="text-xl font-bold text-error-500">Live Quiz in Progress</span>
      </div>
      <p class="text-sm text-surface-500 mt-2">Click to {lecturer ? "manage" : "join"} the live session</p>
    </button>
  {/if}

  {#if lecturer}
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Quiz Management</h2>
      <button
        class="preset-filled-primary-500 px-4 py-2 rounded-lg text-sm font-medium"
        onclick={() => goto(`/quiz/${courseId}/create`)}
      >
        Create Quiz
      </button>
    </div>
  {/if}

  {#if isLoading}
    <div class="text-center py-12 text-surface-500">Loading quizzes...</div>
  {:else if publishedQuizzes.length === 0 && (!lecturer || draftQuizzes.length === 0)}
    <div class="text-center py-12">
      <p class="text-surface-500 text-lg">No quizzes available yet</p>
      {#if lecturer}
        <p class="text-surface-400 text-sm mt-2">Create your first quiz to get started</p>
      {/if}
    </div>
  {:else}
    {#if lecturer && draftQuizzes.length > 0}
      <div>
        <h3 class="text-lg font-semibold mb-3 text-surface-500">Drafts</h3>
        <div class="grid gap-3">
          {#each draftQuizzes as quiz}
            <div class="border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">{quiz.title}</h4>
                  <p class="text-sm text-surface-500">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                    {#if quiz.timeLimit}
                      &middot; {quiz.timeLimit}s per question
                    {/if}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800"
                    onclick={() => goto(`/quiz/${courseId}/${quiz.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg text-sm preset-filled-primary-500"
                    onclick={() => handlePublish(quiz)}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if publishedQuizzes.length > 0}
      <div>
        {#if lecturer}
          <h3 class="text-lg font-semibold mb-3">Published Quizzes</h3>
        {/if}
        <div class="grid gap-3">
          {#each publishedQuizzes as quiz}
            <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">{quiz.title}</h4>
                  <p class="text-sm text-surface-500">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                    {#if quiz.timeLimit}
                      &middot; {quiz.timeLimit}s per question
                    {/if}
                  </p>
                </div>
                <div class="flex gap-2">
                  {#if lecturer}
                    <button
                      class="px-3 py-1.5 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800"
                      onclick={() => goto(`/quiz/${courseId}/${quiz.id}/results`)}
                    >
                      Results
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-lg text-sm preset-filled-primary-500"
                      onclick={() => handleStartSession(quiz)}
                      disabled={activeSession !== null}
                    >
                      Start Live
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-lg text-sm text-surface-500 hover:text-error-500"
                      onclick={() => handleArchive(quiz)}
                    >
                      Archive
                    </button>
                  {:else}
                    <button
                      class="px-3 py-1.5 rounded-lg text-sm preset-filled-primary-500"
                      onclick={() => goto(`/quiz/${courseId}/${quiz.id}`)}
                    >
                      Take Quiz
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if lecturer && archivedQuizzes.length > 0}
      <details class="mt-4">
        <summary class="text-sm text-surface-500 cursor-pointer hover:text-surface-700">
          Archived ({archivedQuizzes.length})
        </summary>
        <div class="grid gap-3 mt-3">
          {#each archivedQuizzes as quiz}
            <div class="border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 opacity-60">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">{quiz.title}</h4>
                  <p class="text-sm text-surface-500">{quiz.questions.length} questions</p>
                </div>
                <button
                  class="px-3 py-1.5 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800"
                  onclick={() => goto(`/quiz/${courseId}/${quiz.id}/results`)}
                >
                  Results
                </button>
              </div>
            </div>
          {/each}
        </div>
      </details>
    {/if}
  {/if}
</div>
