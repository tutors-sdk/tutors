<script lang="ts">
  import Menu from "$lib/ui/components/Menu.svelte";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import IconifyIcon from "@iconify/svelte";
  import { themeService } from "../../services/themes.svelte";
  import { courseService } from "$lib/services/course.svelte";
  import { currentCodeTheme, markdownService } from "$lib/services/markdown.svelte";
  import { Combobox, Segment } from "@skeletonlabs/skeleton-svelte";

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

  $effect(() => {
    themeService.setTheme(theme[0]);
    markdownService.setCodeTheme(codeTheme[0]);
    themeService.setDisplayMode(themeService.lightMode.value);
    courseService.refreshAllLabs(codeTheme[0]);
  });
</script>

{#snippet menuSelector()}
  <Icon type="lightMode" tip="Open Theme Menu" />
{/snippet}

{#snippet menuContent()}
  <div class="mt-8 flex justify-center">
    <Segment name="cardStyle" bind:value={themeService.lightMode.value}>
      <Segment.Item value="dark"><Icon type="dark" /></Segment.Item>
      <Segment.Item value="light"><Icon type="light" /></Segment.Item>
    </Segment>
  </div>
  <hr />
  <h6>Layout</h6>
  <div class="mt-8 flex justify-center">
    <Segment name="layout" bind:value={themeService.layout.value}>
      <Segment.Item value="expanded"><Icon type="expanded" /></Segment.Item>
      <Segment.Item value="compacted"><Icon type="compacted" /></Segment.Item>
    </Segment>
  </div>
  <hr />
  <h6>Card Style</h6>
  <Segment name="cardStyle" bind:value={themeService.cardStyle.value}>
    <Segment.Item value="portrait"
      ><IconifyIcon icon="fluent:rectangle-portrait-location-target-20-regular" /></Segment.Item
    >
    <Segment.Item value="circular"><IconifyIcon icon="fluent:circle-sparkle-28-regular" /></Segment.Item>
    <Segment.Item value="landscape"><IconifyIcon icon="fluent:rectangle-landscape-sparkle-48-regular" /></Segment.Item>
  </Segment>

  <hr />
  <h6>Theme</h6>
  <Combobox data={themeCombo} bind:value={theme} />
  <hr />
  <h6>Code Style</h6>
  <Combobox data={codeThemeCombo} bind:value={codeTheme} />
{/snippet}

<Menu {menuSelector} {menuContent} />
