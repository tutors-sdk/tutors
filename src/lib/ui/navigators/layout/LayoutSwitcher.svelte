<script lang="ts">
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { SegmentedControl } from "@skeletonlabs/skeleton-svelte";
</script>

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
