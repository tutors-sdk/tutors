<script lang="ts">
  import "$lib/ui/legacy/themes/tutors.css";
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  import "./app.postcss";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { courseUrl, currentCourse, onlineStatus, storeTheme, studentsOnline } from "$lib/stores";

  import {
    NavigationPrimary,
    NavigationPrimaryButton,
    NavigationPrimaryTitle,
    NavigationPrimaryUser,
    NavigationPrimaryUserMenu
  } from "$lib/components";

  import {
    AppShell,
    popup,
    Toast,
    storePopup,
    type DrawerSettings,
    drawerStore,
    toastStore
  } from "@skeletonlabs/skeleton";
  import LayoutMenu from "$lib/ui/navigators/LayoutMenu.svelte";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";

  import tutors from "$lib/ui/legacy/themes/tutors.css?inline";
  import dyslexia from "$lib/ui/legacy/themes/dyslexia.css?inline";
  import halloween from "$lib/ui/legacy/themes/halloween.css?inline";
  import valentines from "$lib/ui/legacy/themes/valentines.css?inline";
  import Sidebars from "$lib/ui/navigators/sidebars/Sidebars.svelte";
  import PageHeader from "$lib/ui/navigators/PageHeader.svelte";
  import { Footer, NavTitle } from "$lib/ui/legacy";
  import { analyticsService } from "$lib/services/analytics";
  import Icon from "@iconify/svelte";
  import { get } from "svelte/store";

  const themes: any = { tutors, dyslexia, halloween, valentines };
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

  const infoDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "info", position: "left" };
    drawerStore.open(settings);
  };
  const calendarDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "calendar", position: "left" };
    drawerStore.open(settings);
  };
  const tocDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "toc", position: "right" };
    drawerStore.open(settings);
  };
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

  $: {
    isNotCourseRoute =
      !$currentCourse ||
      $page.url.pathname === "/dashboard" ||
      $page.url.pathname === "/time" ||
      $page.url.pathname === "/auth" ||
      $page.url.pathname.length <= 1;
  }
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
  <title>Tutors</title>
</svelte:head>

<AppShell class="h-screen">
  <Toast />
  <Sidebars />
  <svelte:fragment slot="header">
    <NavigationPrimary>
      <svelte:fragment slot="lead">
        {#if isNotCourseRoute}
          <a href="/">
            <NavigationPrimaryTitle title="Tutors" image="/logo.svg" />
          </a>
        {:else}
          <button class="btn btn-sm" on:click={infoDrawerOpen}>
            <Icon
              icon="fluent:info-28-regular"
              color="rgba(var(--color-primary-500))"
              height="20"
            />
          </button>
          <NavTitle />
        {/if}
      </svelte:fragment>
      {#if $currentCourse?.currentWeek}
        <div class="hidden w-full lg:flex">
          <button
            class="mx-auto inline-flex rounded-lg variant-soft-primary p-2"
            on:click={calendarDrawerOpen}
          >
            <span class="my-auto pl-2 pr-4">
              <Icon
                icon="fluent:calendar-ltr-12-regular"
                color="rgba(var(--color-primary-500))"
                height="20"
              />
            </span>
            <span class="divider-vertical h-12 hidden lg:flex my-auto" />
            <span class="px-2">
              <span class="pt-1 text-sm">Current Week</span><br />
              <span class="text-lg pb-1 font-bold">{$currentCourse.currentWeek.title}</span>
            </span>
          </button>
        </div>
      {/if}
      <svelte:fragment slot="trail">
        {#if !isNotCourseRoute}
          <a class="btn btn-sm" href="/search/{$courseUrl}">
            <Icon
              icon="fluent:search-24-filled"
              color="rgba(var(--color-primary-500))"
              height="20"
            />
            <span class="hidden text-sm font-bold lg:block">Search</span>
          </a>
          <span class="divider-vertical h-10 hidden lg:block" />
        {/if}
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
              currentCourseId={$currentCourse?.id}
              currentCourseUrl={$currentCourse?.url}
              {handleClick}
              {handleSignOut}
              {onlineDrawerOpen}
            />
          </div>
        {:else}
          <NavigationPrimaryButton href="/auth" label="Login / Register" />
        {/if}
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
        {#if !isNotCourseRoute}
          <span class="divider-vertical h-10 hidden lg:block" />
          <button class="btn btn-sm" on:click={tocDrawerOpen}>
            <Icon
              icon="fluent:line-horizontal-3-20-filled"
              color="rgba(var(--color-primary-500))"
              height="20"
            />
          </button>
        {/if}
      </svelte:fragment>
    </NavigationPrimary>
    {#if !isNotCourseRoute}
      <PageHeader />
    {/if}
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    {#if $page.url.pathname !== "/" && $page.url.pathname !== "/auth" && $page.url.pathname !== "/dashboard"}
      <div
        class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2"
      >
        <Footer />
      </div>
    {/if}
  </svelte:fragment>
</AppShell>
