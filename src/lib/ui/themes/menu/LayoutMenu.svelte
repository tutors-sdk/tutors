<script lang="ts">
  import { Popover } from "@skeletonlabs/skeleton-svelte";
  import { setIconLibForTheme, setTheme, themes } from "../styles/icon-lib.svelte";
  import Icon from "../icons/Icon.svelte";
  import { currentTheme } from "$lib/runes";
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import LayoutToggle from "./LayoutToggle.svelte";

  let openState = $state(false);

  function popoverClose() {
    openState = false;
  }

  function changeTheme(theme: string): void {
    setTheme(theme);
  }
</script>

<Popover
  bind:open={openState}
  positioning={{ placement: "top" }}
  triggerBase="btn preset-tonal"
  contentBase="card bg-surface-50 m-4space-y-4 max-w-[320px] z-[100"
>
  {#snippet trigger()}
    <Icon type="dark" />
    <span class="hidden text-sm font-bold lg:block">Layout <span class="pl-2 opacity-50">▾</span></span>{/snippet}
  {#snippet content()}
    <nav class="card-body card list-nav w-56 space-y-4 bg-gray-100 p-4 shadow-lg dark:bg-gray-800" data-popup="design">
      <h6>Toggles</h6>
      <ul>
        <li class="option !p-0v hover:preset-tonal">
          <DarkModeToggle />
        </li>
        <li class="option hover:preset-tonal !p-0">
          <LayoutToggle />
        </li>
      </ul>
      <hr />
      <h6>Themes</h6>
      <ul class="list">
        {#each themes as theme}
          <li class="option !p-0">
            <button
              class="btn hover:preset-tonal flex w-full justify-between {theme === currentTheme.value
                ? 'preset-tonal'
                : ''}"
              onclick={() => changeTheme(theme)}
            >
              <span class="flex-none">{theme}</span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  {/snippet}
</Popover>
