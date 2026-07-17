<script lang="ts">
  import { locale, setLocale, SUPPORTED_LOCALES, type SupportedLocale } from "$lib/services/i18n";

  const LOCALE_LABELS: Record<SupportedLocale, string> = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    es: "Español"
  };
</script>

<div class="flex flex-col gap-1">
  {#each SUPPORTED_LOCALES as loc}
    <button
      class="rounded px-3 py-1 text-left text-sm hover:bg-primary-200 dark:hover:bg-primary-700 {locale.value === loc ? 'font-bold bg-primary-100 dark:bg-primary-800' : ''}"
      onclick={() => setLocale(loc)}
      aria-current={locale.value === loc ? "true" : undefined}
    >
      {LOCALE_LABELS[loc]}
    </button>
  {/each}
</div>
