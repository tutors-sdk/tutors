<script lang="ts">
  import { CourseCard } from "tutors-ui";
  import type { CourseSummary } from "tutors-reader-lib/src/utils/course-utils";
  export let los: CourseSummary[] = [];
</script>

{#if los.length}
  <div class="bg-surface-100-800-token rounded-box card-corner mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4 backdrop-blur">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <CourseCard lo="{lo}" />
      {/each}
    </div>
  </div>
{/if}
