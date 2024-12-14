<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconNavBar } from "$lib/services/models/lo-types";
  import { Segment } from "@skeletonlabs/skeleton-svelte";
  import { goto } from "$app/navigation";
  import { currentWallType } from "$lib/runes";

  interface Props {
    nav: IconNavBar;
  }
  let { nav }: Props = $props();

  $effect(() => {
    goto(currentWallType.value);
  });
</script>

<div class="flex items-center">
  <Segment name="align" bind:value={currentWallType.value} border="none" indicatorBg="bg-primary-500">
    {#each nav?.bar as i}
      <Segment.Item value={i.link} classes="w-12">
        <Icon type={i.type} link={i.link} target={i.target} tip={i.tip} />
      </Segment.Item>
    {/each}
  </Segment>
</div>
