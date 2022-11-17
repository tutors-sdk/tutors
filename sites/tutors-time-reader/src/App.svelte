<script lang="ts">
  import "@brainandbones/skeleton/styles/all.css";
  import { AppShell } from "@brainandbones/skeleton";
  import { setContext } from "svelte";
  import AllCourses from "./pages/AllCourses.svelte";
  import CurrentEvents from "./pages/CourseEvents.svelte";
  import Router from "svelte-spa-router";
  import Blank from "./pages/support/Blank.svelte";
  import NotFound from "./pages/support/NotFound.svelte";
  import { Footer } from "tutors-ui";
  import { CourseService } from "tutors-reader-lib/src/services/course-service";
  import { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { MetricsService } from "tutors-reader-lib/src/services/metrics-service";
  import { currentLo, storeTheme } from "tutors-reader-lib/src/stores/stores";

  import tutors from "tutors-ui/lib/themes/tutors.css";
  import dyslexia from "tutors-ui/lib/themes/dyslexia.css";
  import Time from "./pages/Time.svelte";

  const themes: any = { tutors, dyslexia };

  storeTheme.subscribe(setBodyThemeAttribute);
  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  setContext("cache", new CourseService());
  const analytics = new AnalyticsService();
  setContext("analytics", analytics);
  setContext("metrics", new MetricsService());

  let routes = {
    "/": Blank,
    "/time/*": Time,
    "/all/": AllCourses,
    "/current/": CurrentEvents,
    "*": NotFound,
  };
</script>

<svelte:head>
  <title>{$currentLo?.title}</title>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  <AppShell class="h-screen">
    <!-- <div class="mx-auto my-4 min-h-[70%]"> -->
    <div class="w-full">
      <Router {routes} />
    </div>
  </AppShell>
</div>
