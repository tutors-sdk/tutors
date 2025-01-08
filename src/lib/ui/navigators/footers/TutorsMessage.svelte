<script lang="ts">
  import { convertMdToHtml } from "$lib/services/content/utils/markdown-utils";
  import { onMount } from "svelte";
  let contentHtml = "";

  onMount(async () => {
    contentHtml = convertMdToHtml(
      "An [Open Learning Web Toolkit](/course/tutors-reference-manual): Check out the new Card Styles in the layout menu"
    );
  });
</script>

{#if contentHtml}
  <div class="flex w-full justify-center">
    <p class="prose prose-sm prose-slate min-w-full dark:prose-invert">
      {@html contentHtml}
    </p>
  </div>
{/if}
