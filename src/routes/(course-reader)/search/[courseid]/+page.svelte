<script lang="ts">
  import { onMount } from "svelte";
  import type { ResultType } from "$lib/services/utils/search";
  import { isValid, searchHits } from "$lib/services/utils/search";
  import type { Lo } from "$lib/services/models/lo-types";
  import type { Course } from "$lib/services/models/lo-types";
  import { filterByType } from "$lib/services/models/lo-utils";
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";
  import type { PageData } from "./$types";
  import { courseService } from "$lib/services/course.svelte";
  import { currentCodeTheme, markdownService } from "$lib/services/markdown.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let course: Course;
  let searchLos: Lo[] = [];
  let searchTerm = $state("");
  let searchResults: ResultType[] = $state([]);
  let searchInputElement = $state();

  onMount(async () => {
    course = data.course;
    courseService.currentLo.value = data.course;
    const labs = filterByType(data.course.los, "lab");
    labs.forEach((lab) => {
      lab?.los?.forEach((step) => {
        step.parentLo = lab;
      });
    });
    const steps = filterByType(data.course.los, "step");
    const notes = filterByType(data.course.los, "note");
    const panelNotes = filterByType(data.course.los, "panelnote");
    searchLos.push(...labs, ...steps, ...notes, ...panelNotes);
    searchInputElement.focus();
  });

  function transformResults(results: ResultType[]) {
    results.forEach((result) => {
      let resultStrs: string[] = [];
      if (result.fenced) {
        resultStrs.push(`~~~${result.language}`);
      }
      resultStrs.push(result.contentMd);
      if (result.fenced) {
        resultStrs.push("~~~");
      }
      result.html = convertMdToHtml(resultStrs.join("\n"), currentCodeTheme.value);
      result.link = `https://tutors.dev/${result.link}`;
    });
  }

  let lastSearchTerm = "";
  $effect(() => {
    if (isValid(searchTerm) && searchTerm !== lastSearchTerm) {
      lastSearchTerm = searchTerm;
      searchResults = searchHits(searchLos, searchTerm);
      transformResults(searchResults);
    }
  });
</script>

<div class="container card mx-auto mb-4 p-4">
  <label for="search" class="label"
    ><span>Enter search term:</span>
    <input
      bind:value={searchTerm}
      bind:this={searchInputElement}
      type="text"
      name="search"
      id="search"
      class="input m-2 p-2"
      placeholder="..."
    /></label
  >
  <div class="mt-2 flex flex-wrap justify-center">
    {#each searchResults as result}
      <div class="card m-1 w-full border p-4">
        <div>
          <div class="prose dark:prose-invert">
            {@html result.html}
          </div>
          <div class="pt-4 text-right text-sm">
            <a
              rel="noopener noreferrer"
              href={result.link}
              target="_blank"
              class="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              {result.title}
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
