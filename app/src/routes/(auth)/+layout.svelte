<script lang="ts">
  import "../../app.postcss";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { onlineStatus, storeTheme } from "$lib/stores";
  import { AppShell, popup } from "@skeletonlabs/skeleton";
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import { get } from "svelte/store";
  import DashboardProfile from "$lib/ui/navigators/profiles/DashboardProfile.svelte";
  import LoginButton from "$lib/ui/navigators/buttons/LoginButton.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  let status: boolean;

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      goto("/auth");
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
</script>

<svelte:head>
  <title>Tutors</title>
</svelte:head>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <a href="/">
          <TutorsTitle title="Tutors" subtitle="Course Dashboard" />
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
        {#if data.session}
          <div class="relative">
            <DashboardProfile {session} {handleSignOut} />
          </div>
        {:else}
          <LoginButton />
        {/if}
      </svelte:fragment>
    </MainNavigator>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    <Footer />
  </svelte:fragment>
</AppShell>
