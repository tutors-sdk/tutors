<script lang="ts">
  import { onMount } from "svelte";
  import type { ResultType } from "$lib/services/utils/search";
  import { isValid, searchHits } from "$lib/services/utils/search";
  import type { Lo } from "$lib/services/types/lo";
  import type { Course } from "$lib/services/models/course";
  import { currentLo } from "$lib/stores";
  import { allLos } from "$lib/services/utils/lo";
  import { convertMdToHtml } from "$lib/services/utils/markdown";

  export let data: PageData;

  let course: Course;
  let labs: Lo[] = [];
  let searchTerm = "";
  let searchResults: ResultType[] = [];

  onMount(async () => {
    course = data.course;
    currentLo.set(data.course.lo);
    labs = allLos("lab", data.course.lo.los);
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
      result.html = convertMdToHtml(resultStrs.join("\n"), course.url);
      result.link = `https://tutors.dev/${result.link}`;
    });
  }

  $: {
    if (isValid(searchTerm)) {
      searchResults = searchHits(labs, searchTerm);
      transformResults(searchResults);
    }
  }
</script>

<div class="card container mx-auto p-4">
  <label for="search" class="label"
    ><span>Enter search term:</span>
    <input
      bind:value={searchTerm}
      type="text"
      name="search"
      id="search"
      class="m-2 p-2 input"
      placeholder="..."
    /></label
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
