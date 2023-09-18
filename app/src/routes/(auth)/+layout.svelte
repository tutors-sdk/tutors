<script lang="ts">
  import "../../app.postcss";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { onlineStatus, storeTheme } from "$lib/stores";

  import {
    NavigationPrimary,
    NavigationPrimaryButton,
    NavigationPrimaryTitle,
    NavigationPrimaryUser,
    NavigationPrimaryUserMenu,
    NavigationPrimaryLayoutMenu
  } from "$lib/components";

  import { AppShell, popup, Toast, storePopup, type DrawerSettings, initializeStores, getDrawerStore, getToastStore, Modal } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";

  import Footer from "$lib/ui/navigators/Footer.svelte";
  import { analyticsService } from "$lib/services/analytics";
  import { get } from "svelte/store";
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

  let isNotCourseRoute = true;
</script>

<svelte:head>
  <title>Tutors</title>
</svelte:head>

<AppShell class="h-screen">
  <Toast />
  <Modal />
  <svelte:fragment slot="header">
    <NavigationPrimary>
      <svelte:fragment slot="lead">
        <a href="/">
          <NavigationPrimaryTitle title="Tutors" image="/logo.svg" />
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if data.session}
          <div class="relative">
            <button use:popup={{ event: "click", target: "avatar" }}>
              <NavigationPrimaryUser
                avatar={data.session.user.user_metadata.avatar_url}
                name={data.session.user.user_metadata.name}
                onlineStatus={undefined}
                usersOnline={undefined}
              />
            </button>
            <NavigationPrimaryUserMenu
              {isNotCourseRoute}
              name={data.session.user.user_metadata.name}
              username={data.session.user.user_metadata.preferred_username}
              userId={data.session.user.id}
              onlineStatus={undefined}
              usersOnline={undefined}
              currentCourseId={undefined}
              currentCourseUrl={undefined}
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
      </svelte:fragment>
    </NavigationPrimary>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    {#if $page.url.pathname !== "/"}
      <div class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2">
        <Footer />
      </div>
    {/if}
  </svelte:fragment>
</AppShell>
