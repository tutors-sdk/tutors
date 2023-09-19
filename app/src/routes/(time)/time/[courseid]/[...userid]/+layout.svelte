<script lang="ts">
  import "../../../../../app.postcss";
  import { goto } from "$app/navigation";
  import { AppShell, popup } from "@skeletonlabs/skeleton";
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import DashboardProfileButton from "$lib/ui/navigators/buttons/DashboardProfileButton.svelte";
  import DashboardProfileMenu from "$lib/ui/navigators/menus/DashboardProfileMenu.svelte";
  import LoginButton from "$lib/ui/navigators/buttons/LoginButton.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

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
          <TutorsTitle title="Tutors" subtitle="Course Dashboard" />
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if data.session}
          <div class="relative">
            <button use:popup={{ event: "click", target: "avatar" }}>
              <DashboardProfileButton {session} />
            </button>
            <DashboardProfileMenu {session} {handleSignOut} />
          </div>
        {:else}
          <LoginButton />
        {/if}
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
      </svelte:fragment>
    </MainNavigator>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    <Footer />
  </svelte:fragment>
</AppShell>
