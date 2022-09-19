<script lang="ts" context="module">
  import type { PageMeta } from '@vitebook/client';
  import { Icon } from 'tutors-ui';
  import { ControlsAddon, EventsAddon } from '@vitebook/client/addons';

  export const __pageMeta: PageMeta = {
    title: 'Icon',
    description: 'Icon molecule'
  };

  let icons = [
    {
      icon: 'fluent:home-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:video-clip-24-filled',
      colour: 'error'
    },
    {
      icon: 'fluent:video-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:notebook-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:bookmark-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:dual-screen-group-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:presenter-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:document-copy-24-filled',
      colour: 'warning'
    },
    {
      icon: 'fluent:beaker-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:archive-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:bookmark-24-regular',
      colour: 'error'
    },
    {
      icon: 'fluent:code-circle-20-filled',
      colour: 'warning'
    },
    {
      icon: 'fluent:video-clip-24-regular',
      colour: 'error'
    },
    {
      icon: 'fluent:notepad-16-regular',
      colour: 'warning'
    },
    {
      icon: 'fluent:ios-arrow-left-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:ios-arrow-right-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:print-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:arrow-rotate-clockwise-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:arrow-download-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:arrow-expand-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:presence-available-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:presence-available-24-regular',
      colour: 'error'
    },
    {
      icon: 'fluent:clock-alarm-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:save-arrow-right-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:people-community-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:search-24-filled',
      colour: 'info'
    },
    {
      icon: 'fluent:sign-out-24-filled',
      colour: 'error'
    },
    {
      icon: 'fluent:dark-theme-24-filled',
      colour: 'warning'
    },
    {
      icon: 'fluent:line-horizontal-3-20-filled',
      colour: 'bg-base-content'
    },
    {
      icon: 'fluent:re-order-dots-vertical-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:re-order-dots-horizontal-24-filled',
      colour: 'success'
    },
    {
      icon: 'fluent:info-28-regular',
      colour: 'bg-base-content'
    },
    {
      icon: 'fluent:calendar-ltr-12-regular',
      colour: 'bg-base-content'
    },
    {
      icon: 'fluent:settings-24-filled',
      colour: 'info'
    }
  ];
  let size = 40;
</script>

<div class="flex w-10/12 flex-wrap">
  {#each icons as icon}
    <div class="bg-base-100 m-1 p-4">
      <Icon icon="{icon.icon}" colour="{icon.colour}" size="{size}" />
    </div>
  {/each}
</div>

<ControlsAddon>
  <div>
    Size <input type="text" bind:value="{size}" />
  </div>
</ControlsAddon>

<EventsAddon />
