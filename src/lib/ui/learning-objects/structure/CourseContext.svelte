<script lang="ts">
  import { Accordion } from "@skeletonlabs/skeleton-svelte";
  import LoContext from "./LoContext.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";
    import LoContextTree from "./LoContextTree.svelte";
</script>

<Accordion multiple class=" max-h-[90vh]  overflow-y-auto">
      <LoContextTree lo={currentCourse?.value}  />
  <!--{#each currentCourse?.value?.los ?? [] as lo}

    {#if !lo.hide}
      <Accordion.Item value={lo?.id}>
        <Accordion.ItemTrigger>
          <div class="flex w-full items-center gap-2">
            <Icon type={lo.type} />
            <span>{lo.title}</span>
            <span class="flex-1"></span>
            <Accordion.ItemIndicator class="group">
              <span class="hidden size-4 group-data-[state=open]:block"> + </span>
              <span class="block size-4 group-data-[state=open]:hidden"> − </span>
            </Accordion.ItemIndicator>
          </div>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <LoContextTree {lo} indent={0} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <hr class="hr" />
    {/if} 
  {/each}-->
</Accordion>
