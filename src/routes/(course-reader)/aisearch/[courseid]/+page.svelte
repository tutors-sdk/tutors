<script lang="ts">
  import { onMount } from "svelte";
  import type { ResultType } from "$lib/services/course";
  import { isValid, searchHits, filterByType } from "$lib/services/course";
  import type { Lo } from "$lib/services/base";
  import type { Course } from "$lib/services/base";
  import { convertMdToHtml, currentCodeTheme } from "$lib/services/markdown";
  import type { PageData } from "./$types";
  import { currentLo } from "$lib/runes.svelte";
    import type { promises } from "dns";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let course: Course;
  let searchLos: Lo[] = [];

  let searchResults: ResultType[] = $state([]);
  let searchInputElement = $state();
  let isLoading: boolean = false;

    //AI variables 
  interface Message {
    role: 'user' | 'assistant' | 'system' | 'search results';
    content: string;
    responseId?: number;
    responseDate?: string;
    contentUrl?: string;
    llmUsed?: string;
    helpful?: boolean;
  }

  // svelte-ignore non_reactive_update
  let searchTerm:string;
  
  let systemMessage:Message = {
      role: 'system',
      content: `Your role is to provide a concise and accurate answer to the user's question\
      using the provided search results: ${searchResults}.\
      Ensure your answer is derived from the most relevant search snippets\
      and include links to sources with a brief description for additional context.\
      Instructions:\
      1. Go through Search results ${searchResults}\
      2. Use only knowledge received from search results to build your answer. Build your answer based on title and snippet\
      3. Provide links to resources by combining displayLink and link. Important: do not include any other links`
    }
  let messages: Message[] = [systemMessage];

    interface SearchResult {
      displayLink: string;
      link: string;
      title: string;
      snippet: string;
    }
    
      // add Google API search
  async function googleSearch(): Promise<string> {
      const apiKey = import.meta.env.VITE_Custom_Search_API_KEY;
      const cx = import.meta.env.VITE_Search_engine_id;
      const query = 'what is sveltekit';
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
        const jsonOutput = JSON.stringify(filteredItems, null, 2);
        console.log(jsonOutput);

        return jsonOutput;
    } catch (error) {
        console.error('Error fetching data:', error);
        return JSON.stringify([]);
    }
};

  //Add LLM analysis
  async function sendMessage(): Promise<void> {
    let searchTerm = 'what is sveltekit';
    const userMessage = searchTerm.trim();
    let searchResults: string = await googleSearch();
    
    let searchResultMessage:Message = {
      role: 'search results',
      content: `Search results: ${searchResults}`
    }
    messages = [...messages, searchResultMessage, {role: 'user', content: userMessage}];
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
                2. Use the snippets from the search results to generate a concise and informative summary that directly answers the user's query. If the snippets contain numerical data, key facts, or insights, incorporate them into the summary.  
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

    const data = await response.json(); 
    console.log("API Response:", data);

  } catch (error) {
      console.error('Error:', error);
      messages = [...messages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure Ollama is running locally' 
      }];
    } finally {
      isLoading = false;
    }
}


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
      on:click={sendMessage} 
    >
      Google Search
    </button> 
  </div>
