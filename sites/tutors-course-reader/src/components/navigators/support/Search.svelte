<script lang="ts">
  import { courseUrl, currentCourse } from "../../../stores";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
</script>

{#if !$currentCourse.isPortfolio()}
  <button class="tooltip tooltip-bottom">
    <Icon type="search" toolTip="Search" link="/#/search/{$courseUrl}" button={true} />
  </button>
{/if}
