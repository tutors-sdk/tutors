<script lang="ts">
  import "../../../app.postcss";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import { AppShell } from "@skeletonlabs/skeleton";
</script>

<svelte:head>
  <title>Tutors</title>
</svelte:head>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <TutorsTitle title="Login to Tutors" subtitle="Tutors Open Source Project" />
      </svelte:fragment>
      <slot name="header" />
      <svelte:fragment slot="trail">
        <a class="btn btn-sm" href="/" title="Tutors.dev"> <img src="/logo.svg" alt="Turrs" class="w-6 bg-none" /> &nbsp;Tutors.dev </a>
      </svelte:fragment>
    </MainNavigator>
  </svelte:fragment>
  <slot />
</AppShell>
