<script lang="ts">
  import { tutorsId } from "$lib/runes.svelte";
  import { t } from "$lib/services/i18n";
</script>

{#if tutorsId.value?.name}
  <span class="text-base">{t("home.connectedAs")}</span>
  <p class="text-2xl">
    {tutorsId.value?.name}
    ({tutorsId.value?.login})
  </p>
{/if}
