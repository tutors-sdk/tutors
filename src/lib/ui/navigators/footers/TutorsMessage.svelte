<script lang="ts">
  import { convertMdToHtml } from "@tutors/tutors-model-lib";
  import { onMount } from "svelte";
  import { sanitizeHtml } from "$lib/utils/sanitize";
  let contentHtml = "";

  onMount(async () => {
    contentHtml = convertMdToHtml(
      "An [Open Learning Web Toolkit](/course/tutors-reference-manual): Explore the [Tutors Catalogue](/catalogue)"
      //"An [Open Learning Web Toolkit](/course/tutors-reference-manual): Light and dark mode + themes available on the Layout menu 🥚"
      //"🐰🐰🐰  🥚🥚🥚 🐰🐰🐰 🥚🥚🥚 🐰🐰🐰  🥚🥚🥚"
    );
  });
</script>

{#if contentHtml}
  <div class="flex w-full justify-center">
    <p class="prose prose-sm prose-slate dark:prose-invert min-w-full">
      {@html sanitizeHtml(contentHtml ?? "")}
    </p>
  </div>
{/if}
