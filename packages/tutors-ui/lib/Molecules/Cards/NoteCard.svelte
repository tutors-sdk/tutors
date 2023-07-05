<script lang="ts">
  import { onMount } from "svelte";
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { generateToc } from "tutors-reader-lib/src/utils/markdown-toc-lib";
  import { convertRichMd, initKaytex } from "tutors-reader-lib/src/utils/markdown-utils";

  export let lo;
  onMount(async () => {
    await initKaytex();
    let url = lo.route.replace("/panelnote/", "");
    url = url.replace("/note/", "");
    url = url.replace($currentCourse.id, $currentCourse.url);
    const html = convertRichMd(lo.contentMd, url);
    lo.contentHtml = generateToc(html);
  });
</script>

<article class="notecontent prose dark:prose-invert">
  {@html lo.contentHtml}
</article>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous" />
</svelte:head>

<style>
  :global(.notecontent pre) {
    color: white;
  }
</style>
