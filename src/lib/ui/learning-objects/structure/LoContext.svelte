<script lang="ts">
  import type { Composite, Lo } from "$lib/services/models/lo-types";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { AccordionItem } from "@skeletonlabs/skeleton";
  import LoReference from "./LoReference.svelte";

  export let lo: Lo;
</script>

{#each lo?.toc as lo}
  <AccordionItem>
    <svelte:fragment slot="summary"><LoReference {lo} /></svelte:fragment>
    <svelte:fragment slot="content">
      {#if lo.toc}
        {#each lo?.toc as lo}
          <LoReference {lo} indent={4} />
          {#if lo.toc}
            {#each lo?.toc as lo}
              <LoReference {lo} indent={8} />
              {#if lo.toc}
                {#each lo?.toc as lo}
                  <LoReference {lo} indent={12} />
                {/each}
              {/if}
            {/each}
          {/if}
        {/each}
      {/if}
    </svelte:fragment>
  </AccordionItem>
{/each}

<!-- {#each lo?.toc as lo}
  <a href={lo.type === "unit" ? lo?.parentTopic?.route : lo.type === "side" ? lo?.parentTopic?.route : lo?.route} class="flex py-1">
    <Icon type={lo.type} />
    <span class="ml-2 mb-1"> {@html lo.title} </span>
    {#if lo.video && lo.type != "panelvideo"}
      <a class="flex pl-1" href={lo.video}>
        <Icon type="video" />
      </a>
    {/if}
  </a>
  {#if lo?.type != "lab"}
    {#if lo?.los}
      {#each lo?.los as lo}
        <div class="flex py-1">
          <a class="inline-flex pl-6" href={lo.route}>
            <Icon type={lo.type} /> <span class="pl-2"> {lo.title} </span>
          </a>
          {#if lo?.video && lo?.type != "panelvideo"}
            {#if !$currentCourse.areVideosHidden}
              <a class="inline-flex pl-2" href={lo.video}>
                <Icon type="video" />
              </a>
            {/if}
          {/if}
        </div>
      {/each}
    {/if}
  {/if}
{/each} -->
