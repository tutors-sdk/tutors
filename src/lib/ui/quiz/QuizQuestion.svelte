<script lang="ts">
  import type { QuestionType } from "$lib/services/quiz";

  interface Props {
    questionIndex: number;
    text: string;
    options: string[];
    questionType: QuestionType;
    selectedIndex: number | null;
    disabled: boolean;
    showCorrect: boolean;
    correctIndex?: number;
    distribution?: number[];
    onselect?: (index: number) => void;
  }

  let {
    questionIndex,
    text,
    options,
    questionType,
    selectedIndex,
    disabled,
    showCorrect,
    correctIndex,
    distribution,
    onselect
  }: Props = $props();

  function handleSelect(index: number) {
    if (!disabled && onselect) {
      onselect(index);
    }
  }

  function optionClass(index: number): string {
    const base = "w-full text-left p-4 rounded-lg border-[1px] transition-all";
    if (showCorrect && correctIndex !== undefined) {
      if (index === correctIndex) {
        return `${base} border-success-500 bg-success-500/20 text-success-700 dark:text-success-300`;
      }
      if (index === selectedIndex && index !== correctIndex) {
        return `${base} border-error-500 bg-error-500/20 text-error-700 dark:text-error-300`;
      }
      return `${base} border-surface-300 dark:border-surface-600 opacity-50`;
    }
    if (index === selectedIndex) {
      return `${base} border-primary-500 bg-primary-500/20 text-primary-700 dark:text-primary-300`;
    }
    if (disabled) {
      return `${base} border-surface-300 dark:border-surface-600 opacity-50 cursor-not-allowed`;
    }
    return `${base} border-surface-300 dark:border-surface-600 hover:border-primary-400 hover:bg-primary-500/10 cursor-pointer`;
  }

  const totalResponses = $derived(distribution ? distribution.reduce((a, b) => a + b, 0) : 0);
</script>

<div class="space-y-4">
  <div class="flex items-start gap-3">
    <span class="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
      {questionIndex + 1}
    </span>
    <div>
      <p class="text-lg font-medium">{text}</p>
      {#if questionType === "true-false"}
        <span class="text-xs text-surface-500 uppercase tracking-wide">True / False</span>
      {/if}
    </div>
  </div>

  <div class="grid gap-2 ml-11">
    {#each options as option, i}
      <button
        class={optionClass(i)}
        onclick={() => handleSelect(i)}
        disabled={disabled}
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full border-[1px] border-current flex items-center justify-center text-sm font-medium shrink-0">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{option}</span>
          </div>
          {#if showCorrect && correctIndex !== undefined}
            {#if i === correctIndex}
              <span class="text-success-500 text-sm font-medium">Correct</span>
            {:else if i === selectedIndex}
              <span class="text-error-500 text-sm font-medium">Your answer</span>
            {/if}
          {/if}
        </div>
        {#if distribution && totalResponses > 0}
          <div class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full {showCorrect && i === correctIndex ? 'bg-success-500' : 'bg-primary-400 dark:bg-primary-600'}"
                style="width: {(distribution[i] / totalResponses) * 100}%"
              ></div>
            </div>
            <span class="text-xs text-surface-500 w-12 text-right">
              {distribution[i]} ({Math.round((distribution[i] / totalResponses) * 100)}%)
            </span>
          </div>
        {/if}
      </button>
    {/each}
  </div>
</div>
