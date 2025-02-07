<script lang="ts">
  // References: https://next.skeleton.dev/docs/guides/cookbook/chat/
  import { currentCourse, currentLo, currentLabStepIndex } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import { marked } from 'marked';
  import { Avatar } from '@skeletonlabs/skeleton-svelte';

  // !AI add functionality to switch between models!
  // Add Like and dislike 
  export let tutorsAI: string = '/icons/tutorsAI.png';

    let topic: string = currentCourse?.value?.contentHtml;
    let topicDescription: string = currentLo?.value?.contentMd;
    let pageContent:string = currentLo?.value?.los[currentLabStepIndex?.value].contentMd;

  let elemChat: HTMLElement;

  interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

  const availableModels: string[] = ['granite3.1-dense:2b', 'granite-code:3b'];
  let selectedModel: string = availableModels[0];

  let systemMessage:Message = {
    role: 'system',
    content: `you are assisting Computer Science Higher Diploma students to understand content. \
     Always explain like they are five years old.\
     At this stage student explores ${topic}. that student is currently studdies: \
     Particularly student focused on: ${topicDescription}\
     The full text of the page student currently explores is ${pageContent}`
  }
  let messages: Message[] = [systemMessage];
  let inputMessage: string = '';
  let isLoading: boolean = false;

  function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
    elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
  }

  async function sendMessage(): Promise<void> {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    messages = [...messages, {role: 'user', content: userMessage}];
    inputMessage = '';
    isLoading = true;

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messages,
          stream: false,
          options: {
              "temperature": 0.8, //Increasing the temperature will make the model answer more creatively
              "num_ctx": 8000, //Sets the size of the context window used to generate the next token.
              "mirostat_eta": 0.9 //Influences how quickly the algorithm responds to feedback from the generated text
          },          
        }),
      });

    const data = await response.json();
    messages = [...messages, { role: 'assistant', content: data.message.content }];
    } catch (error) {
      console.error('Error:', error);
      messages = [...messages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure Ollama is running locally' 
      }];
    } finally {
      isLoading = false;
    }
    // setTimeout(() => scrollChatBottom('smooth'), 0);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
    setTimeout(() => scrollChatBottom('smooth'), 0);
  }

</script>

{#snippet menuSelector()}
  <Icon type="info" tip="Open course info" />
{/snippet}

{#snippet sidebarContent()}

  <header class="flex justify-between">
    <h2 class="h2">Course Info</h2>
  </header>
  <article>
    <prose class="prose dark:prose-invert">
      {@html currentCourse?.value?.contentHtml}
      <!-- {@html currentLo?.value?.contentMd} -->
      <!-- {@html currentLabStepIndex?.value}
      {@html currentLo?.value?.los[currentLabStepIndex?.value].contentMd} -->
    </prose>
  </article>

  <div class="h-full flex flex-col">
  <!-- Header -->
  <header class="p-4 border-b border-surface-500/30">
    <h3 class="h2">Tutors AI Chat</h3>
  </header>

           <select bind:value={selectedModel} >
  {#each availableModels as model}
    <option value={model}>{model}</option>
  {/each}
</select>

  <!-- Messages -->
<section bind:this={elemChat} class="max-h-[450px] p-4 overflow-y-auto space-y-4">
  {#if messages.length < 2}
  <div class="flex justify-center items-center h-full">
    <h1 class="text-center text-2xl font-bold">What can I help with?</h1>
  </div>
  {:else}
    {#each messages.slice(1) as message}
      {#if message.role === 'user'}
        <div class="grid grid-cols-[1fr_auto] gap-2">
          <div class="card p-4 preset-tonal rounded-xl space-y-2 justify-self-end">
            <p>{@html marked(message.content)}</p>
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-[auto_1fr] gap-2">
          <Avatar src={tutorsAI} name="TutorsAI" size="size-8" />
          <div class="card p-4">
            <p>{@html marked(message.content)}</p>
          </div>
        </div>
      {/if}
    {/each}
  {/if}

  {#if isLoading}
    <p class="text-center italic text-secondary">Thinking...</p>
  {/if}
</section>
      </div>  
  <!-- Prompt -->
    <section class="fixed bottom-0 left-0 w-[485px] p-4 border-surface-200-800 z-10">
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <textarea class="textarea" 
        bind:value={inputMessage} on:keydown={handleKeyDown} 
        placeholder="Message Tutors AI" rows={3} 
      />
    </section>
{/snippet}

<Sidebar {menuSelector} {sidebarContent} />
