<script lang="ts">
  import TitleCard from "./support/TitleCard.svelte";
  import { courseUrl, currentCourse, layout, calendarDrawer, infoDrawer, onlineDrawer } from "../../stores";
  import Presence from "./support/Presence.svelte";
  import Avatar from "./support/Avatar.svelte";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { AppBar, LightSwitch } from "@brainandbones/skeleton";

  function applyInitialLayout() {
    const savedLayout = window.localStorage.getItem("site-layout");
    if (savedLayout != null) {
      layout.set(savedLayout);
    } else {
      layout.set("expanded");
      window.localStorage.setItem("site-layout", "expanded");
    }
  }

  function toggleLayout() {
    if ($layout === "compacted") {
      layout.set("expanded");
      window.localStorage.setItem("site-layout", "expanded");
    } else {
      layout.set("compacted");
      window.localStorage.setItem("site-layout", "compacted");
    }
  }

  const infoDrawerOpen: any = () => { infoDrawer.set(true) };
  const calendarDrawerOpen: any = () => { calendarDrawer.set(true) };

  applyInitialLayout();
</script>

{#if $currentCourse}
  <AppBar>
    <svelte:fragment slot="lead">
      <div class="flex">
        {#if $currentCourse?.lo.contentMd}
          <button class="btn btn-base" on:click={infoDrawerOpen}>
            <Icon type="courseinfo" button={true} />
          </button>
        {/if}
        <TitleCard />
      </div>
    </svelte:fragment>
    {#if $currentCourse.currentWeek}
      <div class="inline-flex">
        <button class="btn" on:click={calendarDrawerOpen}>
          <Icon type="calendar" />
        </button>
        <div class="calendar">
          <div class="pt-1 text-sm">Current Week</div>
          <div class="text-l pb-1">{$currentCourse.currentWeek.title}</div>
        </div>
      </div>
    {/if}
    <svelte:fragment slot="trail">
      {#if !$currentCourse.isPortfolio()}
        <Icon type="search" link="/#/search/{$courseUrl}" button={true} />
      {/if}
      <button class="btn" on:click={() => toggleLayout()}>
        <Icon type={$layout} />
      </button>
      <LightSwitch origin="tr" />
      <Presence />
      <Avatar />
      <button class="btn" on:click={() => {}}>
        <Icon type="toc" />
      </button>
      </svelte:fragment
    >
  </AppBar>
{/if}
