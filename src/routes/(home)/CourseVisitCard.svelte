<script lang="ts">
  import { browser } from "$app/environment";
  import { scaleTransition } from "$lib/ui/navigators/animations";
  import Iconify from "@iconify/svelte";
  import { scale } from "svelte/transition";
  import { t } from "$lib/services/i18n";
  import { progressService } from "$lib/services/connect";
  import ProgressRing from "$lib/ui/components/ProgressRing.svelte";

  let { courseVisit, deleteCourse, starUnstarCourse } = $props();

  const progress = $derived.by(() => {
    void progressService.version.value;
    const visited = progressService.visitedLos.get(courseVisit.id);
    let total = progressService.totalTrackable.get(courseVisit.id);
    if (!total && browser) {
      const stored = localStorage.getItem(`loProgressTotal_${courseVisit.id}`);
      if (stored) total = parseInt(stored);
    }
    if (!visited || !total || visited.size === 0) return null;
    const count = visited.size;
    return { visited: count, total, percentage: Math.round((count / total) * 100) };
  });
</script>

<div
  transition:scale|local={scaleTransition}
  class="to-accent-50 dark:to-accent-900 card card-hover border-surface-200 dark:border-surface-400 from-primary-50 dark:from-primary-900 m-2 border bg-linear-to-l p-2"
>
  <div class="flex justify-between">
    <section class="p-4">
      <p class="line-clamp-1 font-bold">{courseVisit.title}</p>
      <p class="line-clamp-1">{courseVisit.credits}</p>
      <p class="line-clamp-1">
        {t("course.visitCard.lastAccessed")}
        {courseVisit.lastVisit?.slice(0, 10)}
        {courseVisit.lastVisit.slice(11, 19)}
      </p>
      <p>{t("course.visitCard.visits")} {courseVisit.visits}</p>
      {#if progress}
        <div class="mt-1 flex items-center gap-2">
          <ProgressRing percentage={progress.percentage} size={28} strokeWidth={2.5} />
          <span class="text-sm font-medium text-blue-500">{progress.percentage}% complete</span>
        </div>
      {/if}
    </section>
    <section class="content-center">
      {#if courseVisit.icon}
        <Iconify icon={courseVisit.icon.type} color={courseVisit.icon.color} height="96" />
      {:else}
        <img class="h-20" src={courseVisit.image} alt={courseVisit.title} />
      {/if}
    </section>
  </div>
  <footer class="card-footer p-0">
    <div class="flex w-full">
      <a class="variant-filled-primary btn hover:preset-tonal m-0 w-2/3 rounded-t-none rounded-br-none" href={"/course/" + courseVisit.id}>{t("course.visitCard.visitCourse")}</a>
      <button class="variant-filled-error btn hover:preset-tonal m-0 w-1/3 rounded-t-none rounded-bl-none" onclick={() => deleteCourse(courseVisit.id)}
        >{t("course.visitCard.delete")}</button
      >
      <button
        class="variant-filled-error btn hover:preset-tonal m-0 w-1/3 rounded-t-none rounded-bl-none"
        aria-label={courseVisit.favourite ? t("course.visitCard.unstar") : t("course.visitCard.star")}
        onclick={() => starUnstarCourse(courseVisit.id)}
      >
        <Iconify icon={courseVisit.favourite ? "openmoji:star" : "openmoji:black-star"} width="36" height="36" />
      </button>
    </div>
  </footer>
</div>
