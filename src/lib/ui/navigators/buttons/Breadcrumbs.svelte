<script lang="ts">
  import type { Lo } from "$lib/services/base/lo-types";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse, currentLo } from "$lib/runes.svelte";

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

<div class="mx-8 my-2 flex items-center overflow-hidden p-1">
  <ol class="flex w-full items-center gap-4">
    <li>
      <a class="hover:underline" href="/{currentCourse?.value?.properties?.parent}">
        <Icon type="programHome" tip={`Go to Course Home`} /></a
      >
    </li>
    <li aria-hidden="true">&rsaquo;</li>
    {#if breadCrumbs}
      {#each breadCrumbs as lo, i}
        {#if i >= 1}
          <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
        {/if}
        <li class="flex items-center hover:underline">
          <a href={lo.route} class="inline-flex !space-x-[-1rem] text-black lg:!space-x-0 dark:text-white">
            <Icon type={lo.type} tip={`Go to ${lo.title}`} />

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
              class="hidden items-center pl-2 text-xs lg:inline-flex"
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
