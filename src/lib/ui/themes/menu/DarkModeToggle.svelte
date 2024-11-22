<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  let modeCurrent = $state("light");
  function onDarkModeToggleHandler(): void {
    document.body.classList.toggle("dark");
    if (modeCurrent === "light") {
      localStorage.modeCurrent = modeCurrent = "dark";
    } else {
      localStorage.modeCurrent = modeCurrent = "light";
    }
  }
</script>

<button class="btn flex w-full justify-between" onclick={onDarkModeToggleHandler}>
  <span class="flex-none">{modeCurrent} Mode</span>
  {#if modeCurrent === "dark"}
    <Icon icon="fluent:weather-moon-48-filled" color="rgba(var(--color-warning-500))" />
  {:else}
    <Icon icon="fluent:weather-sunny-32-filled" color="rgba(var(--color-warning-500))" />
  {/if}
</button>
