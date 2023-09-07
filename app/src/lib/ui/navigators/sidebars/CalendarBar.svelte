<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click={drawerClose}><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <h4 class="mb-4 text-center font-semibold">{$currentCourse?.title} : {$currentCourse?.courseCalendar?.title}</h4>
  <table class="w-full table-auto">
    <thead>
      <tr>
        <th class="mb-1 text-center">Week No.</th>
        <th class="mb-1 text-center">Type</th>
        <th class="mb-1 text-center">Date Starts</th>
      </tr>
    </thead>
    <tbody class="text-center">
      {#each $currentCourse?.courseCalendar?.weeks as week}
        {#if $currentCourse?.courseCalendar?.currentWeek.title == week.title}
          <tr class="my-2 bg-success-300 dark:bg-success-700">
            <td>{week.title}</td>
            <td>{week.type}</td>
            <td>{monthNames[week.dateObj.getMonth()]} {week.dateObj.getDate()}</td>
          </tr>
        {:else}
          <tr class="hover my-2">
            <td>{week.title}</td>
            <td>{week.type}</td>
            <td>{monthNames[week.dateObj.getMonth()]} {week.dateObj.getDate()}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
