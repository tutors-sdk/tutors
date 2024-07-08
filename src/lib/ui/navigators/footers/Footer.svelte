<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import SetuIcon from "$lib/ui/support/SetuIcon.svelte";
  import TutorsIcon from "$lib/ui/support/TutorsIcon.svelte";
  import TutorsMessage from "./TutorsMessage.svelte";
  import TutorsVersion from "./TutorsVersion.svelte";
</script>

{#if $currentCourse.footer}
  <div class="fixed bottom-0 left-0 w-screen">
    <img src="https://{$currentCourse.courseUrl}/{$currentCourse.footer}" alt="sponsors" />
  </div>
{:else}
  <div class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2">
    <div class="mx-auto w-11/12 py-4">
      <div class="flex grid-flow-col items-center">
        <div class="inline-flex flex-1">
          <TutorsIcon />
          <div>
            <TutorsVersion />
          </div>
          <div class="pl-8">
            <TutorsMessage />
          </div>
        </div>
        <SetuIcon />
      </div>
    </div>
  </div>
{/if}
