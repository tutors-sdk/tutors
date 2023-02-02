<script lang="ts">
  import { currentCourse, currentLo } from "tutors-reader-lib/src/stores/stores";
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
  <ol class="breadcrumb-nonresponsive text-xs">
    {#if $currentCourse?.lo.properties?.parent != null}
      <li class="crumb">
        <a href="/{$currentCourse.lo.properties?.parent}" class="!space-x-[-1rem] lg:!space-x-0">
          <Icon type="programHome" />
        </a>
      </li>

      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
    {/if}
    {#each crumbs($currentLo, []) as lo, i}
      {#if i >= 1}
        <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      {/if}
      <li class="crumb">
        <a href="{lo.route}{getUnitId(lo.type, lo.id)}" class="!space-x-[-1rem] lg:!space-x-0 inline-flex !text-black dark:!text-white">
          <span><Icon type="{lo.type}" /></span>
          <span
            class="hidden lg:inline-flex pl-2 items-center"
            on:mouseenter="{() => {
              truncated[i] = false;
            }}"
            on:mouseleave="{() => {
              truncated[i] = true;
            }}">{title(lo.title, truncated[i], i)}</span
          >
        </a>
      </li>
    {/each}
  </ol>
</div>
