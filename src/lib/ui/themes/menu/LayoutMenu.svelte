<script lang="ts">
  import { popup, setModeCurrent, getModeOsPrefers, setInitialClassState } from "@skeletonlabs/skeleton";
  import { currentTheme, layout } from "$lib/runes";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import LayoutToggle from "./LayoutToggle.svelte";
  import { setIconLibForTheme, themes } from "../styles/icon-lib.svelte";
  import { onMount } from "svelte";

  function setTheme(theme: string): void {
    currentTheme.value = theme;
    document.body.setAttribute("data-theme", currentTheme.value);
    localStorage.theme = currentTheme.value;
    setIconLibForTheme();
  }

  onMount(() => {
    setInitialClassState();
    if (!("modeCurrent" in localStorage)) {
      setModeCurrent(getModeOsPrefers());
    }
    if ("theme" in localStorage) {
      currentTheme.value = localStorage.theme;
    }
    setTheme(currentTheme.value);
  });

  layout.value = "expanded";
</script>

<div class="relative">
  <button class="btn btn-sm" use:popup={{ event: "click", target: "design" }}>
    <Icon type="dark" />
    <span class="hidden text-sm font-bold lg:block">Layout <span class="pl-2 opacity-50">▾</span></span>
  </button>
  <nav class="card-body card list-nav w-56 space-y-4 p-4 shadow-lg" data-popup="design">
    <h6>Toggles</h6>
    <ul>
      <li class="option !p-0">
        <DarkModeToggle />
      </li>
      <li class="option !p-0">
        <LayoutToggle />
      </li>
    </ul>
    <hr />
    <h6>Themes</h6>
    <ul class="list">
      {#each themes as theme}
        <li class="option !p-0">
          <button
            class="btn flex w-full justify-between"
            class:!variant-soft-primary={theme === currentTheme.value}
            onclick={setTheme(theme)}
          >
            <span class="flex-none">{theme}</span>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</div>
