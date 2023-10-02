<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton";
  import HomeFooter from "$lib/ui/navigators/footers/HomeFooter.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import DashboardProfile from "./profiles/DashboardProfile.svelte";
  import LoginButton from "./buttons/LoginButton.svelte";
  import { goto } from "$app/navigation";
  const title = "Tutors Open Source Project";
  const subTitle = "Open Web Learning Toolkit";

  export let session: any;
  export let supabase: any;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      session = null;
      goto("/");
    }
  };
</script>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <TutorsTitle {title} subtitle={subTitle} />
      </svelte:fragment>
      <slot name="header" />
      <svelte:fragment slot="trail">
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
        <span class="divider-vertical h-10 hidden lg:block" />
        {#if session}
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
    <HomeFooter />
  </svelte:fragment>
</AppShell>
