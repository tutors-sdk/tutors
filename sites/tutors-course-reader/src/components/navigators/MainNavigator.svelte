<script lang="ts">
  import TitleCard from "./support/TitleCard.svelte";
  import { currentCourse, layout, calendarDrawer, infoDrawer, tocDrawer, storeTheme } from "../../stores";
  import Avatar from "./support/Avatar.svelte";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { AppBar, LightSwitch, menu } from "@brainandbones/skeleton";

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
  const tocDrawerOpen: any = () => { tocDrawer.set(true) };

  applyInitialLayout();
</script>

{#if $currentCourse}
  <AppBar>
    <svelte:fragment slot="lead">
      <div class="flex">
        {#if $currentCourse?.lo.contentMd}
          <button class="btn btn-icon" on:click={infoDrawerOpen}>
            <Icon type="courseinfo" button={true} />
          </button>
        {/if}
        <TitleCard />
      </div>
    </svelte:fragment>
    {#if $currentCourse.currentWeek}
      <div class="hidden lg:flex w-full">
        <div class="inline-flex mx-auto">
        <button class="btn" on:click={calendarDrawerOpen}>
          <Icon type="calendar" />
        </button>
        <div>
          <div class="pt-1 text-sm">Current Week</div>
          <div class="text-l pb-1">{$currentCourse.currentWeek.title}</div>
        </div></div>
      </div>
    {/if}
    <svelte:fragment slot="trail">
      {#if !$currentCourse.isPortfolio()}
      <a class="btn  btn-icon" href=""><Icon type="search" /></a>
      {/if}
      <div class="relative">
      <button class="btn  btn-icon" use:menu={{ menu: 'design' }}>
        <Icon type="dark" />
      </button>
      <nav class="list-nav card card-body w-56 shadow-xl space-y-4" data-menu="design">
        <h5>Toggles</h5>
        <section class="flex justify-between">
					<h6>Dark Mode</h6>
					<LightSwitch origin="tr" />
				</section>
        <button class="w-full" on:click={() => toggleLayout()}>
        <section class="flex justify-between">
					<h6>Compact</h6>
          <div class="mr-3">
            <Icon type={$layout} />
          </div>
				</section>
      </button>
      <hr>
      <h5>Themes</h5>
        <ul>
          <li class="option" class:!bg-primary-500={$storeTheme === 'tutors'} on:click={() => { storeTheme.set('tutors') }}> 
            <h6>Tutors</h6>
          </li>
          <li class="option" class:!bg-primary-500={$storeTheme === 'dyslexia'} on:click={() => { storeTheme.set('dyslexia') }}> 
            <h6>Dyslexia</h6>
          </li>
          <li class="option" class:!bg-primary-500={$storeTheme === 'halloween'} on:click={() => { storeTheme.set('halloween') }}> 
            <h6>Halloween</h6>
          </li>
        </ul>
      </nav>
    </div>
      <Avatar />
      <button class="btn btn-icon" on:click={tocDrawerOpen}>
        <Icon type="toc" />
      </button>
      </svelte:fragment
    >
  </AppBar>
{/if}
