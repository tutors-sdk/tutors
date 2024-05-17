<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { modeCurrent, setModeCurrent, setModeUserPrefers } from "@skeletonlabs/skeleton";
  function onDarkModeToggleHandler(): void {
    $modeCurrent = !$modeCurrent;
    setModeUserPrefers($modeCurrent);
    setModeCurrent($modeCurrent);
  }
</script>

<button class="btn w-full flex justify-between" on:click={onDarkModeToggleHandler}>
  <span class="flex-none">{$modeCurrent === true ? "Dark" : "Light"} Mode</span>
  {#if $modeCurrent}
    <Icon icon="fluent:weather-moon-48-filled" color="rgba(var(--color-warning-500))" />
  {:else}
    <Icon icon="fluent:weather-sunny-32-filled" color="rgba(var(--color-warning-500))" />
  {/if}
</button>
