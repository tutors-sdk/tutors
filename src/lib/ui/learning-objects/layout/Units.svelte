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

<div class="w-full space-y-4">
  {#each units as unit}
    <section
      aria-labelledby="{unit.id}-heading"
      class="border-primary-200 dark:border-primary-800/60 bg-surface-100 dark:bg-surface-900 w-full overflow-hidden rounded-xl border"
    >
      <header class="border-primary-100 dark:border-primary-800/40 flex items-center justify-between gap-3 border-b px-4 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <span aria-hidden="true" class="bg-primary-500 inline-block h-6 w-1.5 flex-none rounded-full"></span>
          <h2 id="{unit.id}-heading" class="text-pretty text-lg font-bold sm:text-xl">
            {unit.title}
          </h2>
        </div>
        <div class="flex-none opacity-80">
          <Image lo={unit.parentTopic ? unit.parentTopic : unit.parentLo} miniImage={true} />
        </div>
      </header>
      <div class="p-4">
        <Panels panels={unit.panels} />
        <div class="w-full">
          <Cards los={unit.units.standardLos} />
        </div>
      </div>
    </section>
  {/each}
</div>
