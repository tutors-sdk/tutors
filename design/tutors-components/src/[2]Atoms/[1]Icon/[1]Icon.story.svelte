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

  let icons = [
    "fluent:home-24-filled",
    "fluent:video-clip-24-filled",
    "fluent:video-24-filled",
    "fluent:notebook-24-filled",
    "fluent:bookmark-24-filled",
    "fluent:dual-screen-group-24-filled",
    "fluent:presenter-24-filled",
    "fluent:document-copy-24-filled",
    "fluent:beaker-24-filled",
    "fluent:archive-24-filled",
    "fluent:bookmark-24-regular",
    "fluent:code-circle-20-filled",
    "fluent:video-clip-24-regular",
    "fluent:presenter-24-filled",
    "fluent:notepad-16-regular",
    "fluent:notepad-16-regular",
    "fluent:ios-arrow-left-24-filled",
    "fluent:ios-arrow-right-24-filled",
    "fluent:print-24-filled",
    "fluent:arrow-rotate-clockwise-24-filled",
    "fluent:arrow-download-24-filled",
    "fluent:arrow-expand-24-filled",
    "fluent:presence-available-24-filled",
    "fluent:presence-available-24-regular",
    "fluent:clock-alarm-24-filled",
    "fluent:save-arrow-right-24-filled",
    "fluent:people-community-24-filled",
    "fluent:search-24-filled",
    "fluent:sign-out-24-filled",
    "fluent:dark-theme-24-filled",
    "fluent:line-horizontal-3-20-filled",
    "fluent:re-order-dots-vertical-24-filled",
    "fluent:re-order-dots-horizontal-24-filled",
    "fluent:info-28-regular",
    "fluent:calendar-ltr-12-regular",
    "fluent:settings-24-filled",
    "fluent:re-order-dots-vertical-24-filled",
  ];
  let size = 40;
</script>

<div class="flex flex-wrap w-10/12">
  {#each icons as icon}
    <div class="p-4 m-1 bg-base-100">
      <Icon {icon} {size} />
    </div>
  {/each}
</div>

<ControlsAddon>
  <div>
    Size <input type="text" bind:value={size} />
  </div>
</ControlsAddon>

<EventsAddon />
