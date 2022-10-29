<script lang="ts">
  import "@brainandbones/skeleton/styles/all.css";
  import { AppShell, Drawer } from "@brainandbones/skeleton";
  import { onMount, setContext } from "svelte";
  import Router from "svelte-spa-router";
  import Blank from "./pages/support/Blank.svelte";
  import Unauthorised from "./pages/support/Unauthorised.svelte";
  import Course from "./pages/Course.svelte";
  import Topic from "./pages/Topic.svelte";
  import Talk from "./pages/Talk.svelte";
  import Video from "./pages/Video.svelte";
  import Wall from "./pages/Wall.svelte";
  import Lab from "./pages/Lab.svelte";
  import NotFound from "./pages/support/NotFound.svelte";
  import NavBar from "./components/navigators/NavBar.svelte";
  import PageHeader from "./components/navigators/PageHeader.svelte";
  import Footer from "./components/navigators/footer/Footer.svelte";
  import BackToTop from "./components/navigators/BackToTop.svelte";
  import Logout from "./pages/support/Logout.svelte";
  import TutorsTerms from "./pages/support/TutorsTerms.svelte";
  import { CourseService } from "./reader-lib/services/course-service";
  import { handleAuthentication } from "./reader-lib/services/auth-service";
  import { AnalyticsService } from "./reader-lib/services/analytics-service";
  import Search from "./pages/Search.svelte";
  import InfoBar from "./components/navigators/sidebars/InfoBar.svelte";
  import CalendarBar from "./components/navigators/sidebars/CalendarBar.svelte";
  import OnlineBar from "./components/navigators/sidebars/OnlineBar.svelte";
  import TocBar from "./components/navigators/sidebars/TocBar.svelte";
  import Note from "./pages/Note.svelte";
  import { MetricsService } from "./reader-lib/services/metrics-service";
  import { currentLo, infoDrawer, calendarDrawer, onlineDrawer, tocDrawer, storeTheme } from "./stores";

  import tutors from "./themes/tutors.css";
  import dyslexia from "./themes/dyslexia.css";
  import halloween from "./themes/halloween.css";

  const themes: any = { tutors, dyslexia, halloween };

  storeTheme.subscribe(setBodyThemeAttribute);
  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  setContext("cache", new CourseService());
  const analytics = new AnalyticsService();
  setContext("analytics", analytics);
  setContext("metrics", new MetricsService());

  let authenticating = false;
  let bg = "bg-surface-900";

  onMount(() => {
    const path = document.location.href;
    if (path.includes("access_token")) {
      const token = path.substring(path.indexOf("#") + 1);
      handleAuthentication(token, analytics);
      authenticating = true;
    } else if (path.includes("/live")) {
      bg = "";
    }
  });

  let routes = {
    "/": Blank,
    "/unauthorised": Unauthorised,
    "/course/*": Course,
    "/topic/*": Topic,
    "/talk/*": Talk,
    "/note/*": Note,
    "/video/*": Video,
    "/lab/*": Lab,
    "/wall/*": Wall,
    "/authorize/": Blank,
    "/logout": Logout,
    "/search/*": Search,
    "*": NotFound,
  };
</script>

<svelte:head>
  <title>{$currentLo?.title}</title>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  {#if authenticating}
    <TutorsTerms bind:authenticating />
  {:else}
    <Drawer open={infoDrawer} position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5" blur="backdrop-blur-sm" class="z-50">
      <InfoBar />
    </Drawer>

    <Drawer open={calendarDrawer} position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5" blur="backdrop-blur-sm" class="z-50">
      <CalendarBar />
    </Drawer>

    <Drawer open={onlineDrawer} position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5" blur="backdrop-blur-sm" class="z-50">
      <OnlineBar />
    </Drawer>

    <Drawer open={tocDrawer} position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5" blur="backdrop-blur-sm" class="z-50">
      <TocBar />
    </Drawer>

    <AppShell class="h-screen">
      <div class="sticky top-0 z-40">
        <NavBar />
        <PageHeader />
      </div>
      <div class="mx-auto my-4">
        <Router {routes} />
      </div>
      <div class="bg-surface-100-800-token mt-2 w-full">
        <Footer />
      </div>
    </AppShell>
  {/if}
</div>

<BackToTop />
