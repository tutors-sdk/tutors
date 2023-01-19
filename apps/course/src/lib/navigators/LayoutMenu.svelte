<script lang="ts">
  import { type DrawerSettings, drawerStore, LightSwitch, menu } from "@skeletonlabs/skeleton";
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
    <section class="flex justify-between">
      <p class="text-lg">Dark Mode</p>
      <LightSwitch />
    </section>
    <button class="w-full" on:click="{() => toggleLayout()}">
      <section class="flex justify-between">
        <p class="text-lg">Compact</p>
        <div class="mr-3">
          <Icon type="{$layout}" />
        </div>
      </section>
    </button>
    <hr />
    <h6>Themes</h6>
    <ul>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option"
        class:!bg-primary-500="{$storeTheme === 'tutors'}"
        on:click="{() => {
          storeTheme.set('tutors');
        }}"
      >
        <p class="text-lg">Tutors</p>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option"
        class:!bg-primary-500="{$storeTheme === 'dyslexia'}"
        on:click="{() => {
          storeTheme.set('dyslexia');
        }}"
      >
        <p class="text-lg">Dyslexia</p>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if isHalloween}
      <li
        class="option"
        class:!bg-primary-500="{$storeTheme === 'halloween'}"
        on:click="{() => {
          storeTheme.set('halloween');
        }}"
      >
        <p class="text-lg">Halloween</p>
      </li>
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if isValentines}
      <li
        class="option"
        class:!bg-primary-500="{$storeTheme === 'valentines'}"
        on:click="{() => {
          storeTheme.set('valentines');
        }}"
      >
        <p class="text-lg">Valentines</p>
      </li>
      {/if}

      <hr />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li class="option" on:click="{themeBuilderDrawerOpen}">
        <p class="text-lg">Theme Builder</p>
      </li>
    </ul>
  </nav>
</div>
