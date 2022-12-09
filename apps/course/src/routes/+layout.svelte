<script lang="ts">
  import { page } from "$app/stores";
  import "@skeletonlabs/skeleton/styles/all.css";
  import { AppShell, Drawer } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import Blank from "$lib/support/Blank.svelte";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import PageHeader from "$lib/navigators/PageHeader.svelte";
  import { Footer } from "tutors-ui";
  import InfoBar from "$lib/navigators/sidebars/InfoBar.svelte";
  import CalendarBar from "$lib/navigators/sidebars/CalendarBar.svelte";
  import TocBar from "$lib/navigators/sidebars/TocBar.svelte";
  import tutors from "tutors-ui/lib/themes/tutors.css";
  import dyslexia from "tutors-ui/lib/themes/dyslexia.css";
  import {
    authenticating,
    transitionKey,
    infoDrawer,
    calendarDrawer,
    tocDrawer,
    themeBuilderDrawer,
    storeTheme,
    currentCourse,
    onlineDrawer,
    currentLo
  } from "tutors-reader-lib/src/stores/stores";
  import PageTransition from "$lib/PageTransition.svelte";
  import { getKeys } from "../environment";
  import TutorsTerms from "$lib/support/TutorsTerms.svelte";
  import { analyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import OnlineBar from "$lib/navigators/sidebars/OnlineBar.svelte";
  import ThemeBuilderBar from "$lib/navigators/sidebars/ThemeBuilderBar.svelte";
  import { initServices } from "./tutors-startup";

  let mounted = false;
  const themes: any = { tutors, dyslexia };

  onMount(async () => {
    mounted = true;
    storeTheme.subscribe(setBodyThemeAttribute);
    initServices();
  });

  afterNavigate((params: any) => {
    const isNewPage: boolean = params.from && params.to && params.from.route.id !== params.to.route.id;
    const elemPage = document.querySelector("#page");
    if (isNewPage && elemPage !== null) {
      elemPage.scrollTop = 0;
    }
  });

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  page.subscribe((path) => {
    if (mounted && path.params.courseid && getKeys().firebase.apiKey !== "XXX") {
      analyticsService.learningEvent(path.params, path.data);
    }
  });
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
  <title>{$currentLo?.title}</title>
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  {#if $authenticating}
    <TutorsTerms />
  {:else if $currentCourse}
    <Drawer open="{infoDrawer}" position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <InfoBar />
    </Drawer>
    <Drawer open="{calendarDrawer}" position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <CalendarBar />
    </Drawer>
    <Drawer open="{tocDrawer}" position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <TocBar />
    </Drawer>
    <Drawer open="{onlineDrawer}" position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <OnlineBar />
    </Drawer>
    <Drawer open="{themeBuilderDrawer}" position="right" width="w-full md:w-3/4 lg:w-1/2" blur="backdrop-blur-none" class="z-50">
      <ThemeBuilderBar />
    </Drawer>
    <AppShell class="h-screen">
      <svelte:fragment slot="header">
        <NavBar />
        <PageHeader />
      </svelte:fragment>
      <div id="top"></div>
      <div class="mx-auto my-4">
        <PageTransition url="{$transitionKey}">
          <slot />
        </PageTransition>
      </div>
      <svelte:fragment slot="pageFooter">
        <div class="bg-surface-100-800-token bottom-0 mt-2">
          <Footer />
        </div>
      </svelte:fragment>
    </AppShell>
  {:else}
    <Blank />
  {/if}
</div>
