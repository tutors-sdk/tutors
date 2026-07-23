<script lang="ts">
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { Combobox, Portal } from "@skeletonlabs/skeleton-svelte";

  let theme = $state([themeService.currentTheme.value]);
  let themes = $state(themeService.themes.map((element) => ({ label: element.name, value: element.name })));

  const onOpenChange = () => {
    themes = themeService.themes.map((element) => ({ label: element.name, value: element.name }));
  };

  function changeTheme(value: string[]) {
    theme = value;
    themeService.setTheme(value[0]);
  }
</script>

<div class="relative z-50 mx-4 mb-2">
  <Combobox class="w-full max-w-md" placeholder={theme[0]} {onOpenChange} onValueChange={(e) => changeTheme(e.value!)}>
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
