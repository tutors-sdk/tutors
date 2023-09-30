<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton";
  import HomeFooter from "$lib/ui/navigators/footers/HomeFooter.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  export let title = "Tutors Open Source Project";
  export let subTitle = "";
</script>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <TutorsTitle {title} subtitle={subTitle} />
      </svelte:fragment>
      <slot name="header" />
      <svelte:fragment slot="trail">
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
      </svelte:fragment>
    </MainNavigator>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    <HomeFooter />
  </svelte:fragment>
</AppShell>
