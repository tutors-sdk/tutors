<script lang="ts">
  import { Accordion } from "@skeletonlabs/skeleton-svelte";
  import LoContext from "./LoContext.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { courseService } from "$lib/services/course.svelte";
</script>

<Accordion multiple>
  {#each courseService.currentCourse?.value?.los ?? [] as lo}
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
