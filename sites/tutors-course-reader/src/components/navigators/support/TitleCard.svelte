<script lang="ts">
  import { currentCourse, currentLo } from "../../../stores";
  import Image from "../../cards/Image.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import Icon from "@iconify/svelte";

  let lo: Lo;
  let wall = false;
</script>

{#if $currentLo}
  <div class="flex-1">
    <div class="inline-flex align-middle">
      {#if !wall}
        <Image {lo} miniImage={true} />
      {:else}
        <Icon icon={getIcon(lo.type).icon} class="text-{getIcon(lo.type).colour}" width="40" height="40" />
      {/if}
    </div>
    <div class="navbar-title align-middle">
      <p class="text-lg font-bold">{$currentLo.title}</p>
      {#if $currentLo.title != $currentCourse.lo.title}
        <p class="text-sm font-bold">{$currentCourse.lo.title}</p>
      {:else}
        <p class="text-sm font-bold">{$currentCourse.lo.properties.credits}</p>
      {/if}
    </div>
  </div>
{/if}
