<script lang="ts" context="module">
  import type { PageMeta } from "@vitebook/client";

  export const __pageMeta: PageMeta = {
    title: "Icon",
    description: "Icon molecule",
  };
</script>

<script>
  import { ControlsAddon, EventsAddon } from "@vitebook/client/addons";
  import Icon from "./Icon.svelte";

  let icon = "heroicons:academic-cap-solid";
  let size = 20;
  let colour = "secondary";
</script>

<Icon {icon} {size} />

<ControlsAddon>
  <div>
    Icon <input type="text" bind:value={icon} />
  </div>
  <br />
  <div>
    Size <input type="text" bind:value={size} />
  </div>
</ControlsAddon>

<EventsAddon />
