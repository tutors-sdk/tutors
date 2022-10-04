<script lang="ts">
  import TitleCard from "./support/TitleCard.svelte";
  import { currentCourse, portfolio } from "../../stores";
  import DarkMode from "./support/ThemeSwitch.svelte";
  import Breadcrumbs from "./support/Breadcrumbs.svelte";
  import Companions from "./support/Companions.svelte";
  import Wall from "./support/Wall.svelte";
  import Search from "./support/Search.svelte";
  import Toc from "./support/Toc.svelte";
  import { fly } from "svelte/transition";
  import Compact from "./support/Compact.svelte";
  import Presence from "./support/Presence.svelte";
  import Avatar from "./support/Avatar.svelte";
  import Info from "./support/Info.svelte";
  import CalendarButton from "./support/CalendarButton.svelte";
  import AppSettings from "./support/AppSettings.svelte";
</script>

{#if $currentCourse}
  <div in:fly={{ y: -100, duration: 1000 }} out:fly={{ y: -100, duration: 500 }} class="header-container">
    <nav class="navbar">
      <div class="container mx-auto">
        <Info />
        <TitleCard />
        <CalendarButton />
        <div class="flex-0">
          <div class="header-icons-desktop">
            <Search />
            <Compact />
            <DarkMode />
          </div>
          <div class="header-icons-mobile">
            <AppSettings />
          </div>
          <Presence />
          <Avatar />
          <Toc />
        </div>
      </div>
    </nav>
  </div>
  <div class="navbar-secondary">
    {#if !$currentCourse.isPortfolio() && !$portfolio}
      <Breadcrumbs />
      <div class="hidden lg:flex">
        <Companions />
        <Wall />
      </div>
    {/if}
  </div>
{/if}
