<script lang="ts">
  import Icon from "@iconify/svelte";

  export let title: string = "";
  export let subtitle: string = "";
  export let image: string = "";
  export let icon: string = "";
  export let iconColour: string = "";
</script>

<div class="flex items-center">
  <div class="inline-flex">
    {#if image}
      <img src={image} alt={title} class="w-12 bg-none" />
    {:else if icon}
      <Icon {icon} color="#{iconColour}" width="48" height="48" />
    {/if}
  </div>
  <div class="ml-4 flex-nowrap">
    <h2 class="mr-4 hidden font-bold md:inline-block {subtitle ? 'text-lg' : 'text-2xl'}">
      {title}
    </h2>
    <div class="hidden md:block">
      <p class="text-sm font-bold">{subtitle}</p>
    </div>
  </div>
</div>
