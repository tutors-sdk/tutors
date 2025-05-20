<script lang="ts">
  import { currentCourse, currentLo, currentLabStepIndex } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import { convertMdToHtml } from "$lib/services/markdown";
  let topic = currentCourse?.value?.contentHtml;
  let topicDescription = currentLo?.value?.contentMd;

  let elemChat: HTMLElement;

  interface Message {
    role: "user" | "assistant" | "system";
    userMessage?: string;
    content: string;
    responseId?: number;
    responseDate?: string;
    contentUrl?: string;
    pageContent?: string;
    llmUsed?: string;
    feature?: string;
    helpful?: boolean;
  }

  const availableModels: string[] = ["ibm/granite-3-8b-instruct", "ibm/granite-13b-instruct-v2"];
  let selectedModel: string = availableModels[0];

  let messages: Message[] = [];

  let inputMessage: string = "";
  let isLoading: boolean = false;
  let project_id: string = "68f58c24-1633-429d-bb39-cb0947f86d02";
  function scrollChatBottom(behavior?: "auto" | "instant" | "smooth") {
    elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
  }

  async function sendMessage(): Promise<void> {
    if (!inputMessage.trim()) return;
    const labStepContent = currentLo?.value?.los[currentLabStepIndex?.value].contentMd;
    let labContent = currentLo?.value?.los.map((lo) => lo.contentMd).join(" ");

    const systemMessage: Message = {
      role: "system",
      content: `you are assisting Computer Science Higher Diploma students to understand content. \
     At this stage student explores ${topic}. that student is currently studies: \
     The full lab the student is exploring is : ${labContent}\
     The text of the lab step the student is currently exploring is ${labStepContent}\
     The objectives of the lab is ${topicDescription}`
    };

    if (messages.length === 0) {
      messages = [systemMessage];
    } else {
      messages[0] = systemMessage;
    }

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

      const dataResponse = await response.json();

      const rawText = dataResponse.results[0]?.generated_text || "No content available";
      const assistantResponse = rawText.split("\nrole: user")[0]?.trim(); // Clean response

      const responseId = 0;
      const responseDate = "";

      const llmMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        responseId: responseId,
        responseDate: responseDate,
        pageContent: labContent,
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
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
    setTimeout(() => scrollChatBottom("smooth"), 0);
  }
</script>

{#snippet menuSelector()}
  <div class="flex items-center justify-center">
    <Icon type="aiChat" tip="Talk to this Lab" />
    <div class="text-sm">AI Chat</div>
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
    <section bind:this={elemChat} class="flex-1 space-y-4 overflow-y-auto p-4 pb-32">
      {#if messages.length < 2}
        <div class="flex h-full items-center justify-center">
          <h1 class="text-center text-2xl font-bold">What can I help with?</h1>
        </div>
      {:else}
        {#each messages.slice(1) as message}
          <div class="grid grid-cols-[1fr_auto] gap-2">
            <div class="card preset-tonal space-y-2 justify-self-end rounded-xl p-4">
              <p>{@html convertMdToHtml(message.content)}</p>
            </div>
          </div>
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
    <textarea class="textarea preset-tonal" bind:value={inputMessage} on:keydown={handleKeyDown} placeholder="Message Tutors AI" rows={3} />
  </section>
{/snippet}

<Sidebar {menuSelector} {sidebarContent} />
