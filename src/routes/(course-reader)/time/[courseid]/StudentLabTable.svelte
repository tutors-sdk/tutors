<script lang="ts">
  import type { LabRow, LabMedianRow } from "@tutors/tutors-time-lib";
  import { extractLabIdentifier } from "@tutors/tutors-time-lib";
  import { formatTimeMinutesOnly, cellColorForMinutes } from "@tutors/tutors-time-lib";

  interface Props {
    courseid: string;
    studentid: string;
    studentLabRow: LabRow | null;
    labMedianRow: LabMedianRow | null;
    labColumns: string[];
  }

  let { courseid, studentid, studentLabRow, labMedianRow, labColumns }: Props = $props();

  function formatLabTime(minutes: number | undefined): string {
    if (minutes == null || minutes === 0) return "—";
    return formatTimeMinutesOnly(minutes);
  }
</script>

{#if studentLabRow}
  <section class="card p-6">
    <h2 class="text-2xl font-semibold mb-4">Lab Activity by Lab</h2>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse" style="table-layout: fixed;">
        <thead>
          <tr class="border-b-2 border-surface-300">
            <th class="text-left py-4 px-4 font-semibold" style="width: 160px;">Name</th>
            <th class="text-left py-4 px-4 font-semibold" style="width: 120px;">Github</th>
            {#each labColumns as labId}
              <th class="text-center py-4 px-1 font-semibold align-middle" style="width: 36px; min-width: 36px; max-width: 36px; height: 140px; overflow: hidden;">
                <div class="transform -rotate-90 whitespace-nowrap text-xs" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                  {extractLabIdentifier(labId)}
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
              {studentLabRow.full_name}
            </td>
            <td class="py-3 px-4" style="width: 120px;">
              <a href="https://github.com/{studentid}" target="_blank" rel="noopener noreferrer" class="underline text-primary-600">
                {studentLabRow.studentid}
              </a>
            </td>
            {#each labColumns as labId}
              {@const labBlocks = studentLabRow[labId] as number | undefined}
              <td class="py-3 px-1 text-center font-mono text-xs" style="width: 36px; min-width: 36px; max-width: 36px; background-color: {cellColorForMinutes(labBlocks ?? 0)}">
                {formatLabTime(labBlocks)}
              </td>
            {/each}
            <td class="py-3 px-4 text-right font-mono font-semibold" style="background-color: {cellColorForMinutes(studentLabRow.totalMinutes ?? 0)}">
              {formatLabTime(studentLabRow.totalMinutes)}
            </td>
          </tr>
          <!-- Median Row -->
          {#if labMedianRow}
            <tr class="border-b-2 border-surface-300 bg-surface-100">
              <td class="py-3 px-4 font-semibold" style="width: 160px;">Course Median</td>
              <td class="py-3 px-4" style="width: 120px;">—</td>
              {#each labColumns as labId}
                {@const labBlocks = labMedianRow[labId] as number | undefined}
                <td class="py-3 px-1 text-center font-mono text-xs" style="width: 36px; min-width: 36px; max-width: 36px; background-color: {cellColorForMinutes(labBlocks ?? 0)}">
                  {formatLabTime(labBlocks)}
                </td>
              {/each}
              <td class="py-3 px-4 text-right font-mono font-semibold" style="background-color: {cellColorForMinutes(labMedianRow.totalMinutes ?? 0)}">
                {formatLabTime(labMedianRow.totalMinutes)}
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </section>
{/if}
