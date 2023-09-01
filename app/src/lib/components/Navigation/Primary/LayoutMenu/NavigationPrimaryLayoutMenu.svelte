<script lang="ts">
  import {
    type DrawerSettings,
    getDrawerStore,
    popup,
    modeCurrent,
    setModeCurrent,
    setModeUserPrefers,
    getModeOsPrefers,
    setInitialClassState
  } from "@skeletonlabs/skeleton";
  import { layout, storeTheme } from "$lib/stores";
  import moment from "moment";
  import { Icon } from "$lib/ui/legacy";
  import { onMount } from "svelte";

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

  onMount(() => {
    // Sync lightswitch with the theme
    if (!("modeCurrent" in localStorage)) {
      setModeCurrent(getModeOsPrefers());
    }
  });

  function onDarkModeToggleHandler(): void {
    $modeCurrent = !$modeCurrent;
    setModeUserPrefers($modeCurrent);
    setModeCurrent($modeCurrent);
  }

  const drawerStore = getDrawerStore();


  var isHalloween: boolean = false;
  var isValentines: boolean = false;

  const now = moment();
  const halloweenStart = moment("19/10/____", "DD/MM/____");
  const halloweenEnd = moment("02/11/____", "DD/MM/____");
  if (now.isBetween(halloweenStart, halloweenEnd, "days", "[]")) {
    isHalloween = true;
  }
  const valentinesStart = moment("02/02/____", "DD/MM/____");
  const valentinesEnd = moment("16/02/____", "DD/MM/____");
  if (now.isBetween(valentinesStart, valentinesEnd, "days", "[]")) {
    isValentines = true;
  }

  applyInitialLayout();
</script>

<svelte:head>
  <!-- Workaround for a svelte parsing error: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

<div class="relative">
  <button class="btn btn-sm" use:popup={{ event: "click", target: "design" }}>
    <Icon type="dark" />
    <span class="hidden text-sm font-bold lg:block"
      >Layout <span class="pl-2 opacity-50">▾</span></span
    >
  </button>
  <nav class="list-nav card card-body p-4 w-56 space-y-4 shadow-lg" data-popup="design">
    <h6>Toggles</h6>
    <ul>
      <li class="option !p-0">
        <button class="btn w-full flex justify-between" on:click={onDarkModeToggleHandler}>
          <span class="flex-none">{$modeCurrent === true ? "Dark" : "Light"} Mode</span>
          {#if $modeCurrent}
            <Icon icon="fluent:weather-moon-48-filled" color="rgba(var(--color-warning-500))" />
          {:else}
            <Icon icon="fluent:weather-sunny-32-filled" color="rgba(var(--color-warning-500))" />
          {/if}
        </button>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li class="option !p-0" on:click={() => toggleLayout()}>
        <button class="btn w-full flex justify-between">
          <span class="flex-none">Compact</span>
          <Icon type={$layout} />
        </button>
      </li>
    </ul>
    <hr />
    <h6>Themes</h6>
    <ul class="list">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option !p-0"
        on:click={() => {
          storeTheme.set("tutors");
        }}
      >
        <button
          class="btn w-full flex justify-between"
          class:!variant-soft-primary={$storeTheme === "tutors"}
        >
          <span class="flex-none">Tutors</span>
        </button>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option !p-0"
        on:click={() => {
          storeTheme.set("dyslexia");
        }}
      >
        <button
          class="btn w-full flex justify-between"
          class:!variant-soft-primary={$storeTheme === "dyslexia"}
        >
          <span class="flex-none">Dyslexia</span>
        </button>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if isHalloween}
        <li
          class="option !p-0"
          on:click={() => {
            storeTheme.set("halloween");
          }}
        >
          <button
            class="btn w-full flex justify-between"
            class:!variant-soft-primary={$storeTheme === "halloween"}
          >
            <span class="flex-none">Halloween</span>
          </button>
        </li>
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if isValentines}
        <li
          class="option !p-0"
          on:click={() => {
            storeTheme.set("valentines");
          }}
        >
          <button
            class="btn w-full flex justify-between"
            class:!variant-soft-primary={$storeTheme === "valentines"}
          >
            <span class="flex-none">Valentines</span>
          </button>
        </li>
      {/if}
    </ul>
  </nav>
</div>
