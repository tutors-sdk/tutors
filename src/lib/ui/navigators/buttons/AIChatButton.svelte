<script lang="ts">
  /* References: 
    https://next.skeleton.dev/docs/guides/cookbook/chat/
    https://stackoverflow.com/questions/62097466/how-to-use-font-awesome-5-with-svelte-sappe
    https://usehooks-ts.com/react-hook/use-copy-to-clipboard
  */
  import { currentCourse, currentLo, currentLabStepIndex } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import { convertMdToHtml } from "$lib/services/markdown";

  let topic = currentCourse?.value?.contentHtml;
  let topicDescription = currentLo?.value?.contentMd;
  let pageContent = currentLo?.value?.los[currentLabStepIndex?.value].contentMd;

  let elemChat: HTMLElement;

  interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    responseId?: number;
    responseDate?: string;
    contentUrl?: string;
    llmUsed?: string;
    helpful?: boolean;
  }

  const availableModels: string[] = ["ibm/granite-3-8b-instruct", "ibm/granite-13b-instruct-v2"];
  let selectedModel: string = availableModels[0];

  let systemMessage: Message = {
    role: "system",
    content: `you are assisting Computer Science Higher Diploma students to understand content. \
     Always explain like they are five years old.\
     At this stage student explores ${topic}. that student is currently studdies: \
     Particularly student focused on: ${topicDescription}\
     The full text of the page student currently explores is ${pageContent}`
  };

  let messages: Message[] = [systemMessage];

  let inputMessage: string = "";
  let isLoading: boolean = false;
  let project_id: string = "68f58c24-1633-429d-bb39-cb0947f86d02";

  function scrollChatBottom(behavior?: "auto" | "instant" | "smooth") {
    elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
  }

  async function sendMessage(): Promise<void> {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    messages = [...messages, { role: "user", content: userMessage }];
    inputMessage = "";
    isLoading = true;

    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      console.log("API Response:", data);

      const rawText = data.results[0]?.generated_text || "No content available";
      console.log("API rawText:", rawText);
      const assistantResponse = rawText.split("\nrole: user")[0]?.trim(); // Clean response

      const llmMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        responseId: Date.now(),
        responseDate: new Date().toISOString(),
        contentUrl: window.location.href,
        llmUsed: selectedModel,
        helpful: false
      };

      messages = [...messages, llmMessage];
    } catch (error) {
      console.error("Error:", error);
      messages = [...messages, { role: "assistant", content: "Something went wrong!" }];
    } finally {
      isLoading = false;
    }

    console.log(messages);
    scrollChatBottom("smooth");
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
    setTimeout(() => scrollChatBottom("smooth"), 0);
  }

  //Copy text function:
  async function copyText(textToCopy: any) {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon type="aiChat" tip="Open course info" /> <span class="pt-1 text-sm">AI Chat</span>
  </div>
{/snippet}

{#snippet sidebarContent()}
  <div class="flex h-full flex-col">
    <!-- Header -->
    <header class="border-surface-500/30 border-b p-4">
      <h3 class="h2">Tutors AI Chat</h3>
    </header>
    <select bind:value={selectedModel} class="chip preset-filled-surface-500">
      {#each availableModels as model}
        <option value={model}>{model}</option>
      {/each}
    </select>

    <!-- Messages -->
    <section bind:this={elemChat} class="space-y-4 overflow-y-auto p-4" style="max-height: calc(100vh - 250px);">
      {#if messages.length < 2}
        <div class="flex h-full items-center justify-center">
          <h1 class="text-center text-2xl font-bold">What can I help with?</h1>
        </div>
      {:else}
        {#each messages.slice(1) as message}
          {#if message.role === "user"}
            <div class="grid grid-cols-[1fr_auto] gap-2">
              <div class="card preset-tonal space-y-2 justify-self-end rounded-xl p-4">
                <p>{@html convertMdToHtml(message.content)}</p>
              </div>
            </div>
          {:else}
            <div class="grid grid-cols-[auto_1fr] gap-2">
              <Icon type="aiChat" />
              <div class="card p-4">
                <p>{@html convertMdToHtml(message.content)}</p>

                <button onclick={() => (message.helpful = true)} class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
                  <Icon type="thumbsUp" />
                </button>
                <button onclick={() => (message.helpful = false)} class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2"
                  ><Icon width="32" type="thumbsDown" /></button
                >
                <button onclick={() => copyText(message.content)} class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2"
                  ><Icon width="32" type="copy" /></button
                >
              </div>
            </div>
          {/if}
        {/each}
      {/if}

      {#if isLoading}
        <p class="text-secondary text-center italic">Thinking...</p>
      {/if}
    </section>
  </div>
  <!-- Prompt -->
  <section class="border-surface-200-800 fixed bottom-0 left-0 z-10 w-[485px] p-4">
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <textarea class="textarea preset-tonal" bind:value={inputMessage} onkeydown={handleKeyDown} placeholder="Message Tutors AI" rows={3} />
  </section>
{/snippet}

<Sidebar {menuSelector} {sidebarContent} />
