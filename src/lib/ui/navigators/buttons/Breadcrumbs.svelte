<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import Icon from "$lib/ui/components/Icon.svelte";
  import TutorsIcon from "$lib/ui/components/TutorsIcon.svelte";

  let { lo, parentCourse = null } = $props();

  let breadCrumbs: Lo[] = $derived(lo?.breadCrumbs!);
  // Track expanded crumbs reactively (Svelte 5 runes-aware state).
  let expanded: boolean[] = $state([]);

  const MAX_LEN = 28;
  function truncate(input: string) {
    if (input && input.length > MAX_LEN) {
      return input.substring(0, MAX_LEN - 1).trimEnd() + "…";
    }
    return input;
  }
</script>

<div class="mx-4 my-2 flex items-center overflow-hidden p-1 sm:mx-6 lg:mx-8">
  <ol class="flex w-full items-center gap-2 min-w-0">
    <li class="flex items-center">
      <a class="inline-flex items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none" href="/" aria-label="Tutors home">
        <TutorsIcon widthPlease="25px" />
      </a>
    </li>
    <li class="flex items-center opacity-50" aria-hidden="true">&rsaquo;</li>
    {#if parentCourse}
      <li class="flex items-center">
        <a
          class="inline-flex items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
          href="/{parentCourse}"
          aria-label="Go to parent course"
        >
          <Icon type="programHome" tip={`Go to Course Home`} />
        </a>
      </li>
      <li class="flex items-center opacity-50" aria-hidden="true">&rsaquo;</li>
    {/if}

    {#if breadCrumbs}
      {#each breadCrumbs as crumb, i}
        {#if i >= 1}
          <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
        {/if}
        <li class="flex items-center min-w-0 flex-shrink-0">
          <a
            href={crumb.route}
            class="inline-flex items-center gap-1 rounded text-black hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none dark:text-white"
            aria-label={`Go to ${crumb.title}`}
          >
            <Icon type={crumb.type} tip={`Go to ${crumb.title}`} />
            <span
              class="hidden items-center pl-2 text-xs md:inline-flex"
              onmouseenter={() => (expanded[i] = true)}
              onmouseleave={() => (expanded[i] = false)}
              onfocusin={() => (expanded[i] = true)}
              onfocusout={() => (expanded[i] = false)}
            >
              {expanded[i] ? crumb.title : truncate(crumb.title)}
            </span>
          </a>
        </li>
      {/each}
    {/if}
  </ol>
</div>
