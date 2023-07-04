<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { NoteCard, TopicNavigatorCard } from "tutors-ui";
  import { initKaytex } from "$lib/markdown/rich-markdown";
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { convertRichMd } from "tutors-reader-lib/src/utils/markdown-utils";
  import { generateToc } from "tutors-reader-lib/src/utils/markdown-toc-lib";
  export let data: PageData;

  onMount(async () => {
    await initKaytex();
    let url = data.lo.route.replace("/note/", "");
    url = url.replace($currentCourse.id, $currentCourse.url);
    let contentHtml = convertRichMd(data.lo.contentMd, url);
    data.lo.contentHtml = generateToc(contentHtml);
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous" />
</svelte:head>

{#if data.lo}
  <div class="min-h-screen flex w-11/12 mx-auto">
    <div class="w-full">
      <NoteCard lo="{data.lo}" />
    </div>
    <div class="hidden md:block">
      <TopicNavigatorCard topic="{data.lo.parent}" />
    </div>
  </div>
{/if}
