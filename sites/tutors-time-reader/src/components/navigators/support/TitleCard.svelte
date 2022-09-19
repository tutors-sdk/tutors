<script lang="ts">
  import { currentCourse, currentLo } from "../../../stores";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  let lo: Lo;
  const unsubscribe = currentLo.subscribe(current => {
    lo = current;
    if (lo && lo.type === "unit") {
      lo.img = lo.parentLo.img;
      lo.icon = lo.parentLo.icon;
    }
  });

</script>

{#if $currentLo}
  <div class="flex-1">
    <div class="navbar-title">
      <p class="text-lg font-bold">{$currentLo.title}</p>
      {#if $currentLo.title != $currentCourse.lo.title}
        <p class="text-sm font-bold">{$currentCourse.lo.title}</p>
      {:else}
        <p class="text-sm font-bold">{$currentCourse.lo.properties.credits}</p>
      {/if}
    </div>
  </div>
{/if}
