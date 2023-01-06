<script lang="ts">
  import { currentCourse, currentLo } from "tutors-reader-lib/src/stores/stores";
  import { Breadcrumb, Crumb } from "@skeletonlabs/skeleton";
  import { Icon } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  function crumbs(lo: Lo, los: Lo[]) {
    if (lo) {
      crumbs(lo.parentLo, los);
      if (!(lo.type === "unit" && lo.parentLo.type === "course")) {
        los.push(lo);
      }
    }
    return los;
  }

  let truncated = [true, true, true, true, true, true, true];

  let unitId = "";

  function getUnitId(type: string, id: string) {
    if (type == "unit") {
      unitId = id;
    } else {
      unitId = "";
    }
    return unitId;
  }

  function truncate(input: string) {
    if (input.length > 16) {
      return input.substring(0, 15) + "...";
    }
    return input;
  }

  function title(input: string, truncated: boolean, i: number) {
    if (truncated === true) {
      return truncate(input);
    }
    return input;
  }
</script>

<div class="my-2 mx-8 overflow-hidden p-1">
  <Breadcrumb text="text-xs" separator=" ">
    {#if $currentCourse?.lo.properties?.parent != null}
      <Crumb href="/{$currentCourse.lo.properties?.parent}" class="!space-x-[-1rem] lg:!space-x-0">
        <svelte:fragment slot="lead"><Icon type="programHome" /></svelte:fragment>
      </Crumb>
    {/if}
    {#each crumbs($currentLo, []) as lo, i}
      <span class="mt-[0.1rem]">›</span>
      <Crumb href="{lo.route}{getUnitId(lo.type, lo.id)}" class="!space-x-[-1rem] lg:!space-x-0">
        <svelte:fragment slot="lead">
          <Icon type="{lo.type}" />
        </svelte:fragment>
        <span
          class="hidden lg:block"
          on:mouseenter="{() => {
            truncated[i] = false;
          }}"
          on:mouseleave="{() => {
            truncated[i] = true;
          }}">{title(lo.title, truncated[i], i)}</span
        >
      </Crumb>
    {/each}
  </Breadcrumb>
</div>
