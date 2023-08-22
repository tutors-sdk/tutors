<script lang="ts">
  export let href: string = "";
  export let label: string = "";
</script>

{#if href}
  <a class="btn btn-sm" {href}>
    <span class="text-sm font-bold block">{label}</span>
  </a>
{:else}
  <button class="btn btn-sm" on:click>
    <span class="text-sm font-bold block">{label}</span>
  </button>
{/if}
