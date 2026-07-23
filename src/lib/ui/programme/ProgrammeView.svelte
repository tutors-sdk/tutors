<script lang="ts">
  import type { Programme } from "$lib/services/programme";
  import Card from "$lib/ui/learning-objects/layout/Card.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  interface Props {
    programme: Programme;
  }
  let { programme }: Props = $props();
</script>

<div class="mx-auto max-w-7xl p-4">
  <div class="card preset-filled-surface-100-900 m-4 border border-surface-200 p-6 dark:border-surface-700">
    <div class="flex items-center gap-6">
      {#if programme.icon}
        <Icon type="programme" height="60" />
      {:else if programme.img}
        <img src={programme.img} alt={programme.title} class="h-20 rounded-xl" />
      {/if}
      <div>
        <h1 class="text-3xl font-bold">{programme.title}</h1>
        <p class="mt-2 text-lg opacity-80">{programme.summary}</p>
        {#if programme.properties?.credits}
          <p class="mt-1 text-sm opacity-60">{programme.properties.credits}</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex flex-wrap justify-center">
    {#each programme.courses as course}
      <Card
        cardDetails={{
          route: course.route,
          title: course.title,
          type: "course",
          summary: course.credits ?? course.summary,
          img: course.img,
          icon: course.icon
        }}
        cardLayout={{
          layout: "compacted",
          style: "landscape"
        }}
      />
    {/each}
  </div>
</div>
