<script lang="ts">
  import { scaleTransition } from "$lib/ui/navigators/animations";
  import Iconify from "@iconify/svelte";
  import { scale } from "svelte/transition";

  let { courseVisit, deleteCourse, starUnstarCourse } = $props();

  let confirmingDelete = $state(false);

  function formatRelative(value: unknown): string {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value as string);
    if (Number.isNaN(date.getTime())) return "";
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);
    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  const lastVisitLabel = $derived(formatRelative(courseVisit.lastVisit));

  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirmingDelete) {
      confirmingDelete = true;
      setTimeout(() => (confirmingDelete = false), 3000);
      return;
    }
    deleteCourse(courseVisit.id);
  }

  function handleStar(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    starUnstarCourse(courseVisit.id);
  }
</script>

<div
  transition:scale|local={scaleTransition}
  class="card to-accent-50 border-surface-200 dark:border-surface-400 dark:to-accent-900 from-primary-50 dark:from-primary-900 group relative m-2 overflow-hidden border bg-linear-to-l transition-all hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary-500"
>
  <a
    href={"/course/" + courseVisit.id}
    class="block focus:outline-none"
    aria-label={`Open course ${courseVisit.title}`}
  >
    <div class="flex justify-between gap-2 p-4">
      <section class="min-w-0 flex-1">
        <p class="line-clamp-2 text-base font-bold leading-snug" title={courseVisit.title}>
          {courseVisit.title}
        </p>
        {#if courseVisit.credits}
          <p class="line-clamp-1 text-sm opacity-80" title={courseVisit.credits}>
            {courseVisit.credits}
          </p>
        {/if}
        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-70">
          {#if lastVisitLabel}
            <span class="inline-flex items-center gap-1">
              <Iconify icon="ph:clock" width="14" height="14" />
              {lastVisitLabel}
            </span>
          {/if}
          {#if courseVisit.visits}
            <span class="inline-flex items-center gap-1">
              <Iconify icon="ph:eye" width="14" height="14" />
              {courseVisit.visits} visit{courseVisit.visits === 1 ? "" : "s"}
            </span>
          {/if}
          {#if courseVisit.private}
            <span class="inline-flex items-center gap-1">
              <Iconify icon="ph:lock" width="14" height="14" />
              Private
            </span>
          {/if}
        </div>
      </section>
      <section class="flex shrink-0 items-center">
        {#if courseVisit.icon}
          <Iconify icon={courseVisit.icon.type} color={courseVisit.icon.color} height="80" />
        {:else if courseVisit.image}
          <img class="h-20" src={courseVisit.image} alt="" />
        {/if}
      </section>
    </div>

    <div class="bg-primary-500/90 flex items-center justify-center px-4 py-2 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
      <Iconify icon="ph:arrow-right-bold" width="16" height="16" />
      <span class="ml-2">Open course</span>
    </div>
  </a>

  <button
    type="button"
    onclick={handleStar}
    aria-label={courseVisit.favourite ? `Remove ${courseVisit.title} from favourites` : `Add ${courseVisit.title} to favourites`}
    aria-pressed={courseVisit.favourite}
    class="absolute top-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-amber-500 shadow-sm backdrop-blur transition hover:scale-110 hover:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none dark:bg-surface-800/70 dark:hover:bg-surface-800"
  >
    <Iconify icon={courseVisit.favourite ? "ph:star-fill" : "ph:star"} width="20" height="20" />
  </button>

  <button
    type="button"
    onclick={handleDelete}
    aria-label={confirmingDelete ? `Confirm remove ${courseVisit.title}` : `Remove ${courseVisit.title} from history`}
    class="absolute top-2 right-12 inline-flex h-9 items-center gap-1 rounded-full px-2 text-xs shadow-sm backdrop-blur transition focus:outline-none focus:ring-2 {confirmingDelete
      ? 'bg-error-500 text-white focus:ring-error-500'
      : 'bg-white/70 text-surface-700 hover:text-error-500 focus:ring-error-500 dark:bg-surface-800/70 dark:text-surface-200'}"
  >
    <Iconify icon={confirmingDelete ? "ph:check-bold" : "ph:trash"} width="16" height="16" />
    {#if confirmingDelete}
      <span class="font-semibold">Confirm</span>
    {/if}
  </button>
</div>
