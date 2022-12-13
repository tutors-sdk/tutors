<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import { StudentLoEvent } from "tutors-reader-lib/src/types/metrics-types";

  export let lo: StudentLoEvent;
  let imageHeight = "h-24";
</script>

<div class="card h-90 border-primary-500 m-2 w-4/5 overflow-x-hidden border-y-8 transition-all hover:scale-105 lg:w-2/5">
  <div class="flex">
    <header class="card-header inline-flex items-center">
      <Avatar src="{lo.studentImg}" alt="{lo.studentName}" class="mr-2" />
      <h6>{lo.studentName}</h6>
    </header>
  </div>
  <div class="card-body">
    <div class="my-2 justify-center">
      <img loading="lazy" class="mx-auto {imageHeight}" src="{lo.loImage}" alt="{lo.loTitle}" />
    </div>
  </div>
  <footer class="card-footer text-center">
    <p class="mt-2 font-semibold">
      <span class="italic"></span>{lo.loTitle}
    </p>
  </footer>
</div>
