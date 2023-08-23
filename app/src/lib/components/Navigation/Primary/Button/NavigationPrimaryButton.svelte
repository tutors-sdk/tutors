<script lang="ts">
  import Icon from "@iconify/svelte";
  export let href: string = "";
  export let label: string = "";
  export let icon: string = "";
  export let iconColour: string = "";
</script>

{#if href}
  <a class="btn btn-sm" {href}>
    <span class="text-sm font-bold inline-flex gap-2">
      {#if icon}<Icon {icon} color={iconColour} height="20" />{/if}
      {label}
    </span>
  </a>
{:else}
  <button class="btn btn-sm" on:click>
    <span class="text-sm font-bold inline-flex gap-2">
      {#if icon}<Icon {icon} color={iconColour} height="20" />{/if}
      {label}
    </span>
  </button>
{/if}
