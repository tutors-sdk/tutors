<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import Icon from "$lib/ui/components/Icon.svelte";
  import TutorsIcon from "$lib/ui/components/TutorsIcon.svelte";

  let { lo, parentCourse = null } = $props();

  let breadCrumbs: Lo[] = $derived(lo?.breadCrumbs!);
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
</script>

<div class="mx-8 my-2 flex items-center overflow-hidden p-1">
  <ol class="flex w-full items-center gap-4">
    <li class="mb-1">
      <a class="hover:underline" href="/"> <TutorsIcon widthPlease="25px" /></a>
    </li>
    <li class="mb-1 opacity-50" aria-hidden="true">&rsaquo;</li>
    {#if parentCourse}
      <li>
        <a class="hover:underline" href="/{parentCourse}"> <Icon type="programHome" tip={`Go to Course Home`} /></a>
      </li>
      <li class="mb-1 opacity-50" aria-hidden="true">&rsaquo;</li>
    {/if}

    {#if breadCrumbs}
      {#each breadCrumbs as lo, i}
        {#if i >= 1}
          <li class="mb-1 opacity-50" aria-hidden="true">&rsaquo;</li>
        {/if}
        <li class="flex items-center hover:underline">
          <a href={lo.route} class="inline-flex space-x-[-1rem]! text-black lg:space-x-0! dark:text-white">
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
