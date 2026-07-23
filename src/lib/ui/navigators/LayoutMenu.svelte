<script lang="ts">
  import Menu from "$lib/ui/components/Menu.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import LanguageSwitcher from "./layout/LanguageSwitcher.svelte";
  import AppearanceSwitcher from "./layout/AppearanceSwitcher.svelte";
  import CardStyleSwitcher from "./layout/CardStyleSwitcher.svelte";
  import ThemeSwitcher from "./layout/ThemeSwitcher.svelte";
  import CodeThemeSwitcher from "./layout/CodeThemeSwitcher.svelte";
  import LayoutSwitcher from "./layout/LayoutSwitcher.svelte";
  import { t } from "$lib/services/i18n";
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary flex items-center rounded-lg p-4">
    <Icon type="lightMode" tip={t("nav.layout.tip")} />
    <span class="ml-2 hidden text-sm font-bold md:block">{t("nav.layout")}</span>
  </div>
{/snippet}

{#snippet menuContent()}
  <div class="ml-2 font-bold">{t("nav.layout.options")}</div>
  <div class="mt-5">
    <div class="mt-4 mb-1 ml-2">{t("nav.layout.appearance")}</div>
    <AppearanceSwitcher />
    <hr />
    <div class="mt-1 mb-1 ml-2">{t("nav.layout.cardStyle")}</div>
    <CardStyleSwitcher />
    <hr />
    <div class="mt-1 mb-1 ml-2">{t("nav.layout.theme")}</div>
    <ThemeSwitcher />
    <hr />
    <div class="mt-1 mb-1 ml-2">{t("nav.layout.codeStyle")}</div>
    <CodeThemeSwitcher />
    <hr />
    <div class="mt-1 mb-1 ml-2">{t("nav.layout.layout")}</div>
    <LayoutSwitcher />
    <hr />
    <div class="mt-1 mb-1 ml-2">{t("nav.layout.language")}</div>
    <LanguageSwitcher />
  </div>
{/snippet}

<Menu {menuSelector} {menuContent} />
