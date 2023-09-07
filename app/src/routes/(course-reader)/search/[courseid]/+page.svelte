<script lang="ts">
  import { onMount } from "svelte";
  import type { ResultType } from "$lib/services/utils/search";
  import { isValid, searchHits } from "$lib/services/utils/search";
  import type { Lo } from "$lib/services/models/lo-types";
  import type { Course } from "$lib/services/models/lo-types";
  import { currentLo } from "$lib/stores";
  import { filterByType } from "$lib/services/models/lo-utils";
  import { convertMdToHtml } from "$lib/services/models/markdown-utils";

  export let data: PageData;

  let course: Course;
  let searchLos: Lo[] = [];
  let searchTerm = "";
  let searchResults: ResultType[] = [];

  onMount(async () => {
    course = data.course;
    currentLo.set(data.course);
    const labs = filterByType(data.course.los, "lab");
    const steps = filterByType(data.course.los, "step");
    const notes = filterByType(data.course.los, "note");
    const panelNotes = filterByType(data.course.los, "panelnote");
    searchLos.push(...labs, ...steps, ...notes, ...panelNotes);
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
      result.html = convertMdToHtml(resultStrs.join("\n"), course.courseUrl);
      result.link = `https://tutors.dev/${result.link}`;
    });
  }

  $: {
    if (isValid(searchTerm)) {
      searchResults = searchHits(searchLos, searchTerm);
      transformResults(searchResults);
    }
  }
</script>

<div class="card container mx-auto p-4">
  <label for="search" class="label"
    ><span>Enter search term:</span>
    <input bind:value={searchTerm} type="text" name="search" id="search" class="m-2 p-2 input" placeholder="..." /></label
  >
  <div class="flex flex-wrap justify-center">
    {#each searchResults as result}
      <div class="card m-1 w-full p-4 lg:w-72 2xl:w-96">
        <div>
          <div>
            {@html result.html}
          </div>
          <div class="pt-4 text-right text-sm">
            <a rel="noopener noreferrer" href={result.link} target="_blank">
              {result.title}
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  :global(.labsearchresult pre) {
    color: white;
  }
</style>
