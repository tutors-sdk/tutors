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

  async function getToken(): Promise<string | null> {
    const key = import.meta.env.VITE_IAM_API_KEY;

    if (!key) {
        console.error("API Key is missing");
        return null;
    }

    try {
        const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${key}`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

  // let token: string = "eyJraWQiOiIyMDI1MDEzMDA4NDQiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTUwMDBRUEpSIiwiaWQiOiJJQk1pZC02OTUwMDBRUEpSIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiNzkwZTE2YTItZGU0ZC00NzBhLWExZGMtYzkwYTE3ODBkMTg0IiwiaWRlbnRpZmllciI6IjY5NTAwMFFQSlIiLCJnaXZlbl9uYW1lIjoiUnVzbGFuIiwiZmFtaWx5X25hbWUiOiJaaGFic2t5aSIsIm5hbWUiOiJSdXNsYW4gWmhhYnNreWkiLCJlbWFpbCI6IjIwMTA0MTA1QG1haWwud2l0LmllIiwic3ViIjoiMjAxMDQxMDVAbWFpbC53aXQuaWUiLCJhdXRobiI6eyJzdWIiOiIyMDEwNDEwNUBtYWlsLndpdC5pZSIsImlhbV9pZCI6IklCTWlkLTY5NTAwMFFQSlIiLCJuYW1lIjoiUnVzbGFuIFpoYWJza3lpIiwiZ2l2ZW5fbmFtZSI6IlJ1c2xhbiIsImZhbWlseV9uYW1lIjoiWmhhYnNreWkiLCJlbWFpbCI6IjIwMTA0MTA1QG1haWwud2l0LmllIn0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6IjhiZWQyYjkzMDdjMTRlYTY5NzA1OTlhZTY3NGNmYTJiIiwiZnJvemVuIjp0cnVlfSwiaWF0IjoxNzQwODU2NTU4LCJleHAiOjE3NDA4NjAxNTgsImlzcyI6Imh0dHBzOi8vaWFtLmNsb3VkLmlibS5jb20vaWRlbnRpdHkiLCJncmFudF90eXBlIjoidXJuOmlibTpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTphcGlrZXkiLCJzY29wZSI6ImlibSBvcGVuaWQiLCJjbGllbnRfaWQiOiJkZWZhdWx0IiwiYWNyIjoxLCJhbXIiOlsicHdkIl19.M_Mito3QRp783mrndCLaf8MopK8tD1AoK-matHwZhQp_iMB0FlA7u6_tHMf6U1gjhjMZiGhR49MIAzSgl52yEMVl90rUAtVpKfCNGtrZr0tRrMB5eJqXIZGmhAGhX2eTXZn1l7FFGo5_qh70NmrId-IlGqLdbPAnviGhgy1hPewuB2sIWdZdDe3ge_zBLbq6GNRno53b0EAZ1ts_vu7rTkBTlIiNu10IMqmgT_zTnEW2dQRhaNNaNy4avuFKc6vsrc2YLE75GU6jdjm7ewQ7e4QQPzAI3Dxe8PUi_P7jOoQ0tNDpV9l-wdAWWZbgicRL8U_GzcT76h61HjlOiklgnA";
  
  async function sendMessage(): Promise<void> {
    if (!inputMessage.trim()) return;
    
    const token = await getToken(); // Ensure we wait for the token
    if (!token) {
        console.error("Failed to retrieve token.");
        messages = [...messages, { role: 'assistant', content: 'Authentication error. Please try again later.' }];
        return;
    }

    const userMessage = inputMessage.trim();
    messages = [...messages, { role: 'user', content: userMessage }];
    inputMessage = '';
    isLoading = true;

    try {
        const response = await fetch('https://eu-gb.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            mode: 'cors',
            body: JSON.stringify({
                "input": messages,
                "parameters": {
                    "decoding_method": "greedy",
                    "max_new_tokens": 900,
                    "min_new_tokens": 0,
                    "stop_sequences": [],
                    "repetition_penalty": 1
                },
                "model_id": "ibm/granite-3-8b-instruct",
                "project_id": "68f58c24-1633-429d-bb39-cb0947f86d02"
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const llmMessage: Message = {
            role: 'assistant',
            content: data.generated_text || 'No content available',
            responseId: Date.now(),
            responseDate: new Date().toISOString(),
            contentUrl: window.location.href,
            llmUsed: selectedModel, // Ensure selectedModel is defined
            helpful: false,
        };

        messages = [...messages, llmMessage];

    } catch (error) {
        console.error('Error:', error);
        messages = [...messages, {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please check your network connection or API settings.'
        }];
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
