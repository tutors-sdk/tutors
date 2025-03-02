<script lang="ts">
  /* References: 
    https://next.skeleton.dev/docs/guides/cookbook/chat/
    https://stackoverflow.com/questions/62097466/how-to-use-font-awesome-5-with-svelte-sappe
    https://usehooks-ts.com/react-hook/use-copy-to-clipboard
  */
  import { currentCourse, currentLo, currentLabStepIndex } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import { marked } from 'marked';
  import { Avatar } from '@skeletonlabs/skeleton-svelte';
  import '@fortawesome/fontawesome-free/css/all.min.css';

  export let tutorsAI: string = '/icons/tutorsAI.png';

    let topic = currentCourse?.value?.contentHtml;
    let topicDescription= currentLo?.value?.contentMd;
    let pageContent = currentLo?.value?.los[currentLabStepIndex?.value].contentMd;

  let elemChat: HTMLElement;

  interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    responseId?: number;
    responseDate?: string;
    contentUrl?: string;
    llmUsed?: string;
    helpful?: boolean;
  }

  const availableModels: string[] = ['ibm/granite-3-8b-instruct', 'ibm/granite-13b-instruct-v2'];
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
  let project_id: string = '68f58c24-1633-429d-bb39-cb0947f86d02'
  function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
    elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
  }

async function sendMessage(): Promise<void> {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    messages = [...messages, { role: 'user', content: userMessage }];
    inputMessage = '';
    isLoading = true;

    try {
        const response = await fetch('/api/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages,
                model_id: selectedModel,
                project_id: project_id
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        const rawText = data.results[0]?.generated_text || 'No content available';
        console.log('API rawText:', rawText);
        const assistantResponse = rawText.split('\nrole: user')[0]?.trim(); // Clean response

        messages = [...messages, { role: 'assistant', content: assistantResponse }]; // Store response
    } catch (error) {
        console.error('Error:', error);
        messages = [...messages, { role: 'assistant', content: 'Something went wrong!' }];
    } finally {
        isLoading = false;
    }

    console.log(messages);
}



  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
    setTimeout(() => scrollChatBottom('smooth'), 0);
  }

//Copy text function:
async function copyText(textToCopy: any) {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
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
  <select bind:value={selectedModel} class="chip preset-filled-surface-500" >
    {#each availableModels as model}
      <option value={model}>{model}</option>
    {/each}
  </select>

  <!-- Messages -->
<section bind:this={elemChat} class="max-h-[430px] p-4 overflow-y-auto space-y-4">
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
            <button on:click={() => message.helpful = true}><i class="fa-solid fa-thumbs-up"></i></button>
            <button on:click={() => message.helpful = false}><i class="fa-solid fa-thumbs-down"></i></button>
            <button on:click={copyText(message.content)}><i class="fa-solid fa-copy"></i></button>
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
      <textarea class="textarea preset-tonal" 
        bind:value={inputMessage} on:keydown={handleKeyDown} 
        placeholder="Message Tutors AI" rows={3} 
      />
    </section>
{/snippet}

<Sidebar {menuSelector} {sidebarContent} />
