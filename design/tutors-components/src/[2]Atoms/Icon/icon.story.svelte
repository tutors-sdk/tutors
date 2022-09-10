<script lang="ts" context="module">
  import type { PageMeta } from "@vitebook/client";

  export const __pageMeta: PageMeta = {
    title: "Icon",
    description: "Icon molecule",
  };
</script>

<script>
  import { Variant } from "@vitebook/client";
  import {
    ControlsAddon,
    EventsAddon,
    eventCallback,
  } from "@vitebook/client/addons";
  import Icon from "./Icon.svelte";

  let icon = "line-md:cloud-tags-loop";
</script>

<Variant name="Icon" description="The default icon.">
  <Icon {icon} />
</Variant>

<ControlsAddon>
  <div>
    Icon <input type="text" bind:value={icon} />
  </div>
</ControlsAddon>

<EventsAddon />
