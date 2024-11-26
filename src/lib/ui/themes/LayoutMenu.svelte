<script lang="ts">
  import { setDisplayMode, setTheme, themes } from "./styles/icon-lib.svelte";
  import Icon from "./icons/Icon.svelte";
  import { lightMode } from "$lib/runes";
  import Menu from "$lib/ui/utils/Menu.svelte";
  import { layout } from "$lib/runes";
  import MenuItem from "$lib/ui/utils/MenuItem.svelte";

  function changeTheme(theme: string): void {
    setTheme(theme);
  }

  function toggleDisplayMode(): void {
    if (lightMode.value === "dark") {
      setDisplayMode("light");
    } else {
      setDisplayMode("dark");
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
    {#each themes as theme}
      <MenuItem type="lightMode" text={theme} onClick={() => changeTheme(theme)} />
    {/each}
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
