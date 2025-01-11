<script lang="ts">
  import { convertMdToHtml } from "$lib/services/markdown";
  import Composite from "$lib/ui/learning-objects/structure/Composite.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();
  let text = `
# Docs for LLMs

We support the [llms.txt](https://llmstxt.org/) convention for making documentation available to large language models and the applications that make use of them.

Currently, we have the following root-level files...

- /llms.txt — a listing of the available files
- /llms-full.txt — complete documentation for Svelte, SvelteKit and the CLI
`;
  let textmd = convertMdToHtml(text);
</script>

<div class="container mx-auto mt-2 items-center justify-between lg:flex">
  <div class="mx-4">
    <div class="prose dark:prose-invert">
      {@html textmd}
    </div>
  </div>
</div>
