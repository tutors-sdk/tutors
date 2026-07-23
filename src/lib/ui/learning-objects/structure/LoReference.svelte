<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Iconify from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import { sanitizeHtml } from "$lib/utils/sanitize";
  import { progressService } from "$lib/services/connect";
  import { currentCourse } from "$lib/runes.svelte";

  let { lo }: { lo: Lo } = $props();

  const visited = $derived.by(() => {
    if (!currentCourse.value) return false;
    return progressService.isVisited(currentCourse.value.courseId, lo.route);
  });

  const handleClick = async (e: MouseEvent, href?: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!href) return;
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.open(url.toString(), "_blank", "noopener,noreferrer");
        return;
      }
    } catch {
      // If URL parsing fails, fall back to internal navigation
    }
    await goto(href);
  };
</script>

<div class="py-0.2 flex w-full leading-tight transition-opacity duration-200 {visited ? 'opacity-100' : 'opacity-60'}">
  <a href={lo?.route} class="flex items-center" onclick={(e) => handleClick(e, lo?.route)}>
    <span class="shrink-0">
      <Icon type={lo.type} width="20" height="20" />
    </span>
    <span class="mb-1 ml-2"> {@html sanitizeHtml(lo.title ?? "")} </span>
    {#if visited}
      <span class="ml-1 shrink-0 text-blue-500">
        <Iconify icon="mdi:check-circle-outline" width="14" height="14" />
      </span>
    {/if}
  </a>
  {#if lo.video && lo.type != "panelvideo"}
    <a class="ml-auto flex pl-4" href={lo.video} onclick={(e) => handleClick(e, lo?.video)}>
      <span class="shrink-0">
        <Icon type="video" width="20" height="20" />
      </span>
    </a>
  {/if}
</div>
