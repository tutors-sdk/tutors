<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import SetuIcon from "$lib/ui/components/SetuIcon.svelte";
  import TutorsIcon from "$lib/ui/components/TutorsIcon.svelte";
  import TutorsMessage from "./TutorsMessage.svelte";
  import TutorsVersion from "./TutorsVersion.svelte";
  import { slide } from "svelte/transition";
</script>

{#if currentCourse?.value?.footer}
  <div class="w-full">
    <img src="https://{currentCourse?.value?.courseUrl}/{currentCourse?.value?.footer}" alt="sponsors" class="w-full" />
  </div>
{:else}
  <div class="bg-surface-100-800-token border-surface-200-700-token h-12 w-full border-t-[1px]">
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
