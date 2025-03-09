<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import type { LiveLab } from "$lib/services/course";
  import { fly } from "svelte/transition";
  import { slideFromLeft } from "$lib/ui/navigators/animations";
  import { currentCodeTheme } from "$lib/services/markdown";
  import { writable } from "svelte/store";
  
  interface Props {
    lab: LiveLab;
  }
  let { lab }: Props = $props();
  let project_id: string = '68f58c24-1633-429d-bb39-cb0947f86d02'
  let isLoaded = writable(false);
  let selectedText = writable("");
  let showEli5Button = writable(false);
  let buttonPosition = writable({ top: 0, left: 0 });
  onMount(() => {
    window.addEventListener("keydown", keypressInput);
    document.addEventListener("mouseup", handleTextSelection);
    isLoaded.set(true);
  });

  onDestroy(() => {
    browser ? window.removeEventListener("keydown", keypressInput) : null;
    document.removeEventListener("mouseup", handleTextSelection);
  });

  afterNavigate(() => {
    const elemPage = document.querySelector("#lab-panel");
    if (elemPage && window.innerWidth >= 600) {
      elemPage.scrollIntoView({ behavior: "smooth", block: "start" });
      elemPage.querySelector("article")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  async function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      let step = lab.nextStep();
      goto(`${lab.url}/${step}`);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      let step = lab.prevStep();
      goto(`${lab.url}/${step}`);
    }
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      selectedText.set(selection.toString());
      buttonPosition.set({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      showEli5Button.set(true);
    } else {
      showEli5Button.set(false);
    }
  }

async function showPopup() {
  const llmResponse = await sendMessage(); 
  alert(llmResponse);  
  console.log(llmResponse); 
}

  // AI variables
  // svelte-ignore non_reactive_update
  let llmOutput: string = "";
  let isLoading = $state(false);
// LLM call
  async function sendMessage(): Promise<string> {
    const userMessage = $selectedText.trim();
    isLoading = true;

    
    try {
      const response = await fetch('/api/summarise-search-background', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_id: 'ibm/granite-3-8b-instruct',
          project_id: project_id,
          prompt: `You need to explain like I am five: "${userMessage}"
                `,
          stream: false,
          options: {
              "temperature": 0.8, //Increasing the temperature will make the model answer more creatively
              "num_ctx": 8000, //Sets the size of the context window used to generate the next token.
              "top_k": 1,
              "top_p": 0.1,
          },          
        }),
      });

  
    const result = await response.json(); 
    
    const llmOutput = result?.results?.[0]?.generated_text || "No results found.";
    return llmOutput;  
    // Log the result to the console
    console.log("API Response:", llmOutput);

  } catch (error) {
      console.error('Error:', error);
      llmOutput = "An error occurred while fetching data.";
    } finally {
      isLoading = false;
    }
};


</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="lab-content w-full pb-14">
  <div class="max-w-l flex">
    <div class="mr-2 hidden h-auto w-72 lg:block">
      {#if $isLoaded}
        <div
          in:fly={slideFromLeft.in}
          out:fly={slideFromLeft.out}
          class="card sticky top-6 m-2 h-auto rounded-xl border-[1px] bg-surface-100 py-4 dark:border-primary-500
          dark:bg-surface-950"
        >
          <nav class="nav-list">
            <ul>
              {@html lab.navbarHtml}
            </ul>
          </nav>
        </div>
      {/if}
    </div>
    <div id="lab-panel" class="min-h-screen flex-1">
      <article
        class="prose max-w-[65ch] dark:prose-invert prose-pre:overflow-x-auto sm:mx-1 md:mx-4 2xl:max-w-[120ch] 2xl:prose-pre:max-w-[120ch]"
      >
        {#key currentCodeTheme.value}
          {@html lab.content}
        {/key}
      </article>
    </div>
  </div>

  <div class="fixed bottom-0 left-0 z-50 block w-full rounded border bg-primary-50 lg:hidden dark:bg-primary-900">
    <nav class="flex flex-wrap justify-between p-2">
      {@html lab.horizontalNavbarHtml}
    </nav>
  </div>
</div>

{#if $showEli5Button}
<button 
  type="button" 
  class="btn px-4 py-2 bg-gray-500 text-white rounded"
  on:click={showPopup}
  style="position: absolute; top: {$buttonPosition.top}px; left: {$buttonPosition.left}px;"
>
  eli5
</button>
{/if}