<script lang="ts" context="module">
    import type { PageMeta } from '@vitebook/client';
    export const __pageMeta: PageMeta = {
      title: 'Themes',
      description: 'The themes used in the Tutors project',
    };
  </script>
  
  <script>
    import { Variant } from '@vitebook/client';
    import {
      ControlsAddon,
      EventsAddon,
      eventCallback,
    } from '@vitebook/client/addons';
  
    let title = 'Click Me';
    let disabled = false;
    let themes = ["tutors", "tutors-dark", "tutors-black", "tutors-dyslexia", "tutors-wireframe"];
  </script>
  
  <Variant name="Default" description="The default tutors theme.">
    {#each themes as theme}
    <div class="h-full bg-base-100" data-theme={theme}>
      The current selected theme is {theme}
  </div>
  {/each}
  </Variant>
  
  <Variant
    name="Disabled"
    description="The disabled button."
    on:enter={() => {
      disabled = true;
    }}
    on:exit={() => {
      disabled = false;
    }}
  >
  </Variant>
  
  <ControlsAddon>
    <div>
      Title <input type="text" bind:value={title} />
    </div>
    <div class="mt-6">
      Disabled <input type="checkbox" bind:checked={disabled} />
    </div>
  </ControlsAddon>
  
  <EventsAddon />
  