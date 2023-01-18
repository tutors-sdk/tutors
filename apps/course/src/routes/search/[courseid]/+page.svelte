<script lang="ts">
  import { onMount } from "svelte";
  import type { ResultType } from "tutors-reader-lib/src/utils/search-utils";
  import { isValid, searchHits } from "tutors-reader-lib/src/utils/search-utils";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import { currentLo } from "tutors-reader-lib/src/stores/stores";
  import { allLos } from "tutors-reader-lib/src/utils/lo-utils";

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
      result.html = convertMd(resultStrs.join("\n"), course.url);
      result.link = `https://reader.tutors.dev/${result.link}`;
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
  <label for="search" class="block py-2 text-xl font-bold">Enter search term:</label>
  <input bind:value="{searchTerm}" type="text" name="email" id="search" class="m-2 p-2" placeholder="..." />
  <div class="flex flex-wrap justify-center">
    {#each searchResults as result}
      <div class="card m-1 w-full p-4 lg:w-72 2xl:w-96">
        <div>
          <div>
            {@html result.html}
          </div>
          <div class="pt-4 text-right text-sm">
            <a rel="noopener noreferrer" href="{result.link}" target="_blank">
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
