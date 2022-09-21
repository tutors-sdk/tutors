<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { currentLo } from "../stores";
  import type { ResultType } from "tutors-reader-lib/src/utils/search-utils";
  import { extractPath, isValid, searchHits } from "tutors-reader-lib/src/utils/search-utils";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { allLos } from "tutors-reader-lib/src/utils/lo-utils";
  import { push } from "svelte-spa-router";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { CourseService } from "../reader-lib/services/course-service";

  export let params: Record<string, string>;
  const cache: CourseService = getContext("cache");

  let course: Course;
  let search_strings: string[] = [];
  let labs: Lo[] = [];
  let title = "";
  let searchTerm = "";
  let searchResults: ResultType[] = [];

  onMount(async () => {
    course = await cache.readCourse(params.wild);
    currentLo.set(course.lo);
    title = course.lo.title;
    labs = allLos("lab", course.lo.los);
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
      console.log(result);
    });
  }

  $: {
    if (isValid(searchTerm)) {
      searchResults = searchHits(labs, searchTerm);
      transformResults(searchResults);
      push(searchTerm);
    }
  }
</script>

{#if course}
  <div class="container mx-auto">
    <label for="search" class="block p-2 text-xl text-base-content">Enter search term:</label>
    <div class="mt-1 border">
      <input bind:value={searchTerm} type="text" name="email" id="search" class="input input-bordered w-full" placeholder="..." />
    </div>
    <div>
      {#each searchResults as result}
        <div class="rounded-2xl border-2">
          <div class="labsearchresult ">
            <div>
              {@html result.html}
            </div>
            <div class="text-right text-sm">
              <a href={result.link} target="_blank">
                {result.title}
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  :global(.labsearchresult pre) {
    color: white;
  }
</style>
