<script lang="ts">
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { SegmentedControl } from "@skeletonlabs/skeleton-svelte";
</script>

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
