<script lang="ts" context="module">
  import type { PageMeta } from "@vitebook/client";
  import { Button } from "@design/tutors-components";
  import { Variant } from "@vitebook/client";
  import {
    ControlsAddon,
    EventsAddon,
    eventCallback,
  } from "@vitebook/client/addons";

  export const __pageMeta: PageMeta = {
    title: "Button",
    description: "My awesome button.",
  };
  let colours = [
    "primary",
    "secondary",
    "accent",
    "neutral",
    "info",
    "success",
    "warning",
    "error",
  ];
  let content = "Click Me";
  let colour = "primary";
  let size = "lg";
  let href = "";
  let target = "_blank";
  function onChange(event) {
    colour = event.currentTarget.value;
  }
</script>

<Variant name="Default" description="The default button.">
  <Button {colour} {size} {href} {target} on:click={eventCallback}
    >{content}</Button
  >
</Variant>

<ControlsAddon>
  <div>
    Content <input type="text" bind:value={content} />
  </div>
  <select class="mt-6" on:change={onChange}>
    <option disabled selected>Select a Colour</option>
    {#each colours as colour}
      <option checked={colour === colour} name="colour">{colour}</option>
    {/each}
  </select>
  <div class="mt-6">
    href <input type="text" bind:value={href} />
  </div>
  <div class="mt-6">
    target <input type="text" bind:value={target} />
  </div>
</ControlsAddon>

<EventsAddon />
