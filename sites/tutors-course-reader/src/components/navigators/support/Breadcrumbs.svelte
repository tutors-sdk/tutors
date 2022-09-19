<script lang="ts">
  import { currentCourse, currentLo } from "../../../stores";
  import Breadcrumb from "./Breadcrumb.svelte";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { fade, fly } from "svelte/transition";

  function crumbs(lo: Lo, los: Lo[]) {
    if (lo) {
      crumbs(lo.parentLo, los);
      if (!(lo.type === "unit" && lo.parentLo.type === "course")) {
        los.push(lo);
      }
    }
    return los;
  }
</script>
<div class="navbar-secondary-bg">
  <ul in:fly="{{ y: -20, duration: 1000 }}" out:fade>
    {#if $currentCourse.lo.properties?.parent != null }
      <li>
        <a class="navbar-icon" href="#/{$currentCourse.lo.properties?.parent}">
          <Icon type="programHome" />
        </a>
      </li>
    {/if}
    {#each crumbs($currentLo, []) as lo}
      <Breadcrumb {lo} />
    {/each}
  </ul>
</div>
