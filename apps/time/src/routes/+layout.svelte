<script lang="ts">
  import { onMount } from "svelte";
  import "@skeletonlabs/skeleton/styles/all.css";
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
  import "../app.postcss";
  import tutors from "tutors-ui/lib/themes/tutors.css";
  // import dyslexia from "tutors-ui/lib/themes/dyslexia.css";
  import { AppShell } from "@skeletonlabs/skeleton";
  import { storeTheme } from "tutors-reader-lib/src/stores/stores";

  onMount(async () => {
    storeTheme.subscribe(setBodyThemeAttribute);
  });

  const themes: any = { tutors };

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
