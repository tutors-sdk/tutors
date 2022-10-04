<script lang="ts">
  import { currentCourse, revealInfoBar } from "../../../stores";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
</script>

{#if $currentCourse?.lo.contentMd}
  <button on:click={() => revealInfoBar.set(true)}>
    <Icon type="courseinfo" toolTip="Information" button={true} tipPos="tooltip-bottom" />
  </button>
{/if}
