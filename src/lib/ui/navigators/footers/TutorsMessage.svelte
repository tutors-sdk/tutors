<script lang="ts">
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";
  import { onMount } from "svelte";

  let contentHtml = "";

  onMount(async () => {
    try {
      const response = await fetch("https://msg.tutors.dev/msg.json");
      const data = await response.json();
      contentHtml = convertMdToHtml(data.footerMessage);
    } catch (error) {
      console.error("Failed to fetch message:", error);
      // Fallback message if fetch fails
      contentHtml = convertMdToHtml("An [Open Learning Web Toolkit](/course/tutors-reference-manual)");
    }
  });
</script>

<p class="prose prose-sm prose-slate dark:prose-invert">
  {@html contentHtml}
</p>
