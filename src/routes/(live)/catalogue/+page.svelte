<script lang="ts">
  import { catalogueService } from "$lib/services/catalogue";
  import Catalogue from "$lib/ui/time/Catalogue.svelte";
  import { onMount } from "svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();
  let totalModules = $state(0);
  let totalStudents = $state(0);
  onMount(async () => {
    totalModules = await catalogueService.getCatalogueCount();
    totalStudents = await catalogueService.getStudentCount();
  });
</script>

<div class="w-full">
  <div class="flex justify-end gap-2">
    <div class="bg-gray-100 p-1 text-right text-xs dark:bg-gray-800">
      Totals: modules-{totalModules}:students-{totalStudents}
    </div>
  </div>
  <Catalogue courseRecords={data.courseRecords} />
</div>
