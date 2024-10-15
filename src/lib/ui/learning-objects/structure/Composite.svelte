<script lang="ts">
  import type { Composite } from "$lib/services/models/lo-types";
  import Panels from "../layout/Panels.svelte";
  import Units from "../layout/Units.svelte";
  import Cards from "../layout/Cards.svelte";

  export let composite: Composite;
</script>

{#if composite?.units?.sides?.length > 0}
  <div class="block md:flex w-11/12 mx-auto justify-center">
    <div>
      <Panels panels={composite.panels} />
      <Units units={composite.units.units} inSidebar={true} />
      <Cards los={composite.units.standardLos} inSidebar={true}/> 
    </div>
    <div class="block w-full md:w-[20rem] md:ml-2 flex">
      <Units units={composite.units?.sides} inSidebar={true} />
    </div>
  </div>
{:else if composite}
  <div class="flex flex-wrap justify-center w-11/12 mx-auto">
    <Panels panels={composite?.panels} />
    <Units units={composite?.units.units} />
    <Cards los={composite?.units.standardLos} />
  </div>
{/if}
