<script lang="ts">
  import type { Calendar } from "@tutors/tutors-model-lib";
  import { t } from "$lib/services/i18n";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  interface Props {
    calendar: Calendar;
  }
  let { calendar }: Props = $props();
</script>

<h4 class="mb-4 text-center font-semibold">{calendar.title}</h4>
<table class="w-full table-auto" aria-label={calendar.title}>
  <thead>
    <tr>
      <th scope="col" class="mb-1 text-center">{t("content.weekNo")}</th>
      <th scope="col" class="mb-1 text-center">{t("content.type")}</th>
      <th scope="col" class="mb-1 text-center">{t("content.dateStarts")}</th>
    </tr>
  </thead>
  <tbody class="text-center">
    {#each calendar.weeks as week}
      {#if calendar?.currentWeek?.title == week.title}
        <tr class="bg-success-300 dark:bg-success-700 my-2" aria-current="date">
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
