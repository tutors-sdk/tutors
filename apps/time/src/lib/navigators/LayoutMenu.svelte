<script lang="ts">
  import { LightSwitch, menu } from "@skeletonlabs/skeleton";
  import { layout, storeTheme } from "tutors-reader-lib/src/stores/stores";

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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
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
        }}">
        <button class="btn w-full flex justify-between" class:!variant-soft-primary="{$storeTheme === 'tutors'}">
          <span class="flex-none">Tutors</span>
        </button>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option !p-0"
        on:click="{() => {
          storeTheme.set('dyslexia');
        }}">
        <button class="btn w-full flex justify-between" class:!variant-soft-primary="{$storeTheme === 'dyslexia'}">
          <span class="flex-none">Dyslexia</span>
        </button>
      </li>
      <hr />
    </ul>
  </nav>
</div>
