<script lang="ts">
  interface Props {
    options: string[];
    distribution: number[];
    correctIndex: number;
  }

  let { options, distribution, correctIndex }: Props = $props();

  const total = $derived(distribution.reduce((a, b) => a + b, 0));
</script>

<div class="space-y-2">
  {#each options as option, i}
    {@const count = distribution[i] ?? 0}
    {@const pct = total > 0 ? Math.round((count / total) * 100) : 0}
    <div class="flex items-center gap-3">
      <span class="w-7 h-7 rounded-full border-[1px] flex items-center justify-center text-xs font-medium shrink-0
        {i === correctIndex ? 'border-success-500 text-success-500' : 'border-surface-400 text-surface-500'}">
        {String.fromCharCode(65 + i)}
      </span>
      <span class="w-28 text-sm truncate" title={option}>{option}</span>
      <div class="flex-1 h-6 bg-surface-200 dark:bg-surface-700 rounded overflow-hidden">
        <div
          class="h-full rounded transition-all duration-500 {i === correctIndex ? 'bg-success-500' : 'bg-primary-300 dark:bg-primary-700'}"
          style="width: {pct}%"
        ></div>
      </div>
      <span class="w-16 text-xs text-right text-surface-500">{count} ({pct}%)</span>
    </div>
  {/each}
</div>
