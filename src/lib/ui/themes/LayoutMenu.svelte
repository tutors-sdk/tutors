<script lang="ts">
  import { currentTheme, lightMode } from "$lib/runes";
  import Menu from "$lib/ui/components/Menu.svelte";
  import { layout } from "$lib/runes";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Icon from "../components/Icon.svelte";
  import { themeService } from "./theme-controller.svelte";

  function changeTheme(theme: string): void {
    themeService.setTheme(theme);
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
{/snippet}

<Menu {menuSelector} {menuContent} />
