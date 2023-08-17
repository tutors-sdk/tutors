<script lang="ts">
  import { Card } from "$lib/ui/legacy";
  import type { Lo } from "$lib/types/lo";

  export let los: Lo[] = [];
  export let border: boolean = false;
  export let disableSort = false;
  let orderedLos = los;
  let unOrderedLos: Lo[] = [];
  if (!disableSort) {
    orderedLos = los.filter((lo) => lo?.frontMatter?.order);
    unOrderedLos = los.filter((lo) => !lo?.frontMatter?.order);
    orderedLos.sort((a, b) => Number(a.frontMatter?.order) - Number(b.frontMatter?.order));
  }
  let bordered = "border-[1px] border-surface-200-700-token";
  let unbordered = "";
</script>

{#if los.length > 0}
  <div
    class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 {border
      ? bordered
      : unbordered}"
  >
    <div class="flex flex-wrap justify-center">
      {#each orderedLos as lo}
        <Card {lo} />
      {/each}
      {#each unOrderedLos as lo}
        <Card {lo} />
      {/each}
    </div>
  </div>
{/if}
