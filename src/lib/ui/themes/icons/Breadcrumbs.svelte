<script lang="ts">
  import { currentCourse, currentLo } from "$lib/stores";
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

  interface Crumb {
    route: string;
    type: string;
    title: string;
  }
  let breadCrumbs: Crumb[] = [];

  currentLo.subscribe((lo) => {
    breadCrumbs = [];
    lo.breadCrumbs?.forEach((lo) => {
      let route = lo.route;
      if (route.endsWith("/")) {
        route = route.slice(0, -1);
      }
      breadCrumbs.push({ route: route, type: lo.type, title: lo.title });
    });
    if (breadCrumbs.length === 3) {
      const segments = breadCrumbs[1].route.split("/");
      if (segments[1] === "topic" && segments[2] === $currentCourse.courseId) {
        breadCrumbs[1].route = breadCrumbs[1].route.replace("topic", "course");
      }
      console.log(segments);
    }
    console.log(breadCrumbs);
  });
</script>

<div class="my-2 mx-8 overflow-hidden p-1">
  <ol class="breadcrumb-nonresponsive text-xs">
    {#if $currentCourse?.properties?.parent != null}
      <li class="crumb">
        <a href="/{$currentCourse.properties?.parent}" class="!space-x-[-1rem] lg:!space-x-0">
          <Icon type="programHome" tip={`Go to Course Home`} />
        </a>
      </li>

      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
    {/if}
    {#if breadCrumbs}
      {#each breadCrumbs as lo, i}
        {#if i >= 1}
          <li class="crumb-separator" aria-hidden>&rsaquo;</li>
        {/if}
        <li class="crumb">
          <a href={lo.route} class="!space-x-[-1rem] lg:!space-x-0 inline-flex !text-black dark:!text-white">
            <span><Icon type={lo.type} tip={`Go to ${lo.title}`} /></span>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
              class="hidden lg:inline-flex pl-2 items-center"
              on:mouseenter={() => {
                truncated[i] = false;
              }}
              on:mouseleave={() => {
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
