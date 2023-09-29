<script lang="ts">
  import { goto } from "$app/navigation";
  import { AppShell } from "@skeletonlabs/skeleton";
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import DashboardProfile from "$lib/ui/navigators/profiles/DashboardProfile.svelte";
  import { currentCourse } from "$lib/stores";
  import LoginButton from "$lib/ui/navigators/buttons/LoginButton.svelte";

  export let session: any;
  export let supabase: any;
  export let subTitle = "";

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      goto("/auth");
    }
  };
</script>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <a href="/">
          <TutorsTitle title={$currentCourse?.title} subtitle={subTitle} />
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
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
