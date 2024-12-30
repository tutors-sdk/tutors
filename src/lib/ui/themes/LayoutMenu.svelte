<script lang="ts">
  import Menu from "$lib/ui/components/Menu.svelte";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Icon from "../components/Icon.svelte";
  import { themeService } from "../../services/themes.svelte";
  import { courseService } from "$lib/services/course.svelte";
  import { currentCodeTheme, markdownService } from "$lib/services/markdown.svelte";
  import { Combobox } from "@skeletonlabs/skeleton-svelte";

  interface ComboxData {
    label: string;
    value: string;
  }

  const themeCombo: ComboxData[] = [];
  themeService.themes.forEach((element) => {
    themeCombo.push({ label: element.name, value: element.name });
  });
  let theme = $state([themeService.currentTheme.value]);

  const codeThemeCombo: ComboxData[] = [];
  markdownService.codeThemes.forEach((element: { displayName: string; name: string }) => {
    codeThemeCombo.push({ label: element.displayName, value: element.name });
  });
  let codeTheme = $state([currentCodeTheme.value]);

  const cardStyleCombo: ComboxData[] = [
    { label: "Portrait", value: "portrait" },
    { label: "Landscape", value: "landscape" }
  ];
  let cardStyle = $state([themeService.cardStyle.value]);

  function toggleDisplayMode(): void {
    themeService.toggleDisplayMode();
  }

  function toggleLayout() {
    themeService.toggleLayout();
  }

  $effect(() => {
    themeService.setTheme(theme[0]);
    markdownService.setCodeTheme(codeTheme[0]);
    themeService.setCardStyle(cardStyle[0]);
    courseService.refreshAllLabs(codeTheme[0]);
  });
</script>

{#snippet menuSelector()}
  <Icon type="lightMode" tip="Open Theme Menu" />
{/snippet}

{#snippet menuContent()}
  <h6>Appearance</h6>

  <ul>
    <MenuItem
      type={themeService.lightMode.value}
      text={themeService.lightMode.value === "light" ? "Dark Mode" : "Light Mode"}
      onClick={toggleDisplayMode}
    />
    <MenuItem
      type={themeService.layout.value}
      text={themeService.layout.value === "compacted" ? "Expand" : "Compact"}
      onClick={toggleLayout}
    />
  </ul>
  <hr />
  <h6>Theme:</h6>
  <Combobox data={themeCombo} bind:value={theme} />
  <hr />
  <h6>Code Style</h6>
  <Combobox data={codeThemeCombo} bind:value={codeTheme} />
  <hr />
  <h6>Card Style</h6>
  <Combobox data={cardStyleCombo} bind:value={cardStyle} />
  <ul class="list"></ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
