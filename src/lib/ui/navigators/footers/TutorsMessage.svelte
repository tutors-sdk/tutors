<script lang="ts">
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";
  export let content =
    "Pitch in to the [Tutors Project](https://tutors.dev): see [*Project Readme*](https://github.com/tutors-sdk/tutors/blob/development/README.md), [*Open Issues*](https://github.com/tutors-sdk/tutors/issues) & [*Gallery*](https://tutors.dev/gallery)";
  let contentHtml = convertMdToHtml(content);
</script>

<p class="prose prose-sm prose-slate dark:prose-invert">
  {@html contentHtml}
</p>
