<script lang="ts">
  import type { Composite } from "$lib/services/models/lo-types";
  import Panels from "../layout/Panels.svelte";
  import Units from "../layout/Units.svelte";
  import Cards from "../layout/Cards.svelte";

  export let composite: Composite;
</script>

{#if composite.units?.sides?.length > 0}
  <div class="block md:flex w-11/12 mx-auto">
    <div class="w-full">
      <Panels panels={composite.panels} />
      <Units units={composite.units.units} />
      <Cards los={composite.units.standardLos} />
    </div>
    <div class="block w-full md:w-[30rem] md:ml-2">
      <Units units={composite.units?.sides} />
    </div>
  </div>
{:else}
  <div class="flex flex-wrap justify-center w-11/12 mx-auto">
    <Panels panels={composite.panels} />
    <Units units={composite.units.units} />
    <Cards los={composite.units.standardLos} />
  </div>
{/if}
