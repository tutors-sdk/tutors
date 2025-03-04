<script lang="ts">
  import Menu from "$lib/ui/components/Menu.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { courseService } from "$lib/services/course";
  import { currentCodeTheme, markdownService } from "$lib/services/markdown";
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

  function changeTheme(theme: string[]) {
    themeService.setTheme(theme[0]);
  }

  function changeCodeTheme() {
    markdownService.setCodeTheme(codeTheme[0]);
    if (currentCourse.value) {
      courseService.refreshAllLabs(theme[0]);
    }
  }
</script>

{#snippet menuSelector()}
  <div class="flex items-center">
    <Icon type="lightMode" tip="Open Theme Menu" />
    <span class="ml-2 hidden text-sm font-bold md:block">Layout</span>
  </div>
{/snippet}

{#snippet menuContent()}
  <div class="ml-2 font-bold">Layout Options</div>
  <div class="mt-5">
    <div class="mt-4 mb-1 ml-2">Appearance</div>
    <div class="mb-2 flex justify-center">
      <Segment name="lightMode" value={themeService.lightMode.value} onValueChange={(e) => themeService.setDisplayMode(e.value!)}>
        <Segment.Item value="dark"><Icon type="dark" /></Segment.Item>
        <Segment.Item value="light"><Icon type="light" /></Segment.Item>
      </Segment>
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Card Style</div>
    <div class="mb-2 flex justify-center">
      <Segment name="cardStyle" value={themeService.cardStyle.value} onValueChange={(e) => themeService.setCardStyle(e.value!)}>
        <Segment.Item value="portrait"><Icon type="portrait" tip="Change cards to Portrait" /></Segment.Item>
        <Segment.Item value="circular"><Icon type="circular" tip="Change cards to Circular" /></Segment.Item>
        <Segment.Item value="landscape"><Icon type="landscape" tip="Change cards to Landscape" /></Segment.Item>
      </Segment>
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Theme</div>
    <div class="relative z-50 mx-4 mb-2">
      <Combobox data={themeCombo} placeholder={[themeService.currentTheme.value]} onValueChange={(e) => ((theme = e.value), changeTheme(e.value!))} />
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Code Style</div>
    <div class="relative z-10 mx-4 mb-2">
      <Combobox data={codeThemeCombo} placeholder={codeTheme} onValueChange={(e) => ((codeTheme = e.value), changeCodeTheme())} />
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Layout</div>
    <div class="mb-2 flex justify-center">
      <Segment name="layout" value={themeService.layout.value} onValueChange={(e) => themeService.setLayout(e.value!)}>
        <Segment.Item value="expanded"><Icon type="expanded" /></Segment.Item>
        <Segment.Item value="compacted"><Icon type="compacted" /></Segment.Item>
      </Segment>
    </div>
  </div>
{/snippet}

<Menu {menuSelector} {menuContent} />
