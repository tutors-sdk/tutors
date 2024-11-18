<script lang="ts">
  import { tutorsConnectService } from "$lib/services/connect.svelte";
</script>

{#if tutorsConnectService.tutorsId.value?.name}
  <span class="text-base">Connected as:</span>
  <p class="text-2xl">
    {tutorsConnectService.tutorsId.value?.name}
    ({tutorsConnectService.tutorsId.value?.login})
  </p>
{/if}
