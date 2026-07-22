<script lang="ts">
  import { searchOpen } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { t } from "$lib/services/i18n";
</script>

<button onclick={() => (searchOpen.value = true)} aria-label={t("nav.search.tip")}>
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary flex items-center gap-2 rounded-lg p-3 text-sm font-bold">
    <Icon type="search" tip={t("nav.search.tip")} />
    <span class="hidden lg:block">{t("nav.search")}</span>
  </div>
</button>
