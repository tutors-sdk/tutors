<script lang="ts">
  import type { Composite } from "$lib/services/course/models/lo-types";
  import Panels from "../layout/Panels.svelte";
  import Units from "../layout/Units.svelte";
  import Cards from "../layout/Cards.svelte";
  import { themeService } from "$lib/services/themes.svelte";

  interface Props {
    composite: Composite;
  }
  let { composite }: Props = $props();

  // const sideWidth = $derived(themeService.cardStyle.value === "landscape" ? "w-[48rem]" : "w-[32rem]");
  const sideWidth = $derived(themeService.cardStyle.value === "landscape" ? "md:w-[48rem]" : "md:w-3/12");
</script>

{#if composite?.units?.sides?.length > 0}
  <div class="m-4 block justify-center md:flex">
    <div>
      <Panels panels={composite.panels} />
      <Units units={composite.units.units} />
      <Cards los={composite.units.standardLos} />
    </div>
    <div class="block md:ml-2 {sideWidth}">
      <Units units={composite.units?.sides} />
    </div>
  </div>
{:else if composite}
  <div class="mx-auto flex w-11/12 flex-wrap justify-center">
    <Panels panels={composite?.panels} />
    <Units units={composite?.units.units} />
    <Cards los={composite?.units.standardLos} />
  </div>
{/if}
