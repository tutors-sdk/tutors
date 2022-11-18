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
  import NavBar from "./navigators/NavBar.svelte";
  import PageHeader from "./navigators/PageHeader.svelte";
  import { Footer } from "tutors-ui";
  import Logout from "./pages/support/Logout.svelte";
  import TutorsTerms from "./pages/support/TutorsTerms.svelte";
  import { CourseService } from "tutors-reader-lib/src/services/course-service";
  import { handleAuthentication } from "tutors-reader-lib/src/services/auth-service";
  import { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { MetricsService } from "tutors-reader-lib/src/services/metrics-service";
  import Search from "./pages/Search.svelte";
  import InfoBar from "./navigators/sidebars/InfoBar.svelte";
  import CalendarBar from "./navigators/sidebars/CalendarBar.svelte";
  import OnlineBar from "./navigators/sidebars/OnlineBar.svelte";
  import TocBar from "./navigators/sidebars/TocBar.svelte";
  import Note from "./pages/Note.svelte";
  import { currentLo, infoDrawer, calendarDrawer, onlineDrawer, tocDrawer, storeTheme } from "tutors-reader-lib/src/stores/stores";

  import tutors from "tutors-ui/lib/themes/tutors.css";
  import dyslexia from "tutors-ui/lib/themes/dyslexia.css";

  const themes: any = { tutors, dyslexia };

  storeTheme.subscribe(setBodyThemeAttribute);
  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  console.log("starting up...");
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
    <Drawer open={infoDrawer} position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <InfoBar />
    </Drawer>

    <Drawer
      open={calendarDrawer}
      position="left"
      width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3"
      blur="backdrop-blur-none"
      class="z-50"
    >
      <CalendarBar />
    </Drawer>

    <Drawer open={onlineDrawer} position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <OnlineBar />
    </Drawer>

    <Drawer open={tocDrawer} position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <TocBar />
    </Drawer>
    <AppShell class="h-screen">
      <svelte:fragment slot="header">
        <NavBar />
        <PageHeader />
      </svelte:fragment>
      <div id="top" />
      <div class="mx-auto my-4">
        <Router {routes} />
      </div>
      <svelte:fragment slot="pageFooter">
        <div class="bg-surface-100-800-token bottom-0 mt-2">
          <Footer />
        </div>
      </svelte:fragment>
    </AppShell>
  {/if}
</div>
