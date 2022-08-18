<script lang="ts">
  import "./tailwind.css";
  import { onMount, setContext } from "svelte";
  import Router from "svelte-spa-router";
  import Blank from "./pages/support/Blank.svelte";
  import Time from "./pages/Time.svelte";
  import Live from "./pages/Live.svelte";
  import NotFound from "./pages/support/NotFound.svelte";
  import MainNavigator from "./components/navigators/MainNavigator.svelte";
  import { CourseService } from "./reader-lib/services/course-service";
  import { setIconLib, themeIcons } from "tutors-reader-lib/src/iconography/themes";
  import { getKeys } from "./environment";
  import { MetricsService } from "./reader-lib/services/metrics-service";

  import { initializeApp } from 'firebase/app';
  import AllCourses from "./pages/AllCourses.svelte";
  import Presence from "./pages/Presence.svelte";

  setContext("cache", new CourseService());
  setContext("metrics", new MetricsService());

  let authenticating = false;
  let bg = "bg-gray-50";

  onMount(async () => {
    applyInitialTheme();
    if (getKeys().firebase.apiKey !== "XXX") {
      initializeApp(getKeys().firebase);
    }
  });

  let routes = {
    "/": Blank,
    "/time/*": Time,
    "/oldlive/*": Live,
    "/live/*": Presence,
    "/all/": AllCourses,
    "*": NotFound
  };

  const htmlTag = document.getElementsByTagName("html")[0];
  let currentTheme = window.localStorage.getItem("site-theme");
  if (currentTheme === "dracula") {
    currentTheme = null;
  }
  function applyInitialTheme() {
    if (currentTheme != null) {
      htmlTag.setAttribute("data-theme", currentTheme);
      setIconLib(themeIcons[currentTheme]);
    } else if (currentTheme === null) {
      window.localStorage.setItem("site-theme", "tutors");
      window.localStorage.setItem("theme", "tutors");
      htmlTag.setAttribute("data-theme", "tutors");
      setIconLib(themeIcons["tutors"]);
    }
  }

</script>

<div id="top" class="tutors-container">
  <MainNavigator />
  <Router {routes} />
</div>

