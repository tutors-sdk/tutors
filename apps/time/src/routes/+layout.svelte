<script lang="ts">
  import { onMount } from "svelte";
  import "@skeletonlabs/skeleton/styles/all.css";
  import tutors from "tutors-ui/lib/themes/tutors.css?inline";
  import dyslexia from "tutors-ui/lib/themes/dyslexia.css?inline";
  import { AppShell } from "@skeletonlabs/skeleton";
  import { storeTheme } from "tutors-reader-lib/src/stores/stores";

  const themes: any = { tutors, dyslexia };
  onMount(async () => {
    storeTheme.subscribe(setBodyThemeAttribute);
  });

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  <AppShell class="h-screen">
    <div class="w-full">
      <slot />
    </div>
  </AppShell>
</div>
