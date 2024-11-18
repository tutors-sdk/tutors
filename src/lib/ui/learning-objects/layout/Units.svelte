<script lang="ts">
  import type { Composite } from "$lib/services/models/lo-types";
  import Panels from "./Panels.svelte";
  import Cards from "./Cards.svelte";
  import Image from "../../themes/Image.svelte";

  interface Props {
    units: Composite[];
    inSidebar?: boolean;
  }
  let { units, inSidebar = false }: Props = $props();

  let text = "!text-xl font-semibold";
</script>

<div class={inSidebar ? "flex flex-col" : "grid grid-cols-1"}>
  {#each units as unit}
    <div class="bg-surface-100-800-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl p-4 border-[1px] border-surface-200-700-token">
      <div class="flex w-full justify-between pb-2">
        <h2 id={unit.id} class="p-2 {text}">
          {unit.title}
        </h2>
        <Image lo={unit.parentTopic ? unit.parentTopic : unit.parentLo} miniImage={true} />
      </div>
      <Panels panels={unit.panels} />
      <div class="flex flex-wrap justify-center">
        <Cards los={unit.units.standardLos} {inSidebar} />
      </div>
    </div>
  {/each}
</div>
