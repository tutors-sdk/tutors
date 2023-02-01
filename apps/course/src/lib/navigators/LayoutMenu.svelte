<script lang="ts">
	import { afterUpdate } from 'svelte';
  import { type DrawerSettings, drawerStore, LightSwitch, menu, storeLightSwitch } from "@skeletonlabs/skeleton";
  import { layout, storeTheme } from "tutors-reader-lib/src/stores/stores";
  import moment from 'moment';
  import { Icon } from "tutors-ui";

  function applyInitialLayout() {
    layout.set("expanded");
  }

  function toggleLayout() {
    if ($layout === "compacted") {
      layout.set("expanded");
    } else {
      layout.set("compacted");
    }
  }

  const themeBuilderDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "theme", position: "right", width: "w-full md:w-3/4 lg:w-1/2" };
    drawerStore.open(settings);
  };

  var isHalloween:boolean = false;
  var isValentines:boolean = false;

  const now = moment()
  const halloweenStart = moment('19/10/____', 'DD/MM/____')
  const halloweenEnd = moment('02/11/____', 'DD/MM/____')
  if(now.isBetween(halloweenStart, halloweenEnd, 'days', '[]')){
    isHalloween = true;
  }
  const valentinesStart = moment('02/02/____', 'DD/MM/____')
  const valentinesEnd = moment('16/02/____', 'DD/MM/____')
  if(now.isBetween(valentinesStart, valentinesEnd, 'days', '[]')){
    isValentines = true;
  }

  applyInitialLayout();
</script>

<div class="relative">
  <button class="btn btn-sm" use:menu="{{ menu: 'design', interactive: true }}">
    <Icon type="dark" />
    <span class="hidden text-sm font-bold lg:block">Layout <span class="pl-2 opacity-50">▾</span></span>
  </button>
  <nav class="list-nav card card-body p-4 w-56 space-y-4 shadow-lg" data-menu="design">
    <h6>Toggles</h6>
    <ul>
      <li class="option !p-0">
        <button class="btn w-full flex justify-between">
          <span class="flex-none">Dark Mode</span>
          <LightSwitch />
        </button>
      </li>
      <li class="option !p-0" on:click="{() => toggleLayout()}">
        <button class="btn w-full flex justify-between">
          <span class="flex-none">Compact</span>
          <Icon type="{$layout}" />
        </button>
      </li>
    </ul>
    <hr />
    <h6>Themes</h6>
    <ul class="list">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option !p-0"
        on:click="{() => {
          storeTheme.set('tutors');
        }}"
      >
      <button class="btn w-full flex justify-between" class:!variant-soft-primary="{$storeTheme === 'tutors'}">
        <span class="flex-none">Tutors</span>
      </button>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option !p-0"
        on:click="{() => {
          storeTheme.set('dyslexia');
        }}"
      >
      <button class="btn w-full flex justify-between" class:!variant-soft-primary="{$storeTheme === 'dyslexia'}">
        <span class="flex-none">Dyslexia</span>
      </button>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if isHalloween}
      <li
        class="option !p-0"
        class:!bg-primary-500="{$storeTheme === 'halloween'}"
        on:click="{() => {
          storeTheme.set('halloween');
        }}"
      >
      <button class="btn w-full flex justify-between" class:!variant-soft-primary="{$storeTheme === 'halloween'}">
        <span class="flex-none">Halloween</span>
      </button>
      </li>
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if isValentines}
      <li
        class="option"
        on:click="{() => {
          storeTheme.set('valentines');
        }}"
      >
      <button class="btn w-full flex justify-between" class:!variant-soft-primary="{$storeTheme === 'valentines'}">
        <span class="flex-none">Valentines</span>
      </button>
      </li>
      {/if}

      <hr />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li class="option !p-0" on:click="{themeBuilderDrawerOpen}">
        <button class="btn w-full flex justify-between">
          <span class="flex-none">Theme Builder</span>
        </button>
      </li>
    </ul>
  </nav>
</div>
