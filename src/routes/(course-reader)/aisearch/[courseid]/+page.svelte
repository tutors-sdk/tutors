<script lang="ts">
  import { onMount } from "svelte";
  import { filterByType } from "$lib/services/course";
  import type { Lo } from "$lib/services/base";
  import type { Course } from "$lib/services/base";
  import type { PageData } from "./$types";
  import { currentLo } from "$lib/runes.svelte";
  import { convertMdToHtml } from "$lib/services/markdown";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let course: Course;
  let searchLos: Lo[] = [];
  let project_id: string = "68f58c24-1633-429d-bb39-cb0947f86d02";

  let searchInputElement = $state();
  let isLoading = $state(false);
  // AI variables
  // svelte-ignore non_reactive_update
  let searchTerm: string = "what is Vite?";
  let llmOutput: string = "";

  interface SearchResult {
    displayLink: string;
    link: string;
    title: string;
    snippet: string;
  }

  interface SearchResults {
    summary: string;
    results: SearchResult[];
  }
  // Google API search
  async function googleSearch(): Promise<string> {
    const apiKey = import.meta.env.VITE_Custom_Search_API_KEY;
    const cx = import.meta.env.VITE_Search_engine_id;
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchTerm}`;
    try {
      const response = await fetch(url, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const filteredItems: SearchResult[] =
        data.items?.map((item: SearchResult) => ({
          displayLink: item.displayLink,
          link: item.link,
          title: item.title,
          snippet: item.snippet
        })) || [];

      const jsonOutput = JSON.stringify(filteredItems, null, 2);
      console.log("Search Results:", jsonOutput);
      return jsonOutput;
    } catch (error) {
      console.error("Error fetching data:", error);
      return JSON.stringify([]);
    }
  }

  // LLM call
  async function sendMessage(): Promise<void> {
    const userMessage = searchTerm.trim();
    isLoading = true;

    let searchResults: string = await googleSearch();

    try {
      const response = await fetch("/api/summarise-search-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: "ibm/granite-3-8b-instruct",
          project_id: project_id,
          prompt: `You are an AI-powered search engine that provides users with the most relevant and accurate resources based on 
          student's search query: "${searchTerm}"

                You are given a list of search results: ${searchResults}.  

                Task:  
                1. Carefully analyze these search results and select the 5 most relevant ones for the user's query:"${searchTerm}".  
                2. Use the snippets from the search results to generate a concise and informative summary that directly answers the user's query.
                If the snippets contain numerical data, key facts, or insights, incorporate them into the summary.  
                3. Do not generate new links or modify the provided links — copy them exactly as they appear.  
                4. Prioritize official sources, well-known websites, and content that directly addresses the query.  
                5. Include only one summary
                6. Include list of links only once
                7. Do not add Notes
                8. **Strictly include only one summary and one list of links.**  
                9. **Do not generate duplicate sections (Summary or List of links).**  
                10. **Do not include "Summary: {Concise summary...}", "List of links:", or repeated lists.**  

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
            temperature: 0.1, //Increasing the temperature will make the model answer more creatively
            num_ctx: 8000, //Sets the size of the context window used to generate the next token.
            top_k: 1,
            top_p: 0.1
          }
        })
      });

      const result = await response.json();
      console.log("API Response:", result);
      let generatedText = result.results[0].generated_text || "No results found.";
      let cleanedText = generatedText.split("**Output:**").pop()?.trim() || "No results found.";
      cleanedText = cleanedText.replace(/^\*\*Note:\*\*.*?\n\n/i, "").trim();
      llmOutput = cleanedText;
      // llmOutput = convertMdToHtml(llmOutput);
    } catch (error) {
      console.error("Error:", error);
      llmOutput = "An error occurred while fetching data.";
    } finally {
      isLoading = false;
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
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
  <div class="card container mx-auto mb-4 p-4">
    <label for="aisearch" class="label">
      <span>Enter search term:</span>
      <input
        bind:value={searchTerm}
        bind:this={searchInputElement}
        on:keydown={handleKeyDown}
        type="text"
        name="aisearch"
        id="aisearch"
        class="input m-2 rounded border p-2"
        placeholder="..."
      />
    </label>
  </div>

  <div class="flex justify-center">
    <button on:click={sendMessage} class="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50" disabled={isLoading}>
      {isLoading ? "Searching" : "Tutors AI Search"}
    </button>
  </div>
</section>

<section class="mt-4">
  {#if isLoading}
    <p class="text-secondary text-center italic">...</p>
  {:else if !llmOutput}
    <h1 class="text-center text-2xl font-bold">What can I help with? Type your search term and hit Enter</h1>
  {:else}
    <div class="my-4 px-6 py-4">
      <p>{@html convertMdToHtml(llmOutput)}</p>
    </div>
  {/if}
</section>
