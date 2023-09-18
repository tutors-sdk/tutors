<script lang="ts">
  import "../../app.postcss";
  import { goto, invalidate } from "$app/navigation";
  import { currentCourse, onlineStatus, storeTheme, studentsOnline } from "$lib/stores";

  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { get } from "svelte/store";

  import { setInitialClassState, popup, getToastStore, AppShell, Toast, Modal, initializeStores, getDrawerStore, storePopup, type DrawerSettings } from "@skeletonlabs/skeleton";
  import { transitionKey, currentLo } from "$lib/stores";
  import PageTransition from "$lib/ui/PageTransition.svelte";
  import { getKeys } from "$lib/environment";
  import { analyticsService } from "$lib/services/analytics";
  import { initServices } from "$lib/services/tutors-startup";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { setupPresence, subscribePresence, unsubscribePresence, updatePresence } from "$lib/services/presence";
  import Sidebars from "$lib/ui/navigators/Sidebars.svelte";
  import { NavigationPrimary, NavigationPrimaryButton, NavigationPrimaryLayoutMenu, NavigationPrimaryUser, NavigationPrimaryUserMenu } from "$lib/components";
  import InfoButton from "$lib/ui/navigators/InfoButton.svelte";
  import NavTitle from "$lib/ui/navigators/NavTitle.svelte";
  import TocButton from "$lib/ui/navigators/TocButton.svelte";
  import Footer from "$lib/ui/navigators/Footer.svelte";
  import CalendarButton from "$lib/ui/navigators/CalendarButton.svelte";
  import SearchButton from "$lib/ui/navigators/SearchButton.svelte";
  import PageHeader from "$lib/ui/navigators/PageHeader.svelte";

  const themes: any = ["tutors", "dyslexia", "halloween", "valentines"];
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  export let data: any;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let status: boolean;

  function handleClick() {
    status = !status;
    onlineStatus.set(status);
    analyticsService.setOnlineStatus(status, session);
  }

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  initializeStores();
  const drawerStore = getDrawerStore();
  const toastStore = getToastStore();

  function updatePageCount() {
    if (!document.hidden && !currentRoute.startsWith("/live") && !currentRoute.startsWith("/dashboard")) {
      analyticsService.updatePageCount(session);
    }
  }

  let presenceSetup: boolean = false;

  function setupPresenceLocally() {
    setupPresence(supabase, $page.params.courseid);
    setTimeout(() => {
      presenceSetup = true;
    }, 1000);
  }

  function unsubscribePresenceLocally() {
    unsubscribePresence();
    presenceSetup = false;
  }

  $: {
    if (!presenceSetup && data.session && $onlineStatus) {
      setupPresenceLocally();
    } else if (!$onlineStatus && presenceSetup) {
      unsubscribePresenceLocally();
    }
  }

  $: {
    if ($currentLo && data.session && presenceSetup && ($onlineStatus || $onlineStatus === undefined)) {
      updatePresence({
        studentName: session.user.user_metadata.full_name,
        studentEmail: session.user.user_metadata.email,
        studentImg: session.user.user_metadata.avatar_url,
        courseTitle: get(currentLo).parentLo ? get(currentLo).parentLo.title : get(currentLo).title,
        loTitle: get(currentLo).title,
        loImage: get(currentLo).img,
        loRoute: get(currentLo).route,
        loIcon: get(currentLo).icon
      });
    }
  }

  $: {
    if ($onlineStatus && data.session && presenceSetup && ($onlineStatus || $onlineStatus === undefined)) {
      subscribePresence(
        {
          studentName: session.user.user_metadata.full_name,
          studentEmail: session.user.user_metadata.email,
          studentImg: session.user.user_metadata.avatar_url,
          courseTitle: get(currentLo).parentLo ? get(currentLo).parentLo.title : get(currentLo).title,
          loTitle: get(currentLo).title,
          loImage: get(currentLo).img,
          loRoute: get(currentLo).route,
          loIcon: get(currentLo).icon
        },
        $page.params.courseid
      );
    }
  }

  const onlineDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "online", position: "right" };
    drawerStore.open(settings);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      toastStore.trigger({
        message: "You have successfully logged out!",
        background: "variant-filled-success"
      });
      goto("/");
    }
  };

  onMount(() => {
    setInitialClassState();
    initServices(data.session);
    setInterval(updatePageCount, 30 * 1000);
    status = get(onlineStatus);
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event: any, _session: any) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    storeTheme.subscribe(setBodyThemeAttribute);
    return () => subscription.unsubscribe();
  });

  let isNotCourseRoute: boolean;
  let currentRoute = "";

  $: {
    isNotCourseRoute = !$currentCourse || $page.url.pathname === "/dashboard" || $page.url.pathname === "/time" || $page.url.pathname === "/auth" || $page.url.pathname.length <= 1;
  }
  page.subscribe((path) => {
    if (path.route.id) {
      currentRoute = path.route.id;
    }
    if (path.params.courseid && getKeys().firebase.apiKey !== "XXX") {
      analyticsService.learningEvent(path.params, session);
    }
    if (path.url.hash && !path.url.hash.startsWith("#access_token")) {
      const el = document.querySelector(`[id="${path.url.hash}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  afterNavigate((params) => {
    if (!$page.url.hash) {
      const isNewPage = params.from && params.to && params.from.route.id !== params.to.route.id;
      const elemPage = document.querySelector("#page");
      if (isNewPage && elemPage !== null) {
        elemPage.scrollTop = 0;
      }
    }
  });
</script>

<svelte:head>
  {#if $currentLo}
    <title>{$currentLo.title}</title>
  {:else}
    <title>Tutors Course Reader</title>
  {/if}
</svelte:head>

<AppShell class="h-screen">
  <Toast />
  <Modal />
  <Sidebars />
  <svelte:fragment slot="header">
    <NavigationPrimary>
      <svelte:fragment slot="lead">
        <InfoButton />
        <NavTitle />
      </svelte:fragment>
      <CalendarButton />
      <svelte:fragment slot="trail">
        <SearchButton />

        {#if data.session}
          <div class="relative">
            <button use:popup={{ event: "click", target: "avatar" }}>
              <NavigationPrimaryUser
                avatar={data.session.user.user_metadata.avatar_url}
                name={data.session.user.user_metadata.name}
                onlineStatus={isNotCourseRoute ? undefined : status}
                usersOnline={isNotCourseRoute ? undefined : $studentsOnline.toString()}
              />
            </button>
            <NavigationPrimaryUserMenu
              {isNotCourseRoute}
              name={data.session.user.user_metadata.name}
              username={data.session.user.user_metadata.preferred_username}
              userId={data.session.user.id}
              onlineStatus={isNotCourseRoute ? undefined : status}
              usersOnline={isNotCourseRoute ? undefined : $studentsOnline.toString()}
              currentCourseId={$currentCourse?.courseId}
              currentCourseUrl={$currentCourse?.courseUrl}
              {handleClick}
              {handleSignOut}
              {onlineDrawerOpen}
            />
          </div>
        {:else}
          <NavigationPrimaryButton href="/auth" label="Login / Register" />
        {/if}
        <span class="divider-vertical h-10 hidden lg:block" />
        <NavigationPrimaryLayoutMenu />

        <TocButton />
      </svelte:fragment>
    </NavigationPrimary>
    <PageHeader />
  </svelte:fragment>

  <div id="app" class="h-full overflow-hidden">
    <div id="top" />
    <div class="mx-auto my-4">
      <PageTransition url={$transitionKey}>
        <slot />
      </PageTransition>
    </div>
  </div>

  <svelte:fragment slot="pageFooter">
    {#if $page.url.pathname !== "/"}
      <div class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2">
        <Footer />
      </div>
    {/if}
  </svelte:fragment>
</AppShell>
