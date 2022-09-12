<script lang="ts" context="module">
  import type { PageMeta } from "@vitebook/client";

  export const __pageMeta: PageMeta = {
    title: "Colours",
    description: "Colour scheme for Tutors",
  };
</script>

<script>
  import { ControlsAddon, EventsAddon } from "@vitebook/client/addons";
  let themes = [
    "tutors",
    "tutors-dark",
    "tutors-black",
    "tutors-dyslexia",
    "tutors-wireframe",
  ];
  let selected = "tutors";
  function onChange(event) {
    selected = event.currentTarget.value;
  }
</script>

<div data-theme={selected} class="w-full p-4">
  <div class="text-2xl font-bold">Tutors Colour Scheme</div>
  <div class="grid grid-cols-3 content-center py-4">
    <div>
      <div class="badge badge-lg bg-primary" />
      primary
    </div>
    <div>
      <div class="badge badge-lg bg-primary-focus" />
      primary-focus
    </div>
    <div>
      <div class="badge badge-lg bg-primary-content" />
      primary-content
    </div>
  </div>
  <div class="grid grid-cols-3 content-center py-4">
    <div>
      <div class="badge badge-lg bg-secondary" />
      secondary
    </div>
    <div>
      <div class="badge badge-lg bg-secondary-focus" />
      secondary-focus
    </div>
    <div>
      <div class="badge badge-lg bg-secondary-content" />
      secondary-content
    </div>
  </div>
  <div class="grid grid-cols-3 content-center py-4">
    <div>
      <div class="badge badge-lg bg-accent" />
      accent
    </div>
    <div>
      <div class="badge badge-lg bg-accent-focus" />
      accent-focus
    </div>
    <div>
      <div class="badge badge-lg bg-accent-content" />
      accent-content
    </div>
  </div>
  <div class="grid grid-cols-3 content-center py-4">
    <div>
      <div class="badge badge-lg bg-neutral" />
      neutral
    </div>
    <div>
      <div class="badge badge-lg bg-neutral-focus" />
      neutral-focus
    </div>
    <div>
      <div class="badge badge-lg bg-neutral-content" />
      neutral-content
    </div>
  </div>
  <div class="grid grid-cols-4 content-center py-4">
    <div>
      <div class="badge badge-lg bg-info" />
      info
    </div>
    <div>
      <div class="badge badge-lg bg-success" />
      success
    </div>
    <div>
      <div class="badge badge-lg bg-warning" />
      warning
    </div>
    <div>
      <div class="badge badge-lg bg-error" />
      error
    </div>
  </div>
</div>

<ControlsAddon>
  <div class="text-xl">Select a Theme</div>
  {#each themes as theme}
    <div>
      <label class="label cursor-pointer">
        <span class="label-text">{theme}</span>
        <input
          checked={selected === theme}
          type="radio"
          name="theme"
          class="radio"
          bind:value={theme}
          on:change={onChange}
        />
      </label>
    </div>
  {/each}
</ControlsAddon>

<EventsAddon />
