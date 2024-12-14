<script lang="ts">
  import { currentCodeTheme, currentTheme, lightMode } from "$lib/runes";
  import Menu from "$lib/ui/components/Menu.svelte";
  import { layout } from "$lib/runes";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Icon from "../components/Icon.svelte";
  import { themeService } from "./theme-controller.svelte";
  import { courseService } from "$lib/services/course.svelte";
  import { markdownService } from "$lib/services/markdown.svelte";
  import { Segment } from "@skeletonlabs/skeleton-svelte";

  let theme = $state(currentTheme.value);
  let codeTheme = $state(currentCodeTheme.value);

  function changeTheme(theme: string): void {
    themeService.setTheme(theme);
  }

  function codeThemeChange(codeTheme: string): void {
    markdownService.setCodeTheme(codeTheme);
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

  $effect(() => {
    markdownService.setCodeTheme(codeTheme);
    courseService.refreshAllLabs(codeTheme);
    themeService.setTheme(theme);
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
  <h6>Themes</h6>
  <ul class="list">
    <Segment name="theme" bind:value={theme} orientation="vertical" classes="flex w-full" indicatorBg="bg-primary-500">
      {#each themeService.themes as theme}
        <Segment.Item value={theme.name}>
          <span class="flex-grow">{theme.name}</span>
        </Segment.Item>
      {/each}
    </Segment>
  </ul>
  <hr />
  <h6>Code Style</h6>
  <ul class="list">
    <Segment
      name="codeTheme"
      bind:value={codeTheme}
      orientation="vertical"
      indicatorBg="bg-primary-500"
      classes="flex w-full"
    >
      {#each markdownService.codeThemes as codeTheme}
        <Segment.Item value={codeTheme.name}>
          <div class="flex w-full justify-between">
            <span class="text-left">{codeTheme.displayName}</span>
          </div>
        </Segment.Item>
      {/each}
    </Segment>
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
