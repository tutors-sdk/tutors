<script lang="ts">
  import { tutorsConnectService, type CourseVisit } from "$lib/services/connect";
  import { onMount } from "svelte";
  import Iconify from "@iconify/svelte";
  import CourseVisitCard from "./CourseVisitCard.svelte";

  let courseVisits: CourseVisit[] = $state([]);
  let isLoading = $state(true);
  let query = $state("");

  onMount(async () => {
    try {
      courseVisits = await tutorsConnectService.getCourseVisits();
    } finally {
      isLoading = false;
    }
  });

  function deleteCourse(id: string) {
    tutorsConnectService.deleteCourseVisit(id);
    courseVisits = courseVisits.filter((c) => c.id !== id);
  }

  async function starUnstarCourse(id: string) {
    const course = courseVisits.find((c) => c.id === id);
    if (course) {
      if (course.favourite) {
        await tutorsConnectService.unfavouriteCourse(course.id);
      } else {
        await tutorsConnectService.favouriteCourse(course.id);
      }
    }
    courseVisits = await tutorsConnectService.getCourseVisits();
  }

  const normalisedQuery = $derived(query.trim().toLowerCase());
  const filtered = $derived(
    normalisedQuery.length === 0
      ? courseVisits
      : courseVisits.filter((c) =>
          [c.title, c.credits, c.id].filter(Boolean).some((v) => String(v).toLowerCase().includes(normalisedQuery))
        )
  );
  const favourites = $derived(filtered.filter((c) => c.favourite));
  const recents = $derived(filtered.filter((c) => !c.favourite));
</script>

<div class="container card mx-auto my-1 p-4">
  <div class="mb-2 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-2xl font-bold leading-tight">Your courses</h2>
      <p class="text-sm opacity-70">
        {#if isLoading}
          Loading your courses…
        {:else if courseVisits.length === 0}
          You haven&apos;t opened any courses yet.
        {:else}
          {courseVisits.length} course{courseVisits.length === 1 ? "" : "s"}
          &middot; {favourites.length} favourite{favourites.length === 1 ? "" : "s"}
        {/if}
      </p>
    </div>

    {#if courseVisits.length > 0}
      <label class="relative block w-full sm:w-72">
        <span class="sr-only">Search your courses</span>
        <span class="absolute top-1/2 left-3 -translate-y-1/2 opacity-60">
          <Iconify icon="ph:magnifying-glass" width="16" height="16" />
        </span>
        <input
          type="search"
          bind:value={query}
          placeholder="Search your courses"
          class="input bg-surface-50 dark:bg-surface-900 border-surface-300 dark:border-surface-600 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
      </label>
    {/if}
  </div>

  {#if isLoading}
    <div class="grid grid-cols-1 gap-2 px-2 lg:grid-cols-2 xl:grid-cols-3">
      {#each [0, 1, 2] as i (i)}
        <div class="bg-surface-200/60 dark:bg-surface-800/60 m-2 h-36 animate-pulse rounded-lg"></div>
      {/each}
    </div>
  {:else if courseVisits.length === 0}
    <div class="mx-2 my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 dark:border-surface-600 px-6 py-12 text-center">
      <Iconify icon="ph:books" width="48" height="48" class="opacity-40" />
      <p class="mt-3 text-lg font-semibold">No courses yet</p>
      <p class="mt-1 max-w-md text-sm opacity-70">
        Visit a course to see it here. Start with the reference course or browse the public catalogue.
      </p>
      <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
        <a class="btn preset-filled-primary-500 rounded-md px-4 py-2 text-sm font-semibold" href="/course/tutors-reference-manual">
          Open reference manual
        </a>
        <a class="btn preset-tonal rounded-md px-4 py-2 text-sm font-semibold" href="/catalogue">
          Browse catalogue
        </a>
      </div>
    </div>
  {:else if filtered.length === 0}
    <div class="mx-2 my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 dark:border-surface-600 px-6 py-12 text-center">
      <Iconify icon="ph:magnifying-glass" width="40" height="40" class="opacity-40" />
      <p class="mt-3 text-lg font-semibold">No matches for &ldquo;{query}&rdquo;</p>
      <button class="mt-3 text-sm font-semibold text-primary-600 hover:underline" onclick={() => (query = "")}>
        Clear search
      </button>
    </div>
  {:else}
    {#if favourites.length > 0}
      <section aria-labelledby="favourites-heading" class="mb-2">
        <h3 id="favourites-heading" class="flex items-center gap-2 px-2 py-3 text-lg font-semibold">
          <Iconify icon="ph:star-fill" color="rgb(245 158 11)" width="20" height="20" />
          Favourites
          <span class="text-sm font-normal opacity-60">({favourites.length})</span>
        </h3>
        <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {#each favourites as courseVisit (courseVisit.id)}
            <CourseVisitCard {courseVisit} {deleteCourse} {starUnstarCourse} />
          {/each}
        </div>
      </section>
    {/if}

    {#if recents.length > 0}
      <section aria-labelledby="recent-heading" class="mt-2">
        <h3 id="recent-heading" class="flex items-center gap-2 px-2 py-3 text-lg font-semibold">
          <Iconify icon="ph:clock-counter-clockwise" width="20" height="20" />
          Recently accessed
          <span class="text-sm font-normal opacity-60">({recents.length})</span>
        </h3>
        <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {#each recents as courseVisit (courseVisit.id)}
            <CourseVisitCard {courseVisit} {deleteCourse} {starUnstarCourse} />
          {/each}
        </div>
      </section>
    {/if}
  {/if}
</div>
