<script lang="ts">
  import Icon from "../../Legacy/Atoms/Icon/Icon.svelte";
  export let image: string | undefined = undefined;
  export let icon: string | undefined = undefined;
</script>

<div class="card-body">
  <figure class="flex justify-center object-scale-down p-1">  
    {#if image}
      <img src={image} class="w-56 h-56 rounded-md" />
    {/if}
    {#if icon}
      <Icon type="{icon}" />
    {/if}
  </figure>
</div>