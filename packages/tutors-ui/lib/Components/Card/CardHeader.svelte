<script lang="ts">
  import Icon from "../../Legacy/Atoms/Icon/Icon.svelte";
  export let type: string;
  export let title: string;
  export let video: string | undefined = undefined;
</script>


<header class="card-header flex flex-row items-center justify-between p-3">
  <div class="inline-flex w-full">
    <div class="line-clamp-2 flex-auto !text-black dark:!text-white">{title}</div>
    {#if video}
      <a href="{video}">
        <Icon type="video" />
      </a>
    {/if}
    <div class="flex-none"><Icon type="{type}" /></div>
  </div>
</header>