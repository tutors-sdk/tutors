<script lang="ts">
  import { onMount } from "svelte";
  import type { ResultType } from "$lib/services/course";
  import { isValid, searchHits, filterByType } from "$lib/services/course";
  import type { Lo } from "$lib/services/base";
  import type { Course } from "$lib/services/base";
  import { convertMdToHtml, currentCodeTheme } from "$lib/services/markdown";
  import type { PageData } from "./$types";
  import { currentLo } from "$lib/runes.svelte";

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
    currentLo.value = data.course;
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

    interface SearchResult {
      displayLink: string;
      link: string;
      title: string;
      snippet: string;
    }
      // add Google API search
  async function googleSearch(): Promise<void> {
      const apiKey = import.meta.env.VITE_Custom_Search_API_KEY;
      const cx = import.meta.env.VITE_Search_engine_id;
      const query = 'what is svelte';
      const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;
    try {
      const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //displayLink, link, title, snippet
        console.log(data);
        // const titles = data.items.map((item: { title: any; }) => item.title);
        // console.log("titles:", titles);

      const filteredItems: SearchResult[] = data.items?.map((item: SearchResult) => ({
            displayLink: item.displayLink,
            link: item.link,
            title: item.title,
            snippet: item.snippet,
          })) || [];

          console.log(filteredItems);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };


</script>

<div class="container card mx-auto mb-4 p-4">
  <label for="aisearch" class="label"
    ><span>Enter search term:</span>
    <input
      bind:value={searchTerm}
      bind:this={searchInputElement}
      type="text"
      name="aisearch"
      id="aisearch"
      class="input m-2 p-2"
      placeholder="..."
    /></label
  >
</div>


  <div> 
    <button 
      on:click={googleSearch} 
    >
      Google Search
    </button> 
  </div>
