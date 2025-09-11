<script lang="ts">
  import type { Composite } from "@tutors/tutors-model-lib";
  import Panels from "../layout/Panels.svelte";
  import Units from "../layout/Units.svelte";
  import Cards from "../layout/Cards.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";

  interface Props {
    composite: Composite;
  }
  let { composite }: Props = $props();

  const sideWidth = $derived(themeService.cardStyle.value === "landscape" ? "w-[64rem]" : "w-[28rem]")
</script>

<SecondaryNavigator lo={composite} parentCourse={composite?.parentCourse?.properties?.parent} />
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
