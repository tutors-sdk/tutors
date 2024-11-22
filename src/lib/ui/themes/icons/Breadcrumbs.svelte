<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import { currentCourse, currentLo } from "$lib/runes";
  import Icon from "./Icon.svelte";
  let truncated = [true, true, true, true, true, true, true];

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

  let breadCrumbs: Lo[] = $derived(currentLo?.value?.breadCrumbs!);

  $effect(() => {
    breadCrumbs.forEach((lo) => {
      if (lo.route.endsWith("/")) {
        lo.route = lo.route.slice(0, -1);
      }
    });
    if (breadCrumbs.length > 2) {
      if (breadCrumbs[1].type === "unit" || breadCrumbs[1].type === "side") {
        breadCrumbs[1].route = breadCrumbs[1].route.replace("topic", "course");
      }
    }
  });
</script>

<div class="mx-8 my-2 overflow-hidden p-1">
  <ol class="breadcrumb-nonresponsive text-xs">
    {#if currentCourse?.value?.properties?.parent != null}
      <li class="crumb">
        <a href="/{currentCourse?.value?.properties?.parent}" class="!space-x-[-1rem] lg:!space-x-0">
          <Icon type="programHome" tip={`Go to Course Home`} />
        </a>
      </li>

      <li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
    {/if}

    {#if breadCrumbs}
      {#each breadCrumbs as lo, i}
        {#if i >= 1}
          <li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
        {/if}
        <li class="crumb">
          <a href={lo.route} class="inline-flex !space-x-[-1rem] !text-black dark:!text-white lg:!space-x-0">
            <span><Icon type={lo.type} tip={`Go to ${lo.title}`} /></span>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
              class="hidden items-center pl-2 lg:inline-flex"
              onmouseenter={() => {
                truncated[i] = false;
              }}
              onmouseleave={() => {
                truncated[i] = true;
              }}
              >{title(lo.title, truncated[i], i)}
            </span>
          </a>
        </li>
      {/each}
    {/if}
  </ol>
</div>
