<script lang="ts">
  import { LoRecord } from "$lib/services/community";
  import Card from "../learning-objects/layout/Card.svelte";
  export let los: LoRecord[];
</script>

<div
  class="bg-surface-100-800-token border-surface-200-700-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl border-[1px] p-4"
>
  <div class="flex w-full justify-between pb-2">
    <h2 class="p-2">
      {los[0]?.courseTitle}
    </h2>
  </div>
  <div class="flex flex-wrap justify-center">
    {#each los as lo}
      <Card
        cardDetails={{
          route: lo?.loRoute,
          student: lo?.user,
          title: lo?.courseTitle,
          type: lo?.type,
          summary: lo?.title,
          img: lo?.img,
          icon: lo?.icon
        }}
      />
    {/each}
  </div>
</div>
