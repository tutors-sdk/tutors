<script lang="ts">
  import "../../app.postcss";
  import { AppShell, popup, storePopup, initializeStores } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { NavigationPrimary, NavigationPrimaryLayoutMenu } from "$lib/components";
  import DashboardTitle from "$lib/ui/navigators/buttons/DashboardTitle.svelte";
  import LoginButton from "$lib/ui/navigators/buttons/LoginButton.svelte";
  import "iconify-icon";
  import HomeFooter from "$lib/ui/navigators/HomeFooter.svelte";

  const themes: any = ["tutors", "dyslexia", "halloween", "valentines"];
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  initializeStores();
</script>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <NavigationPrimary>
      <svelte:fragment slot="lead">
        <a href="/">
          <DashboardTitle title="Tutors" subtitle="Tutors Open Source Project"></DashboardTitle>
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <LoginButton />
        <span class="divider-vertical h-10 hidden lg:block" />
        <NavigationPrimaryLayoutMenu />
      </svelte:fragment>
    </NavigationPrimary>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    <HomeFooter />
  </svelte:fragment>
</AppShell>
