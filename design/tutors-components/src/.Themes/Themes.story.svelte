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
    import Themes from './Themes.svelte';
  
    let title = 'Click Me';
    let disabled = false;
  </script>
  
  <Variant name="Default" description="The default tutors theme.">
    <Button {disabled} on:click={eventCallback}>{title}</Button>
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
    <Button {disabled}>{title}</Button>
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
  