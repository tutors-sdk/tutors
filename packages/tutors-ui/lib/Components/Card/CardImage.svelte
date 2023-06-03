<script lang="ts">
  import Icon from "../../Legacy/Atoms/Icon/Icon.svelte";
  import Iconify from "@iconify/svelte";
  export let image: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let iconColor: string | undefined = undefined;
</script>

<div class="card-body m-3 h-36 items-center">
  <figure class="flex justify-center object-scale-down p-1">  
    {#if image}
      <img src={image} class="max-w-36 max-h-36 rounded-md" />
    {/if}
    {#if icon}
      <Iconify icon={icon} color="{iconColor}" class="w-36 h-36" />
    {/if}
  </figure>
</div>