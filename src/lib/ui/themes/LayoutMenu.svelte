<script lang="ts">
  import { currentCodeTheme, currentTheme, lightMode } from "$lib/runes";
  import Menu from "$lib/ui/components/Menu.svelte";
  import { layout } from "$lib/runes";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Icon from "../components/Icon.svelte";
  import { themeService } from "../../services/themes.svelte";
  import { courseService } from "$lib/services/course.svelte";
  import { markdownService } from "$lib/services/markdown.svelte";
  import { Combobox } from "@skeletonlabs/skeleton-svelte";

  interface ComboxData {
    label: string;
    value: string;
  }

  const themeCombo: ComboxData[] = [];
  themeService.themes.forEach((element) => {
    themeCombo.push({ label: element.name, value: element.name });
  });
  let theme = $state([currentTheme.value]);

  const codeThemeCombo: ComboxData[] = [];
  markdownService.codeThemes.forEach((element: { displayName: string; name: string }) => {
    codeThemeCombo.push({ label: element.displayName, value: element.name });
  });
  let codeTheme = $state([currentCodeTheme.value]);

  function toggleDisplayMode(): void {
    if (lightMode.value === "dark") {
      themeService.setDisplayMode("light");
    } else {
      themeService.setDisplayMode("dark");
    }
  }

  function toggleLayout() {
    if (layout.value === "compacted") {
      layout.value = "expanded";
    } else {
      layout.value = "compacted";
    }
  }

  $effect(() => {
    themeService.setTheme(theme[0]);
    markdownService.setCodeTheme(codeTheme[0]);
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
      type={lightMode.value}
      text={lightMode.value === "light" ? "Dark Mode" : "Light Mode"}
      onClick={toggleDisplayMode}
    />
    <MenuItem type={layout.value} text={layout.value === "compacted" ? "Expand" : "Compact"} onClick={toggleLayout} />
  </ul>
  <hr />
  <h6>Theme:</h6>
  <Combobox data={themeCombo} bind:value={theme} />
  <hr />
  <h6>Code Style</h6>
  <Combobox data={codeThemeCombo} bind:value={codeTheme} />
  <ul class="list"></ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
