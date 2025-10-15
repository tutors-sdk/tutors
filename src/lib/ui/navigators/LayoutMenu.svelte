<script lang="ts">
  import Menu from "$lib/ui/components/Menu.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { courseService } from "$lib/services/course";
  import { currentCodeTheme, markdownService } from "$lib/services/markdown";

  import { Combobox, SegmentedControl, Portal } from "@skeletonlabs/skeleton-svelte";
  import { currentCourse } from "$lib/runes.svelte";

  interface ComboxData {
    label: string;
    value: string;
  }

  let theme = $state([themeService.currentTheme.value]);
  let themes = $state(themeService.themes.map((element) => ({ label: element.name, value: element.name })));
  const onOpenChange = () => {
    themes = themeService.themes.map((element) => ({ label: element.name, value: element.name }));
  };

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
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary flex items-center rounded-lg p-4">
    <Icon type="lightMode" tip="Open Theme Menu" />
    <span class="ml-2 hidden text-sm font-bold md:block">Layout</span>
  </div>
{/snippet}

{#snippet menuContent()}
  <div class="ml-2 font-bold">Layout Options</div>
  <div class="mt-5">
    <div class="mt-4 mb-1 ml-2">Appearance</div>
    <div class="mb-2 flex justify-center">
      <SegmentedControl defaultValue={themeService.lightMode.value} onValueChange={(e) => themeService.setDisplayMode(e.value!)}>
        <SegmentedControl.Control>
          <SegmentedControl.Indicator />
          <SegmentedControl.Item value="dark">
            <SegmentedControl.ItemText>
              <Icon type="dark" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
          <SegmentedControl.Item value="light">
            <SegmentedControl.ItemText>
              <Icon type="light" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
        </SegmentedControl.Control>
      </SegmentedControl>
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Card Style</div>
    <div class="mb-2 flex justify-center">
      <SegmentedControl defaultValue={themeService.cardStyle.value} onValueChange={(e) => themeService.setCardStyle(e.value!)}>
        <SegmentedControl.Control>
          <SegmentedControl.Indicator />
          <SegmentedControl.Item value="portrait">
            <SegmentedControl.ItemText>
              <Icon type="portrait" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
          <SegmentedControl.Item value="circular">
            <SegmentedControl.ItemText>
              <Icon type="circular" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
          <SegmentedControl.Item value="landscape">
            <SegmentedControl.ItemText>
              <Icon type="landscape" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
        </SegmentedControl.Control>
      </SegmentedControl>
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Theme</div>
    <div class="relative z-50 mx-4 mb-2">
      <Combobox class="w-full max-w-md" placeholder={theme[0]} {onOpenChange} onValueChange={(e) => ((theme = e.value), changeTheme(e.value!))}>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger />
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner class="z-[1000]!">
            <Combobox.Content>
              {#each themes as item (item.value)}
                <Combobox.Item {item}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              {/each}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox>
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Code Style</div>
    <div class="relative z-10 mx-4 mb-2">
      <Combobox class="w-full max-w-md" placeholder={codeTheme[0]} {onOpenChange} onValueChange={(e) => ((codeTheme = e.value), changeCodeTheme())}>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger />
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner class="z-[1000]!">
            <Combobox.Content>
              {#each codeThemeCombo as item (item.value)}
                <Combobox.Item {item}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              {/each}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox>
    </div>
    <hr />
    <div class="mt-1 mb-1 ml-2">Layout</div>
    <div class="mb-2 flex justify-center">
      <SegmentedControl defaultValue={themeService.layout.value} onValueChange={(e) => themeService.setLayout(e.value!)}>
        <SegmentedControl.Control>
          <SegmentedControl.Indicator />
          <SegmentedControl.Item value="compacted">
            <SegmentedControl.ItemText>
              <Icon type="compacted" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
          <SegmentedControl.Item value="expanded">
            <SegmentedControl.ItemText>
              <Icon type="expanded" />
            </SegmentedControl.ItemText>
            <SegmentedControl.ItemHiddenInput />
          </SegmentedControl.Item>
        </SegmentedControl.Control>
      </SegmentedControl>
    </div>
  </div>
{/snippet}

<Menu {menuSelector} {menuContent} />
