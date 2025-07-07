<script lang="ts">
  import { storeTheme, setInitialTheme } from "$lib/stores";
  export let themeName = "";

  function setTheme() {
    console.log(`Setting theme to: ${themeName}`);
    setInitialTheme(themeName);  // Ensure the initial theme is set
    storeTheme.set(themeName);   // Update the store
  }
</script>

<button class="btn w-full flex justify-between" class:!variant-soft-primary={$storeTheme === themeName} on:click={setTheme}>
  <span class="flex-none">{themeName}</span>
</button>
