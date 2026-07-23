<script lang="ts">
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { SegmentedControl } from "@skeletonlabs/skeleton-svelte";
</script>

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
