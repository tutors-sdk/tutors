<script lang="ts">
  import { currentCodeTheme, currentLo, currentTheme, lightMode } from "$lib/runes";
  import Menu from "$lib/ui/components/Menu.svelte";
  import { layout } from "$lib/runes";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Icon from "../components/Icon.svelte";
  import { themeService } from "./theme-controller.svelte";
  import { courseService } from "$lib/services/course.svelte";
  import { codeThemes } from "$lib/services/models/markdown-utils";

  function changeTheme(theme: string): void {
    themeService.setTheme(theme);
  }

  function changeCodeTheme(codeTheme: string): void {
    themeService.setCodeTheme(codeTheme);
    courseService.refreshAllLabs(codeTheme);
  }

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
</script>

{#snippet menuSelector()}
  <Icon type="lightMode" tip="Open Theme Menu" />
{/snippet}

{#snippet menuContent()}
  <h6>Toggles</h6>
  <ul>
    <MenuItem
      type={lightMode.value}
      text={lightMode.value === "light" ? "Dark Mode" : "Light Mode"}
      onClick={toggleDisplayMode}
    />
    <MenuItem type={layout.value} text={layout.value === "compacted" ? "Expand" : "Compact"} onClick={toggleLayout} />
  </ul>
  <hr />
  <h6>Themes</h6>
  <ul class="list">
    {#each themeService.themes as theme}
      <MenuItem
        type="lightMode"
        isActive={currentTheme.value === theme.name}
        text={theme.name}
        onClick={() => changeTheme(theme.name)}
      />
    {/each}
  </ul>
  <h6>Code Themes</h6>
  <ul class="list">
    {#each codeThemes as codeTheme}
      <MenuItem
        type="lightMode"
        isActive={currentCodeTheme.value === codeTheme.name}
        text={codeTheme.displayName}
        onClick={() => changeCodeTheme(codeTheme.name)}
      />
    {/each}
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
