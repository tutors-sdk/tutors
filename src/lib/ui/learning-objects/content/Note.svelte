<script lang="ts">
  import { currentCodeTheme } from "$lib/services/markdown";
  import type { Lo } from "@tutors/tutors-model-lib";

  interface Props {
    lo: Lo;
  }
  let { lo }: Props = $props();
</script>

<article class="prose dark:prose-invert mx-auto w-full max-w-3xl px-4 py-2 lg:max-w-4xl">
  {#key currentCodeTheme.value}
    {@html lo.contentHtml}
  {/key}
</article>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous"
  />
</svelte:head>
