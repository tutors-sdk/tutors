<script lang="ts">
  import { storeTheme } from "$lib/stores";
  export let themeName = "";

  function setTheme() {
    storeTheme.set(themeName);
  }
</script>

<button class="btn w-full flex justify-between" class:!variant-soft-primary={$storeTheme === themeName} on:click={setTheme}>
  <span class="flex-none">{themeName}</span>
</button>
