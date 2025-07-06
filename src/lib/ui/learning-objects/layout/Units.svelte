<script lang="ts">
  import type { Composite } from "@tutors/tutors-model-lib";
  import Panels from "./Panels.svelte";
  import Cards from "./Cards.svelte";
  import Image from "$lib/ui/components/Image.svelte";

  interface Props {
    units: Composite[];
  }
  let { units }: Props = $props();
</script>

<div class="w-full">
  {#each units as unit}
    <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 mb-2 w-full overflow-hidden rounded-xl border-[1px] p-4">
      <div class="flex w-full justify-between pb-2">
        <h2 id={unit.id} class="p-2 text-xl font-semibold">
          {unit.title}
        </h2>
        <Image lo={unit.parentTopic ? unit.parentTopic : unit.parentLo} miniImage={true} />
      </div>
      <Panels panels={unit.panels} />
      <div class="w-full">
        <Cards los={unit.units.standardLos} />
      </div>
    </div>
  {/each}
</div>
