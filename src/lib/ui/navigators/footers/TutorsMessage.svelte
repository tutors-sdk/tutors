<script lang="ts">
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";
  import { currentTheme } from "$lib/runes";

  interface Props {
    content?: string;
    content2?: string;
  }

  let { content = "An [Open Learning Web Toolkit](/course/tutors-reference-manual)", 
        content2 = "Wishing you a Merry Christmas! To return to the default theme, go to Layout > 'tutors'." }: Props = $props();

  let contentHtml = convertMdToHtml(content);
  let contentHtml2 = convertMdToHtml(content2);
</script>

<div class="flex">
  <p class="prose prose-sm prose-slate dark:prose-invert">
    {@html contentHtml}
  </p>

{#if currentTheme.value === "festive"}
  <p class="ml-4 prose prose-sm prose-slate dark:prose-invert whitespace-normal lg:whitespace-nowrap">
    {@html contentHtml2}
  </p>
{/if}
</div>