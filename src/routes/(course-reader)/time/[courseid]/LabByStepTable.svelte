<script lang="ts">
  import type { LabRow, LabMedianRow } from "@tutors/tutors-time-lib";
  import { extractStepName, formatTimeMinutesOnly, cellColorForMinutes } from "@tutors/tutors-time-lib";

  interface Props {
    courseid: string;
    studentid: string;
    labsByStep: LabRow | null;
    medianRow: LabMedianRow | null;
    stepColumns: string[];
  }

  let { courseid, studentid, labsByStep, medianRow, stepColumns }: Props = $props();

  function formatLabTime(minutes: number | undefined): string {
    if (minutes == null || minutes === 0) return "—";
    return formatTimeMinutesOnly(minutes);
  }
</script>

{#if labsByStep}
  <section class="card p-6">
    <h2 class="text-2xl font-semibold mb-4">Lab Activity by Step</h2>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse" style="table-layout: fixed;">
        <thead>
          <tr class="border-b-2 border-surface-300">
            <th class="text-left py-4 px-4 font-semibold" style="width: 160px;">Name</th>
            <th class="text-left py-4 px-4 font-semibold" style="width: 120px;">Github</th>
            {#each stepColumns as stepId}
              <th class="text-center py-4 px-1 font-semibold align-middle" style="width: 36px; min-width: 36px; max-width: 36px; height: 140px; overflow: hidden;">
                <div class="transform -rotate-90 whitespace-nowrap text-xs" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                  {extractStepName(stepId)}
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
              {labsByStep.full_name}
            </td>
            <td class="py-3 px-4" style="width: 120px;">
              <a href="https://github.com/{studentid}" target="_blank" rel="noopener noreferrer" class="underline text-primary-600">
                {labsByStep.studentid}
              </a>
            </td>
            {#each stepColumns as stepId}
              {@const stepMinutes = labsByStep[stepId] as number | undefined}
              <td class="py-3 px-1 text-center font-mono text-xs" style="width: 36px; min-width: 36px; max-width: 36px; background-color: {cellColorForMinutes(stepMinutes ?? 0)}">
                {formatLabTime(stepMinutes)}
              </td>
            {/each}
            <td class="py-3 px-4 text-right font-mono font-semibold" style="background-color: {cellColorForMinutes(labsByStep.totalMinutes ?? 0)}">
              {formatLabTime(labsByStep.totalMinutes)}
            </td>
          </tr>
          <!-- Median Row -->
          {#if medianRow}
            <tr class="border-b-2 border-surface-300 bg-surface-100">
              <td class="py-3 px-4 font-semibold" style="width: 160px;">Course Median</td>
              <td class="py-3 px-4" style="width: 120px;">—</td>
              {#each stepColumns as stepId}
                {@const stepMinutes = medianRow[stepId] as number | undefined}
                <td class="py-3 px-1 text-center font-mono text-xs" style="width: 36px; min-width: 36px; max-width: 36px; background-color: {cellColorForMinutes(stepMinutes ?? 0)}">
                  {formatLabTime(stepMinutes)}
                </td>
              {/each}
              <td class="py-3 px-4 text-right font-mono font-semibold" style="background-color: {cellColorForMinutes(medianRow.totalMinutes ?? 0)}">
                {formatLabTime(medianRow.totalMinutes)}
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </section>
{/if}
