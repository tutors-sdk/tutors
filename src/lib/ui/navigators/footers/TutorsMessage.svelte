<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";
  
  let contentHtml = '';

  async function fetchContent() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/lgriffin/sampleTutorsPages/main/footer.md');
      if (response.ok) {
        const markdown = await response.text();
        contentHtml = convertMdToHtml(markdown);
      } else {
        console.error('Failed to fetch content: ', response.statusText);
        const fallbackContent =
          "Why not pitch in to the [Tutors Project](https://tutors.dev)?: see [*Project Readme*](https://github.com/tutors-sdk/tutors/blob/development/README.md), [*Open Issues*](https://github.com/tutors-sdk/tutors/issues) & [*Gallery*](https://tutors.dev/gallery)";
        contentHtml = convertMdToHtml(fallbackContent);
      }
    } catch (error) {
      console.error('Error fetching content: ', error);
      const fallbackContent =
        "Why not pitch in to the [Tutors Project](https://tutors.dev)?: see [*Project Readme*](https://github.com/tutors-sdk/tutors/blob/development/README.md), [*Open Issues*](https://github.com/tutors-sdk/tutors/issues) & [*Gallery*](https://tutors.dev/gallery)";
      contentHtml = convertMdToHtml(fallbackContent);
    }
  }

  onMount(() => {
    if (browser) {
      fetchContent();
    }
  });
</script>

<p class="prose prose-sm prose-slate dark:prose-invert">
  {@html contentHtml}
</p>
