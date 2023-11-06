<script lang="ts">
  import { coursesOnlineList } from "$lib/stores";
  import LiveCourseCard from "./LiveCourseCard.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each $coursesOnlineList as lo}
    <LiveCourseCard {lo} />
  {/each}
</div>
