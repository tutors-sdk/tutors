<script lang="ts">
  import { currentCodeTheme } from "$lib/services/markdown";
  import type { Lo } from "$lib/services/base/lo-types";

  interface Props {
    lo: Lo;
  }
  let { lo }: Props = $props();
</script>

<article class="prose mr-4 max-w-none dark:prose-invert">
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

<style>
  :global(.notecontent pre) {
    color: white;
  }
</style>
