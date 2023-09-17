<script lang="ts">
  import type { Topic } from "$lib/services/models/lo-types";
  import Icon from "../icons/Icon.svelte";

  export let topic: Topic;
</script>

{#each topic?.toc as lo}
  <a href={lo.type === "unit" ? lo?.parentTopic?.route : lo.type === "side" ? lo?.parentTopic?.route : lo?.route} class="flex py-1">
    <Icon type={lo.type} />
    <span class="ml-2 mb-1"> {@html lo.title} </span>
    {#if lo.video && lo.type != "panelvideo"}
      <a class="flex pl-1" href={lo.video}>
        <Icon type="video" />
      </a>
    {/if}
  </a>
  {#if lo.type != "lab"}
    {#if lo.los}
      {#each lo.los as lo}
        <div class="flex py-1">
          <a class="inline-flex pl-6" href={lo.route}>
            <Icon type={lo.type} /> <span class="pl-2"> {lo.title} </span>
          </a>
          {#if lo.video && lo.type != "panelvideo"}
            <a class="inline-flex pl-2" href={lo.video}>
              <Icon type="video" />
            </a>
          {/if}
        </div>
      {/each}
    {/if}
  {/if}
{/each}
