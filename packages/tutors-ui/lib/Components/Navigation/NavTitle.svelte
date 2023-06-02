<script lang="ts">
  import Icon from "../../Legacy/Atoms/Icon/Icon.svelte";

  export let image: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let iconColor: string | undefined = undefined;
  export let title: string;
  export let subtitle: string | undefined = undefined;
</script>
<div class="w-12">
  <div class="inline-flex">
    {#if image}
      <img src={image} class="w-12 h-12 rounded-md" />
    {:else if icon}
      <Icon icon={icon} class="text-{iconColor}" width="40" height="40" />
    {/if}
  </div>
</div>
<div class="ml-4 flex-nowrap">
  <h2 class="mr-4 hidden !text-sm font-bold sm:!text-lg md:inline-block">{title}</h2>
  <div class="hidden md:block">
      <p class="text-sm font-bold">{subtitle}</p>
  </div>
</div>