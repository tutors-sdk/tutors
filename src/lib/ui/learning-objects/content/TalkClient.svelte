<script lang="ts">
  import { browser } from "$app/environment";
  import type { Talk } from "@tutors/tutors-model-lib";

  interface Props {
    lo: Talk;
  }
  let { lo }: Props = $props();
</script>

{#if browser}
  {#await import("$lib/ui/learning-objects/content/Talk.svelte")}
    <div class="mt-72 mb-72 flex flex-col items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:then { default: Talk }}
    <Talk {lo} />
  {/await}
{:else}
  <div class="mt-72 mb-72 flex flex-col items-center justify-center">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{/if}
