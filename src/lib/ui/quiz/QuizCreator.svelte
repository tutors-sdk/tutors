<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import { createQuiz, updateQuiz, getQuizUserId } from "$lib/services/quiz";
  import type { Quiz, QuizQuestion, QuestionType } from "$lib/services/quiz";

  interface Props {
    existingQuiz?: Quiz;
  }

  let { existingQuiz }: Props = $props();

  let title = $state(existingQuiz?.title ?? "");
  let timeLimit = $state<string>(existingQuiz?.timeLimit?.toString() ?? "");
  let questions = $state<QuizQuestion[]>(
    existingQuiz?.questions ?? [
      { id: "q1", type: "multiple-choice", text: "", options: ["", ""], correctIndex: 0 }
    ]
  );
  let isSaving = $state(false);
  let error = $state("");

  const courseId = $derived(currentCourse.value?.courseId ?? "");

  function addQuestion() {
    const id = `q${questions.length + 1}`;
    questions = [
      ...questions,
      { id, type: "multiple-choice", text: "", options: ["", ""], correctIndex: 0 }
    ];
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return;
    questions = questions.filter((_, i) => i !== index);
  }

  function setQuestionType(index: number, type: QuestionType) {
    const q = { ...questions[index], type };
    if (type === "true-false") {
      q.options = ["True", "False"];
      q.correctIndex = 0;
    } else if (questions[index].type === "true-false") {
      q.options = ["", ""];
      q.correctIndex = 0;
    }
    questions = questions.map((existing, i) => (i === index ? q : existing));
  }

  function addOption(qIndex: number) {
    if (questions[qIndex].options.length >= 6) return;
    const q = { ...questions[qIndex], options: [...questions[qIndex].options, ""] };
    questions = questions.map((existing, i) => (i === qIndex ? q : existing));
  }

  function removeOption(qIndex: number, oIndex: number) {
    if (questions[qIndex].options.length <= 2) return;
    const q = { ...questions[qIndex] };
    q.options = q.options.filter((_, i) => i !== oIndex);
    if (q.correctIndex >= q.options.length) {
      q.correctIndex = 0;
    }
    questions = questions.map((existing, i) => (i === qIndex ? q : existing));
  }

  function updateOptionText(qIndex: number, oIndex: number, value: string) {
    const q = { ...questions[qIndex] };
    q.options = q.options.map((o, i) => (i === oIndex ? value : o));
    questions = questions.map((existing, i) => (i === qIndex ? q : existing));
  }

  function updateQuestionText(qIndex: number, value: string) {
    questions = questions.map((q, i) => (i === qIndex ? { ...q, text: value } : q));
  }

  function setCorrectAnswer(qIndex: number, oIndex: number) {
    questions = questions.map((q, i) => (i === qIndex ? { ...q, correctIndex: oIndex } : q));
  }

  function validate(): string | null {
    if (!title.trim()) return "Quiz title is required";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return `Question ${i + 1}: text is required`;
      if (q.type === "multiple-choice") {
        const filledOptions = q.options.filter((o) => o.trim());
        if (filledOptions.length < 2) return `Question ${i + 1}: at least 2 options are required`;
      }
    }
    return null;
  }

  async function save(publishImmediately: boolean) {
    const validationError = validate();
    if (validationError) {
      error = validationError;
      return;
    }
    error = "";
    isSaving = true;

    const cleanedQuestions = questions.map((q, i) => ({
      ...q,
      id: q.id || `q${i + 1}`,
      options: q.type === "true-false" ? ["True", "False"] : q.options.filter((o) => o.trim())
    }));

    const timeLimitNum = timeLimit ? parseInt(timeLimit, 10) : null;

    if (existingQuiz) {
      await updateQuiz(existingQuiz.id, {
        title: title.trim(),
        questions: cleanedQuestions,
        timeLimit: timeLimitNum,
        status: publishImmediately ? "published" : existingQuiz.status
      });
    } else {
      await createQuiz({
        courseId,
        title: title.trim(),
        questions: cleanedQuestions,
        createdBy: getQuizUserId(),
        source: "dynamic",
        timeLimit: timeLimitNum,
        status: publishImmediately ? "published" : "draft"
      });
    }

    isSaving = false;
    goto(`/quiz/${courseId}`);
  }
</script>

<div class="mx-4 mt-4 max-w-3xl mx-auto space-y-6">
  <h2 class="text-xl font-bold">{existingQuiz ? "Edit Quiz" : "Create Quiz"}</h2>

  {#if error}
    <div class="bg-error-500/10 border-error-500 border-[1px] rounded-lg p-3 text-error-500 text-sm">
      {error}
    </div>
  {/if}

  <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 space-y-4">
    <div>
      <label for="quiz-title" class="block text-sm font-medium mb-1">Quiz Title</label>
      <input
        id="quiz-title"
        type="text"
        bind:value={title}
        placeholder="e.g., Week 3 Review"
        class="w-full rounded-lg border-[1px] border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 p-2.5 text-sm"
      />
    </div>
    <div>
      <label for="time-limit" class="block text-sm font-medium mb-1">Time Limit per Question (seconds, optional)</label>
      <input
        id="time-limit"
        type="number"
        bind:value={timeLimit}
        placeholder="e.g., 30"
        min="5"
        max="300"
        class="w-48 rounded-lg border-[1px] border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 p-2.5 text-sm"
      />
    </div>
  </div>

  {#each questions as question, qi}
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {qi + 1}
          </span>
          <select
            class="rounded-lg border-[1px] border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 p-1.5 text-sm"
            value={question.type}
            onchange={(e) => setQuestionType(qi, (e.target as HTMLSelectElement).value as QuestionType)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True / False</option>
          </select>
        </div>
        {#if questions.length > 1}
          <button
            class="text-sm text-error-500 hover:text-error-700"
            onclick={() => removeQuestion(qi)}
          >
            Remove
          </button>
        {/if}
      </div>

      <div>
        <label for="q-{qi}-text" class="block text-sm font-medium mb-1">Question</label>
        <textarea
          id="q-{qi}-text"
          value={question.text}
          oninput={(e) => updateQuestionText(qi, (e.target as HTMLTextAreaElement).value)}
          placeholder="Enter your question..."
          rows="2"
          class="w-full rounded-lg border-[1px] border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 p-2.5 text-sm resize-y"
        ></textarea>
      </div>

      <div class="space-y-2">
        <span class="block text-sm font-medium">Options (select the correct answer)</span>
        {#each question.options as option, oi}
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 rounded-full border-[2px] flex items-center justify-center text-xs font-medium shrink-0 transition-colors
                {question.correctIndex === oi
                  ? 'border-success-500 bg-success-500 text-white'
                  : 'border-surface-400 text-surface-500 hover:border-success-400'}"
              onclick={() => setCorrectAnswer(qi, oi)}
              title="Mark as correct answer"
            >
              {String.fromCharCode(65 + oi)}
            </button>
            {#if question.type === "true-false"}
              <span class="text-sm flex-1">{option}</span>
            {:else}
              <input
                type="text"
                value={option}
                oninput={(e) => updateOptionText(qi, oi, (e.target as HTMLInputElement).value)}
                placeholder="Option {String.fromCharCode(65 + oi)}"
                class="flex-1 rounded-lg border-[1px] border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 p-2 text-sm"
              />
              {#if question.options.length > 2}
                <button
                  class="text-sm text-surface-400 hover:text-error-500"
                  onclick={() => removeOption(qi, oi)}
                >
                  &times;
                </button>
              {/if}
            {/if}
          </div>
        {/each}
        {#if question.type === "multiple-choice" && question.options.length < 6}
          <button
            class="text-sm text-primary-500 hover:text-primary-700 ml-9"
            onclick={() => addOption(qi)}
          >
            + Add Option
          </button>
        {/if}
      </div>
    </div>
  {/each}

  <button
    class="w-full border-[1px] border-dashed border-surface-400 dark:border-surface-600 rounded-xl p-4 text-surface-500 hover:text-primary-500 hover:border-primary-500 transition-colors"
    onclick={addQuestion}
  >
    + Add Question
  </button>

  <div class="flex gap-3 justify-end pb-8">
    <button
      class="px-4 py-2 rounded-lg text-sm border-[1px] border-surface-300 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-800"
      onclick={() => goto(`/quiz/${courseId}`)}
      disabled={isSaving}
    >
      Cancel
    </button>
    <button
      class="px-4 py-2 rounded-lg text-sm border-[1px] border-primary-500 text-primary-500 hover:bg-primary-500/10"
      onclick={() => save(false)}
      disabled={isSaving}
    >
      {isSaving ? "Saving..." : "Save as Draft"}
    </button>
    <button
      class="px-4 py-2 rounded-lg text-sm preset-filled-primary-500"
      onclick={() => save(true)}
      disabled={isSaving}
    >
      {isSaving ? "Saving..." : "Save & Publish"}
    </button>
  </div>
</div>
