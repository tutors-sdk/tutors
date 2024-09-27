<script lang="ts">
  import { AppShell, Toast, Modal, getToastStore, type DrawerSettings, getDrawerStore } from "@skeletonlabs/skeleton";
  import Sidebars from "$lib/ui/navigators/sidebars/Sidebars.svelte";
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import CalendarButton from "$lib/ui/navigators/buttons/CalendarButton.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import LayoutMenu from "$lib/ui/themes/menu/LayoutMenu.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import CourseTitle from "$lib/ui/navigators/titles/CourseTitle.svelte";
  import CourseProfile from "$lib/ui/navigators/profiles/CourseProfile.svelte";
  import LoginButton from "$lib/ui/navigators/buttons/LoginButton.svelte";
  import TocButton from "$lib/ui/navigators/buttons/TocButton.svelte";
  import InfoButton from "$lib/ui/navigators/buttons/InfoButton.svelte";
  import SearchButton from "$lib/ui/navigators/buttons/SearchButton.svelte";
  import TutorsTimeIndicator from "$lib/ui/navigators/buttons/TutorsTimeIndicator.svelte";
  import { currentCourse, onlineStatus, transitionKey } from "$lib/stores";
  import { analyticsService } from "$lib/services/analytics/analytics";
  import { goto } from "$app/navigation";
  import { beforeUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import type { Session } from "@supabase/auth-js/src/lib/types";
  import type { Course } from "$lib/services/models/lo-types";
  import { ForgottenPassword } from "@supabase/auth-ui-svelte";

  export let session: Session;
  export let supabase: SupabaseClient;

  const drawerStore = getDrawerStore();
  const toastStore = getToastStore();

  let course: Course;
  currentCourse.subscribe((current) => {
    course = current;
  });

  beforeUpdate(() => {
    if ($currentCourse.authLevel > 0) {
      if (!session?.user) {
        goto("/auth");
      }
    }
  });

  let status: boolean;
  function handleOnlineStatusChange() {
    status = !status;
    onlineStatus.set(status);
    analyticsService.setOnlineStatus(course, status, session);
  }

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

  const onlineDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "online", position: "right" };
    drawerStore.open(settings);
  };
</script>

<AppShell class="h-screen">
  <Toast />
  <Modal />
  <Sidebars />
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <InfoButton />
        <CourseTitle />
      </svelte:fragment>
      <CalendarButton />
      <svelte:fragment slot="trail">
        <TutorsTimeIndicator />
        {#if !$currentCourse.isPortfolio}
          <SearchButton />
        {/if}
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
        <span class="divider-vertical h-10 hidden lg:block" />
        {#if !$currentCourse.isPrivate}
          {#if session}
            <div class="relative">
              <CourseProfile {session} {handleOnlineStatusChange} {handleSignOut} {onlineDrawerOpen} />
            </div>
          {:else}
            <LoginButton />
          {/if}
          {#if !$currentCourse.isPortfolio}
            <TocButton />
          {/if}
        {/if}
      </svelte:fragment>
    </MainNavigator>
    <SecondaryNavigator />
  </svelte:fragment>
  {#key $transitionKey}
    <div id="app" class="h-full">
      <div id="top" />
      <div class="mx-auto my-4">
        <div in:fade={{ duration: 300, delay: 200 }}>
          <slot />
        </div>
      </div>
    </div>
  {/key}

  <svelte:fragment slot="pageFooter">
    <Footer />
  </svelte:fragment>
</AppShell>
