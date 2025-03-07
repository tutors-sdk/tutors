<script lang="ts">
  import CourseList from "./CourseList.svelte";
  import Links from "./Links.svelte";
  import TutorsInfo from "./TutorsInfo.svelte";
  import Welcome from "./Welcome.svelte";
</script>

<div class="card to-accent-50 border-surface-200 dark:border-surface-400 dark:to-accent-900 from-primary-50 dark:from-primary-900 m-4 border bg-linear-to-l">
  <div class="container mx-auto mt-2 items-center justify-between lg:flex">
    <div class="mx-4">
      <Welcome />
    </div>
    <div class="mx-4 lg:w-1/2">
      <TutorsInfo />
      <Links />
    </div>
  </div>
</div>
<CourseList />
