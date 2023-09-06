<script lang="ts">
  import { CardDeck } from "$lib/ui/legacy";
  import PanelDeck from "./PanelDeck.svelte";
  import UnitDeck from "./UnitDeck.svelte";
  import type { Composite } from "$lib/services/models/lo-types";

  export let composite: Composite;
</script>

{#if composite.units?.sides?.length > 0}
  <div class="block md:flex w-11/12 mx-auto">
    <div class="w-full">
      <PanelDeck panels={composite.panels} />
      <UnitDeck units={composite.units.units} />
      <CardDeck los={composite?.units?.standardLos} border />
    </div>
    <div class="block w-full md:w-[30rem] md:ml-2">
      <UnitDeck units={composite.units?.sides} />
    </div>
  </div>
{:else}
  <div class="flex flex-wrap justify-center w-11/12 mx-auto">
    <PanelDeck panels={composite.panels} />
    <UnitDeck units={composite.units.units} />
    <CardDeck los={composite?.units?.standardLos} border />
  </div>
{/if}
