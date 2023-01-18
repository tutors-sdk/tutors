<script lang="ts">
  import { page } from "$app/stores";
  import "@skeletonlabs/skeleton/styles/all.css";
  import { AppShell, Toast } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import Blank from "$lib/support/Blank.svelte";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import PageHeader from "$lib/navigators/PageHeader.svelte";
  import { Footer } from "tutors-ui";
  import tutors from "tutors-ui/lib/themes/tutors.css?inline";
  import dyslexia from "tutors-ui/lib/themes/dyslexia.css?inline";
  import { authenticating, transitionKey, storeTheme, currentCourse, currentLo } from "tutors-reader-lib/src/stores/stores";
  import PageTransition from "$lib/PageTransition.svelte";
  import { getKeys } from "../environment";
  import TutorsTerms from "$lib/support/TutorsTerms.svelte";
  import { analyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { initServices } from "./tutors-startup";
  import Sidebars from "$lib/navigators/sidebars/Sidebars.svelte";

  let mounted = false;
  const themes: any = { tutors, dyslexia };

  onMount(async () => {
    mounted = true;
    storeTheme.subscribe(setBodyThemeAttribute);
    setColorScheme();
    initServices();
    const func = () => {
      if (!document.hidden) {
        analyticsService.updatePageCount();
      }
    };
    setInterval(func, 30 * 1000);
  });

  afterNavigate((params: any) => {
    const isNewPage: boolean = params.from && params.to && params.from.route.id !== params.to.route.id;
    const elemPage = document.querySelector("#page");
    if (isNewPage && elemPage !== null) {
      elemPage.scrollTop = 0;
    }
  });

  function setColorScheme() {
    if (localStorage.getItem('storeLightSwitch') === 'true' ||
        (!('storeLightSwitch' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
    else {
        document.documentElement.classList.remove('dark');
    }
}

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

<Toast />
<div id="app" class="h-full overflow-hidden">
  {#if $authenticating}
    <TutorsTerms />
  {:else if $currentCourse}
    <Sidebars />
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
        <div class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2">
          <Footer />
        </div>
      </svelte:fragment>
    </AppShell>
  {:else}
    <Blank />
  {/if}
</div>
