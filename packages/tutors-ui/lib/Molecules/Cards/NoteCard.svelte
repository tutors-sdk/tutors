<script lang="ts">
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";
  import { generateToc } from "tutors-reader-lib/src/utils/markdown-toc-lib";
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";

  export let lo: Lo;
  let contentHtml = "";
  let url = lo.route.replace("/note/", "");
  const courseId = $currentCourse.id;
  const courseUrl = $currentCourse.url;
  url = url.replace(courseId, courseUrl);
  contentHtml = convertMd(lo.contentMd, url.replace("/note/", ""));
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
