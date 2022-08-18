<script lang="ts">
  import "./tailwind.css";
  import { onMount, setContext } from "svelte";
  import Router from "svelte-spa-router";
  import Sidebar from "./components/navigators/sidebars/TocBar.svelte";
  import Onlinebar from "./components/navigators/sidebars/OnlineBar.svelte";
  import Blank from "./pages/support/Blank.svelte";
  import Unauthorised from "./pages/support/Unauthorised.svelte";
  import Course from "./pages/Course.svelte";
  import Topic from "./pages/Topic.svelte";
  import Talk from "./pages/Talk.svelte";
  import Video from "./pages/Video.svelte";
  import Wall from "./pages/Wall.svelte";
  import Lab from "./pages/Lab.svelte";
  import NotFound from "./pages/support/NotFound.svelte";
  import MainNavigator from "./components/navigators/MainNavigator.svelte";
  import Footer from "./components/navigators/footer/Footer.svelte";
  import BackToTop from "./components/navigators/BackToTop.svelte";
  import Logout from "./pages/support/Logout.svelte";
  import TutorsTerms from "./pages/support/TutorsTerms.svelte";
  import { CourseService } from "./reader-lib/services/course-service";
  import { handleAuthentication } from "./reader-lib/services/auth-service";
  import { AnalyticsService } from "./reader-lib/services/analytics-service";
  import Search from "./pages/Search.svelte";
  import Modal from "svelte-simple-modal";
  import { setIconLib, themeIcons, themes } from "tutors-reader-lib/src/iconography/themes";
  import Infobar from "./components/navigators/sidebars/InfoBar.svelte";
  import Calendar from "./components/navigators/sidebars/CalendarBar.svelte";
  import Note from "./pages/Note.svelte";
  import { MetricsService } from "./reader-lib/services/metrics-service";
  import { currentLo } from "./stores";

  setContext("cache", new CourseService());
  const analytics = new AnalyticsService();
  setContext("analytics", analytics);
  setContext("metrics", new MetricsService());

  let authenticating = false;
  let bg = "bg-gray-50";

  onMount(async () => {
    applyInitialTheme();
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

  const htmlTag = document.getElementsByTagName("html")[0];
  let currentTheme = window.localStorage.getItem("site-theme");
  if (themes.indexOf(currentTheme) < 0) {
    currentTheme = null;
  }

  function applyInitialTheme() {
    if (currentTheme == null) {
      window.localStorage.setItem("site-theme", "tutors");
      window.localStorage.setItem("theme", "tutors");
      htmlTag.setAttribute("data-theme", "tutors");
      setIconLib(themeIcons["tutors"]);
    } else {
      htmlTag.setAttribute("data-theme", currentTheme);
      setIconLib(themeIcons[currentTheme]);
    }
  }
</script>

<svelte:head>
  <title>{$currentLo?.title}</title>
</svelte:head>

<div class="tutors-container">
  {#if authenticating}
    <TutorsTerms bind:authenticating />
  {:else}
    <div class="content">
      <Modal>
        <Sidebar />
        <Onlinebar />
        <Infobar />
        <Calendar />
        <MainNavigator />
        <div class="container course-container">
          <Router {routes} />
        </div>
      </Modal>
    </div>
    <div class="footer w-11/12 lg:w-full mx-auto">
      <Footer />
    </div>
  {/if}
</div>

<BackToTop />
