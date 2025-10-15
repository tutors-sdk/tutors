<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { goto, invalidateAll } from "$app/navigation";

  let { lo,  compact = false }: { lo: Lo; indent: number; compact?: boolean } = $props();


</script>

<div class="flex {compact ? 'py-0.5 leading-tight' : 'py-1'}">
  <a
    href={lo?.route}
    class="flex"
    onclick={async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await goto(lo?.route);
    }}
  >
    <Icon type={lo.type} />
    <span class="mb-1 ml-2"> {@html lo.title} </span>
  </a>
  {#if lo.video && lo.type != "panelvideo"}
    <a
      class="flex pl-4"
      href={lo.video}
    onclick={async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await goto(lo?.video);
    }}
    >
      <Icon type="video" />
    </a>
  {/if}
</div>
