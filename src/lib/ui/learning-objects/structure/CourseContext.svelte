<script lang="ts">
  import { Accordion } from "@skeletonlabs/skeleton-svelte";
  import LoContext from "./LoContext.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";
</script>

<Accordion multiple class=" max-h-[90vh]  overflow-y-auto">
  {#each currentCourse?.value?.los ?? [] as lo}
    {#if !lo.hide}
      <Accordion.Item value={lo?.id}>
        <Accordion.ItemTrigger>
          <div class="flex items-center gap-2">
            <Icon type={lo.type} />
            <span>{lo.title}</span>
          </div>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <LoContext {lo} indent={0} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <hr class="hr" />
    {/if}
  {/each}
</Accordion>
