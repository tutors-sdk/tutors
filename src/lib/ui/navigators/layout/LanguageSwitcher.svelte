<script lang="ts">
  import { locale, setLocale, SUPPORTED_LOCALES, type SupportedLocale } from "$lib/services/i18n";
  import { Combobox, Portal } from "@skeletonlabs/skeleton-svelte";

  const LOCALE_LABELS: Record<SupportedLocale, string> = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    es: "Español"
  };

  const localeItems = SUPPORTED_LOCALES.map((loc) => ({ label: LOCALE_LABELS[loc], value: loc }));
  let selectedLocale: string[] = $state([locale.value]);

  function changeLocale(value: string[]) {
    selectedLocale = value;
    setLocale(value[0] as SupportedLocale);
  }
</script>

<div class="relative z-10 mx-4 mb-2">
  <Combobox class="w-full max-w-md" placeholder={LOCALE_LABELS[selectedLocale[0] as SupportedLocale]} onValueChange={(e) => changeLocale(e.value!)}>
    <Combobox.Control>
      <Combobox.Input />
      <Combobox.Trigger />
    </Combobox.Control>
    <Portal>
      <Combobox.Positioner class="z-[1000]!">
        <Combobox.Content>
          {#each localeItems as item (item.value)}
            <Combobox.Item {item}>
              <Combobox.ItemText>{item.label}</Combobox.ItemText>
              <Combobox.ItemIndicator />
            </Combobox.Item>
          {/each}
        </Combobox.Content>
      </Combobox.Positioner>
    </Portal>
  </Combobox>
</div>
