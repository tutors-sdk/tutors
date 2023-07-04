<script lang="ts">
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { generateToc } from "tutors-reader-lib/src/utils/markdown-toc-lib";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";

  //export let contentHtml = "";
  export let lo;
  if (lo.contentHtml == undefined) {
    let url = lo.route.replace("/panelnote/", "");
    url = url.replace($currentCourse.id, $currentCourse.url);
    let contentHtml = convertMd(lo.contentMd, url);
    lo.contentHtml = generateToc(contentHtml);
  }
</script>

<article class="notecontent prose dark:prose-invert">
  {@html lo.contentHtml}
</article>

<style>
  :global(.notecontent pre) {
    color: white;
  }
</style>
