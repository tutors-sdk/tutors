<script lang="ts">
  import type { LoRecord } from "$lib/services/community/types.svelte";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";

  interface Props {
    los: LoRecord[];
    emptyMessage: string;
  }
  let { los, emptyMessage }: Props = $props();

  const cardLayout = {
    layout: "expanded" as const,
    style: "landscape" as const,
  };
</script>

<div class="flex flex-wrap justify-center pt-4">
  {#each los as lo}
    <StudentCard {lo} {cardLayout} />
  {:else}
    <p class="text-surface-600-300-token text-sm">{emptyMessage}</p>
  {/each}
</div>
