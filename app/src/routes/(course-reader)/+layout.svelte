<script lang="ts">
  import "../../app.postcss";
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { get } from "svelte/store";
  import { setInitialClassState } from "@skeletonlabs/skeleton";
  import { onlineStatus, storeTheme, transitionKey, currentLo, currentCourse } from "$lib/stores";
  import { getKeys } from "$lib/environment";
  import { analyticsService } from "$lib/services/analytics";
  import { setupPresence, subscribePresence, unsubscribePresence, updatePresence } from "$lib/services/presence";
  import CourseShell from "$lib/ui/app-shells/CourseShell.svelte";

  export let data: any;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let status: boolean;

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

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
        courseTitle: get(currentLo).parentLo ? $currentLo?.parentLo?.title : get(currentLo).title,
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

  onMount(() => {
    setInitialClassState();
    //initServices(data.session);
    setInterval(updatePageCount, 30 * 1000);
    status = get(onlineStatus);
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event: any, _session: any) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    storeTheme.subscribe(setBodyThemeAttribute);
    return () => subscription.unsubscribe();
  });

  let currentRoute = "";

  page.subscribe((path) => {
    if (path.route.id) {
      currentRoute = path.route.id;
    }
    if (path.params.courseid && getKeys().firebase.apiKey !== "XXX" && !$currentCourse.isPrivate) {
      analyticsService.learningEvent(path.params, session);
    }
    if (path.url.hash && !path.url.hash.startsWith("#access_token")) {
      const el = document.querySelector(`[id="${path.url.hash}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (["course", "topic", "unit"].includes($currentLo.type)) {
      transitionKey.set(path.url.pathname);
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
  <title>{$currentLo?.title}</title>
</svelte:head>

<CourseShell {session} {supabase}>
  <slot />
</CourseShell>
