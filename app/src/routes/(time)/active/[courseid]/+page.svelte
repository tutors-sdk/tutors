<script lang="ts">
  import "../../../../app.postcss";
  import { AppShell } from "@skeletonlabs/skeleton";
  import HomeFooter from "$lib/ui/navigators/footers/HomeFooter.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import { studentsOnlineList } from "./stores";
  import StudentCard from "./StudentCard.svelte";
</script>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <TutorsTitle title="Tutors Live Stream" subtitle="online now" />
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
      </svelte:fragment>
    </MainNavigator>
  </svelte:fragment>
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
    <div class="flex flex-wrap justify-center">
      {#each $studentsOnlineList as studentLo}
        <StudentCard lo={studentLo} />
      {/each}
    </div>
  </div>
  <svelte:fragment slot="pageFooter">
    <HomeFooter />
  </svelte:fragment>
</AppShell>
