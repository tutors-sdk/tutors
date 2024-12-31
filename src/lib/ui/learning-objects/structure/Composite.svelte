<script lang="ts">
  import type { Composite } from "$lib/services/models/lo-types";
  import Panels from "../layout/Panels.svelte";
  import Units from "../layout/Units.svelte";
  import Cards from "../layout/Cards.svelte";
  import { themeService } from "$lib/services/themes.svelte";

  interface Props {
    composite: Composite;
  }
  let { composite }: Props = $props();
</script>

{#if composite?.units?.sides?.length > 0}
  <div class="mx-auto block justify-center md:flex">
    <div>
      <Panels panels={composite.panels} />
      <Units units={composite.units.units} />
      <Cards los={composite.units.standardLos} />
    </div>
    <div class="block w-[48rem] md:ml-2">
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
