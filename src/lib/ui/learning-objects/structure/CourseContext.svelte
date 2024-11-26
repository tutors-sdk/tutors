<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { Accordion } from "@skeletonlabs/skeleton-svelte";
  import LoContext from "./LoContext.svelte";
</script>

<Accordion multiple>
  {#each currentCourse?.value?.los ?? [] as lo}
    {#if !lo.hide}
      <Accordion.Item value={lo?.id}>
        {#snippet lead()}<Icon type={lo.type} />{/snippet}
        {#snippet control()}{lo.title}{/snippet}
        {#snippet panel()}
          <LoContext {lo} />{/snippet}
      </Accordion.Item>
      <hr class="hr" />
    {/if}
  {/each}
</Accordion>
