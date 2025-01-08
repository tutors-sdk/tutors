<script lang="ts">
  import Menu from "$lib/ui/components/Menu.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { courseService } from "$lib/services/course/services/course.svelte";
  import { currentCodeTheme, markdownService } from "$lib/services/markdown/services/markdown.svelte";
  import { Combobox, Segment } from "@skeletonlabs/skeleton-svelte";
  import { currentCourse } from "$lib/runes.svelte";

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
    themeService.setLayout(themeService.layout.value);
    themeService.setCardStyle(themeService.cardStyle.value);
    themeService.setTheme(theme[0]);
    markdownService.setCodeTheme(codeTheme[0]);
    themeService.setDisplayMode(themeService.lightMode.value);
    if (currentCourse.value) {
      courseService.refreshAllLabs(theme[0]);
    }
  });
</script>

{#snippet menuSelector()}
  <Icon type="lightMode" tip="Open Theme Menu" />
{/snippet}

{#snippet menuContent()}
  <div class="mt-10 flex justify-center">
    <Segment name="cardStyle" bind:value={themeService.lightMode.value}>
      <Segment.Item value="dark"><Icon type="dark" /></Segment.Item>
      <Segment.Item value="light"><Icon type="light" /></Segment.Item>
    </Segment>
  </div>
  <hr />
  <div class="ml-2 mt-2">Layout</div>
  <div class="flex justify-center">
    <Segment name="layout" bind:value={themeService.layout.value}>
      <Segment.Item value="expanded"><Icon type="expanded" /></Segment.Item>
      <Segment.Item value="compacted"><Icon type="compacted" /></Segment.Item>
    </Segment>
  </div>
  <hr />
  <div class="ml-2">Card Style</div>
  <div class="flex justify-center">
    <Segment name="cardStyle" bind:value={themeService.cardStyle.value}>
      <Segment.Item value="portrait"><Icon type="portrait" tip="Change cards to Portrait" /></Segment.Item>
      <Segment.Item value="circular"><Icon type="circular" tip="Change cards to Circular" /></Segment.Item>
      <Segment.Item value="landscape"><Icon type="landscape" tip="Change cards to Landscape" /></Segment.Item>
    </Segment>
  </div>
  <hr />
  <div class="mb-2 ml-2">Theme</div>
  <div class="m-4">
    <Combobox data={themeCombo} bind:value={theme} />
  </div>
  <hr />
  <div class="mb-4 ml-2">Code Style</div>
  <div class="m-4">
    <Combobox data={codeThemeCombo} bind:value={codeTheme} />
  </div>
{/snippet}

<Menu {menuSelector} {menuContent} />
