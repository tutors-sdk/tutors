<script lang="ts">
  import { AppShell, Modal } from "@skeletonlabs/skeleton";
  import HomeFooter from "$lib/ui/navigators/footers/HomeFooter.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import { goto } from "$app/navigation";
  import LoginButton from "../navigators/buttons/LoginButton.svelte";
  import DashboardProfile from "../navigators/profiles/DashboardProfile.svelte";
  import Footer from "../navigators/footers/Footer.svelte";

  export let session: any;
  export let supabase: any;
  export let title = "Tutors Open Source Project";
  export let subTitle = "Open Web Learning Components";

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
  <Modal />
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
    <Footer />
  </svelte:fragment>
</AppShell>
