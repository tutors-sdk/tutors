<script lang="ts">
  import type { Lo } from "$lib/types/lo";
  import { convertNoteMdToHtml } from "$lib/utils/markdown";
  export let lo: Lo;
  convertNoteMdToHtml(lo);
</script>

<article class="notecontent prose dark:prose-invert max-w-none w-[80%]">
  {@html lo.contentHtml}
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
