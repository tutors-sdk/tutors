<script lang="ts">
  import { LightSwitch, menu } from "@skeletonlabs/skeleton";
  import { layout, storeTheme, themeBuilderDrawer } from "tutors-reader-lib/src/stores/stores";
  import { Icon } from "tutors-ui";

  function applyInitialLayout() {
    // //const savedLayout = window.localStorage.getItem("site-layout");
    // if (savedLayout != null) {
    //layout.set(savedLayout);
    // } else {
    layout.set("expanded");
    //window.localStorage.setItem("site-layout", "expanded");
    // }
  }

  function toggleLayout() {
    if ($layout === "compacted") {
      layout.set("expanded");
      //window.localStorage.setItem("site-layout", "expanded");
    } else {
      layout.set("compacted");
      //window.localStorage.setItem("site-layout", "compacted");
    }
  }

  const themeBuilderDrawerOpen: any = () => {
    themeBuilderDrawer.set(true);
  };

  applyInitialLayout();
</script>

<div class="relative">
  <button class="btn btn-sm" use:menu="{{ menu: 'design', interactive: true }}">
    <Icon type="dark" />
    <span class="hidden text-sm font-bold lg:block">Layout <span class="pl-2 opacity-50">▾</span></span>
  </button>
  <nav class="list-nav card card-body w-56 space-y-4 shadow-lg" data-menu="design">
    <h6>Toggles</h6>
    <section class="flex justify-between">
      <p class="text-lg">Dark Mode</p>
      <LightSwitch origin="tr" />
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

    <hr />
    <li
        class="option"
        on:click="{themeBuilderDrawerOpen}">
        <p class="text-lg">Theme Builder</p>
      </li>
    </ul>
  </nav>
</div>
