<script lang="ts">
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";
  import { generateToc } from "tutors-reader-lib/src/utils/markdown-toc-lib";

  export let lo: Lo;
  let contentHtml = "";
  const url = lo.route.replace("/#/note/", "");
  contentHtml = convertMd(lo.contentMd, url);
  contentHtml = generateToc(contentHtml);
</script>

<article class="notecontent prose dark:prose-invert">
  {@html contentHtml}
</article>

<style>
  :global(.notecontent pre) {
    color: white;
  }
</style>
