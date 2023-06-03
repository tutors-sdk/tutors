<script lang="ts">
  import Icon from "../../Legacy/Atoms/Icon/Icon.svelte";
  import Iconify from "@iconify/svelte";
  export let image: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let iconColor: string | undefined = undefined;
</script>

<div class="card-body p-3">
  <figure class="flex justify-center object-scale-down p-1">  
    {#if image}
      <img src={image} class="w-56 h-56 rounded-md" />
    {/if}
    {#if icon}
    <Iconify icon="{icon}" color="{iconColor}" class="w-56 h-56" />
    {/if}
  </figure>
</div>