<script lang="ts">
  export let value = 0;
  export let title = "";
</script>

{#if value}
  <span class="ml-12 mr-6">
    <span class="badge text-primary-100 bg-warning-400">{value}</span>
    <h2 class="text-primary-500 hidden text-xs md:inline-block">{title}</h2>
  </span>
{/if}
