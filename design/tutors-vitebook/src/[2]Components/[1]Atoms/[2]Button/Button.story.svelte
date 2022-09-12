<script lang="ts" context="module">
  import type { PageMeta } from "@vitebook/client";
  import { Button } from "@design/tutors-components";

  export const __pageMeta: PageMeta = {
    title: "Button",
    description: "My awesome button.",
  };
</script>

<script>
  import { Variant } from "@vitebook/client";
  import {
    ControlsAddon,
    EventsAddon,
    eventCallback,
  } from "@vitebook/client/addons";

  let content = "Click Me";
  let colour = "primary";
  let size = "lg";
  let href = "";
  let target = "_blank";
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
  <div class="mt-6">
    Colour <input type="text" bind:value={colour} />
  </div>
  <div class="mt-6">
    href <input type="text" bind:value={href} />
  </div>
  <div class="mt-6">
    target <input type="text" bind:value={target} />
  </div>
</ControlsAddon>

<EventsAddon />
