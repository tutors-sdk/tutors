<script lang="ts">
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let contentHtml = "";

  onMount(async () => {
    try {
      const response = await fetch("https://msg.tutors.dev/msg.json");
      const data = await response.json();
      contentHtml = convertMdToHtml(data.footerMessage);
    } catch (error) {
      console.error("Failed to fetch message:", error);
      contentHtml = convertMdToHtml("An [Open Learning Web Toolkit](/course/tutors-reference-manual)");
    }
  });
</script>

{#if contentHtml}
  <p class="prose prose-sm prose-slate dark:prose-invert" transition:slide={{ duration: 2500 }}>
    {@html contentHtml}
  </p>
{/if}
