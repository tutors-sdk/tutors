<script lang="ts">
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";

  interface Props {
    content?: string;
  }
  let { content = "An [Open Learning Web Toolkit](/course/tutors-reference-manual)" }: Props = $props();
  let contentHtml = convertMdToHtml(content);
</script>

<p class="prose prose-sm prose-slate dark:prose-invert">
  {@html contentHtml}
</p>
