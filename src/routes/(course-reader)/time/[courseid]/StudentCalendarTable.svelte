<script lang="ts">
  import type { CalendarRow, CalendarMedianRow } from "@tutors/tutors-time-lib";
  import { formatDateShort, formatTimeMinutesOnly, cellColorForMinutes } from "@tutors/tutors-time-lib";

  interface Props {
    courseid: string;
    studentid: string;
    calendarByWeek: CalendarRow | null;
    medianRow: CalendarMedianRow | null;
    weeks: string[];
  }

  let { courseid, studentid, calendarByWeek, medianRow, weeks }: Props = $props();

  // Values are already in minutes (converted at load)
  function formatTime(minutes: number | undefined): string {
    if (minutes == null || minutes === 0) return "—";
    return `${Math.round(minutes)}`;
  }

  function formatLabTime(minutes: number | undefined): string {
    if (minutes == null || minutes === 0) return "—";
    return formatTimeMinutesOnly(minutes);
  }
</script>

{#if calendarByWeek}
  <section class="card p-6">
    <h2 class="text-2xl font-semibold mb-4">Calendar Activity by Week</h2>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse" style="table-layout: fixed;">
        <thead>
          <tr class="border-b-2 border-surface-300">
            <th class="text-left py-4 px-4 font-semibold" style="width: 160px;">Name</th>
            <th class="text-left py-4 px-4 font-semibold" style="width: 120px;">Github</th>
            {#each weeks as week}
              <th class="text-center py-4 px-1 font-semibold align-middle" style="width: 36px; min-width: 36px; max-width: 36px; height: 140px; overflow: hidden;">
                <div class="transform -rotate-90 whitespace-nowrap text-xs" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                  {formatDateShort(week)}
                </div>
              </th>
            {/each}
            <th class="text-right py-4 px-4 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          <!-- Student Row -->
          <tr class="border-b border-surface-200 hover:bg-surface-50">
            <td class="py-3 px-4" style="width: 160px;">
              {calendarByWeek.full_name}
            </td>
            <td class="py-3 px-4" style="width: 120px;">
              <a href="https://github.com/{studentid}" target="_blank" rel="noopener noreferrer" class="underline text-primary-600">
                {studentid}
              </a>
            </td>
            {#each weeks as week}
              {@const weekMinutes = calendarByWeek[week] as number | undefined}
              {@const weekBlocks = weekMinutes != null ? weekMinutes : 0}
              <td class="py-3 px-1 text-center font-mono text-xs" style="width: 36px; min-width: 36px; max-width: 36px; background-color: {cellColorForMinutes(weekBlocks)}">
                {weekMinutes}
              </td>
            {/each}
            <td class="py-3 px-4 text-right font-mono font-semibold" style="background-color: {cellColorForMinutes(calendarByWeek.totalSeconds ?? 0)}">
              {formatTime(calendarByWeek.totalSeconds)}
            </td>
          </tr>
          <!-- Median Row -->
          {#if medianRow}
            {@const totalBlocks = medianRow.totalSeconds ?? 0}
            <tr class="border-b-2 border-surface-300 bg-surface-100">
              <td class="py-3 px-4 font-semibold" style="width: 160px;">Course Median</td>
              <td class="py-3 px-4" style="width: 120px;">—</td>
              {#each weeks as week}
                {@const weekBlocks = medianRow[week] as number | undefined}
                <td class="py-3 px-1 text-center font-mono text-xs" style="width: 36px; min-width: 36px; max-width: 36px; background-color: {cellColorForMinutes(weekBlocks ?? 0)}">
                  {formatLabTime(weekBlocks)}
                </td>
              {/each}
              <td class="py-3 px-4 text-right font-mono font-semibold" style="background-color: {cellColorForMinutes(totalBlocks)}">
                {formatLabTime(medianRow.totalSeconds)}
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </section>
{/if}
