<script lang="ts">
  import { tutorsId } from "$lib/runes";
</script>

{#if tutorsId.value?.name}
  <span class="text-base">Connected as:</span>
  <p class="text-2xl">
    {tutorsId.value?.name}
    ({tutorsId.value?.login})
  </p>
{/if}
