<script lang="ts">
  import type { Composite } from "@tutors/tutors-model-lib";
  import Panels from "./Panels.svelte";
  import Cards from "./Cards.svelte";
  import Image from "$lib/ui/components/Image.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse, isLecturer, contentLocks, tutorsId } from "$lib/runes.svelte";
  import { rbacService } from "$lib/services/rbac";

  interface Props {
    units: Composite[];
  }
  let { units }: Props = $props();
</script>

<div class="w-full">
  {#each units as unit}
    <div class="relative border-primary-500 bg-surface-100 dark:bg-surface-900 mb-2 w-full overflow-hidden rounded-xl border-[1px] p-4">
      {#if contentLocks.value.get(unit.route) && !isLecturer.value}
        <div class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-surface-500/30 backdrop-blur-[2px]">
          <Icon type="lock" height="48" />
        </div>
      {/if}
      <div class="flex w-full justify-between pb-2">
        <h2 id={unit.id} class="p-2 text-xl font-semibold">
          {unit.title}
        </h2>
        <div class="flex items-center gap-2">
          {#if isLecturer.value}
            <button
              class="rounded-lg bg-surface-200 p-1 opacity-70 transition-opacity hover:opacity-100 dark:bg-surface-700"
              onclick={() => rbacService.toggleLock(currentCourse.value!.courseId, unit.route, tutorsId.value!.login)}
            >
              <Icon type={contentLocks.value.get(unit.route) ? "lock" : "unlock"} height="20" />
            </button>
          {/if}
          <Image lo={unit.parentTopic ? unit.parentTopic : unit.parentLo} miniImage={true} />
        </div>
      </div>
      <Panels panels={unit.panels} />
      <div class="w-full">
        <Cards los={unit.units.standardLos} />
      </div>
    </div>
  {/each}
</div>
