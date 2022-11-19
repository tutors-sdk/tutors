<script lang="ts">
  export let value = 0;
  export let title = "";
</script>

{#if value}
  <span class="ml-12 mr-6">
    <span class="badge bg-tertiary-500">{value}</span>
    <h2 class="mr-4 text-sm md:inline-block">{title}</h2>
  </span>
{/if}
