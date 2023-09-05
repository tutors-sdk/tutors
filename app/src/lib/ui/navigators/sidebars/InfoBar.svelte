<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import { convertMdToHtml } from "$lib/services/models-ng/markdown-utils";
  const courseInfo = convertMdToHtml($currentCourse.contentMd, "");

  const drawerStore = getDrawerStore();
  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click={drawerClose}><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <prose class="prose dark:prose-invert">
    {@html courseInfo}
  </prose>
</div>
