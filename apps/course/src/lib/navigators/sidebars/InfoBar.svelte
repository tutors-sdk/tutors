<script lang="ts">
  import { infoDrawer, currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";

  const courseInfo = convertMd($currentCourse.lo.contentMd, "");

  const drawerClose: any = () => {
    infoDrawer.set(false);
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click="{drawerClose}"><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <prose class="prose dark:prose-invert">
    {@html courseInfo}
  </prose>
</div>
