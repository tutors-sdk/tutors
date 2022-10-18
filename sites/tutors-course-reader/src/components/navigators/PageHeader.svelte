<script lang="ts">
  import { currentCourse, portfolio } from "../../stores";
  import Breadcrumbs from "./support/Breadcrumbs.svelte";
  import Companions from "./support/Companions.svelte";
  import Wall from "./support/Wall.svelte";
</script>

{#if $currentCourse}
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