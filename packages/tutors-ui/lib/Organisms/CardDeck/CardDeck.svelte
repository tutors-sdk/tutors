<script lang="ts">
  import { Card } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let los: Lo[] = [];
  export let border: boolean = false;
  let orderedLos = los.filter((lo) => lo?.frontMatter?.order);
  let unOrderedLos = los.filter((lo) => !lo?.frontMatter?.order);
  orderedLos.sort((a, b) => Number(a.frontMatter.order) - Number(b.frontMatter.order));
  let bordered = "border-[1px] border-surface-200-700-token";
  let unbordered = "";
</script>

{#if los.length}
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 {border ? bordered : unbordered}">
    <div class="flex flex-wrap justify-center">
      {#each orderedLos as lo}
        <Card lo="{lo}" />
      {/each}
      {#each unOrderedLos as lo}
        <Card lo="{lo}" />
      {/each}
    </div>
  </div>
{/if}
