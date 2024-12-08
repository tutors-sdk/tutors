<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import SetuIcon from "$lib/ui/components/SetuIcon.svelte";
  import TutorsIcon from "$lib/ui/components/TutorsIcon.svelte";
  import TutorsMessage from "./TutorsMessage.svelte";
  import TutorsVersion from "./TutorsVersion.svelte";
  import { slide } from "svelte/transition";
</script>

{#if currentCourse?.value?.footer}
  <div class="fixed bottom-0 left-0 w-screen">
    <img src="https://{currentCourse?.value?.courseUrl}/{currentCourse?.value?.footer}" alt="sponsors" />
  </div>
{:else}
  <div class="bg-surface-100-800-token border-surface-200-700-token bottom-0 mt-2 h-12 w-screen border-t-[1px]">
    <div class="mx-auto py-1">
      <div class="flex grid-flow-col items-center">
        <div class="flex inline-flex min-h-full flex-1 items-center">
          <div class="ml-4">
            <TutorsIcon />
          </div>
          <div class="w-48">
            <TutorsVersion />
          </div>
          <div class="w-full">
            <TutorsMessage />
          </div>
        </div>
        <SetuIcon />
      </div>
    </div>
  </div>
{/if}
