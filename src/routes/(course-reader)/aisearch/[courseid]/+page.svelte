<script lang="ts">
  import { onMount } from "svelte";
  import {filterByType } from "$lib/services/course";
  import type { Lo } from "$lib/services/base";
  import type { Course } from "$lib/services/base";
  import type { PageData } from "./$types";
  import { currentLo } from "$lib/runes.svelte";
  import { marked } from 'marked';

  interface Props {
    data: PageData;
  };

  let { data }: Props = $props();

  let course: Course;
  let searchLos: Lo[] = [];

  
  let searchInputElement = $state();
  let isLoading = $state(false);
  // AI variables
  // svelte-ignore non_reactive_update
  let searchTerm: string = 'what is Vite?';
  let llmOutput: string = "";

    interface SearchResult {
      displayLink: string;
      link: string;
      title: string;
      snippet: string;
    };

    interface SearchResults {
      summary: string;
      results: SearchResult[]
    };
      // Google API search
  async function googleSearch(): Promise<string> {
      const apiKey = import.meta.env.VITE_Custom_Search_API_KEY;
      const cx = import.meta.env.VITE_Search_engine_id;
      const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchTerm}`;
    try {
      const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

      const filteredItems: SearchResult[] = data.items?.map((item: SearchResult) => ({
            displayLink: item.displayLink,
            link: item.link,
            title: item.title,
            snippet: item.snippet,
          })) || [];

        const jsonOutput = JSON.stringify(filteredItems, null, 2);

        return jsonOutput;
    } catch (error) {
        console.error('Error fetching data:', error);
        return JSON.stringify([]);
    }
};

  // LLM call
  async function sendMessage(): Promise<void> {
    const userMessage = searchTerm.trim();
    isLoading = true;

    let searchResults: string = await googleSearch();
    
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "granite3.1-dense:2b",
          prompt: `You are an AI-powered search engine that provides users with the most relevant and accurate resources based on 
          student's search query: "${searchTerm}"

                You are given a list of search results: ${searchResults}.  

                Task:  
                1. Carefully analyze these search results and select the 5 most relevant ones for the user's query:"${searchTerm}".  
                2. Use the snippets from the search results to generate a concise and informative summary that directly answers the user's query.
                If the snippets contain numerical data, key facts, or insights, incorporate them into the summary.  
                3. Do not generate new links or modify the provided links — copy them exactly as they appear.  
                4. Prioritize official sources, well-known websites, and content that directly addresses the query.  

                Output Format (Strictly Follow This Format):  
                **Summary:** {A short, well-structured response based on the snippet details}  

                1. **{Title}** - {Exact Link}  
                2. **{Title}** - {Exact Link}  
                3. **{Title}** - {Exact Link}  
                4. **{Title}** - {Exact Link}  
                5. **{Title}** - {Exact Link}  
                `,
          stream: false,
          options: {
              "temperature": 0.1, //Increasing the temperature will make the model answer more creatively
              "num_ctx": 8000, //Sets the size of the context window used to generate the next token.
              "top_k": 1,
              "top_p": 0.1,
          },          
        }),
      });

  
    const result = await response.json(); 
    console.log("API Response:", result);
    llmOutput = result.response; 
  } catch (error) {
      console.error('Error:', error);
      llmOutput = "An error occurred while fetching data.";
    } finally {
      isLoading = false;
    }
};

 function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }


  onMount(() => {
    course = data.course;
    currentLo.value = data.course;
    searchLos.push(...filterByType(data.course.los, "lab"), ...filterByType(data.course.los, "step"));
    searchInputElement?.focus();
  });
</script>


<section>
  <div class="container card mx-auto mb-4 p-4">
    <label for="aisearch" class="label">
      <span>Enter search term:</span>
      <input
        bind:value={searchTerm}
        bind:this={searchInputElement}
        on:keydown={handleKeyDown}
        type="text"
        name="aisearch"
        id="aisearch"
        class="input m-2 p-2 border rounded"
        placeholder="..."
      />
    </label>
  </div>

  <div class="flex justify-center">
    <button 
      on:click={sendMessage} 
      class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? "Searching" : "Tutors AI Search"}
    </button> 
  </div>
</section>

<section class="mt-4">
  {#if isLoading}
    <p class="text-center italic text-secondary">...</p>
  {:else if !llmOutput}
    <h1 class="text-center text-2xl font-bold">What can I help with? Type your search term and hit Enter</h1>
  {:else}
   <div class="px-6 py-4 my-4">
    <p>{@html marked(llmOutput)}</p>
    </div>
  {/if}
</section>