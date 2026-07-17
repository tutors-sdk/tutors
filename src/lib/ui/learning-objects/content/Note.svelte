<script lang="ts">
    import { hideMainNavigator } from "$lib/runes.svelte";
  import { currentCodeTheme } from "$lib/services/markdown";
  import { mermaidify } from "$lib/services/markdown/services/mermaid-action";
  import type { Lo } from "@tutors/tutors-model-lib";
    import { onDestroy, onMount } from "svelte";
  import { sanitizeHtml } from "$lib/utils/sanitize";

  interface Props {
    lo: Lo;
  }
  let { lo }: Props = $props();

    onMount(() => {
    hideMainNavigator.value = true;
  });
  onDestroy(() => {
    hideMainNavigator.value = false;
  });
</script>

<article class="prose dark:prose-invert mr-4 max-w-none overflow-x-auto" use:mermaidify>
  {#key currentCodeTheme.value}
    {@html sanitizeHtml(lo.contentHtml ?? "")}
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
