<script lang="ts">
  import { onMount } from "svelte";
  import { LoRecord, presenceService } from "$lib/services/community";
  import type { TutorsConnectLatestRow } from "$lib/services/community/types.svelte";
  import {
    getTutorsConnectLatestLosByCourseId,
    isReceivedAtInLocalMonth,
    isReceivedAtInLocalWeek,
    isReceivedAtInLocalYear,
    isReceivedAtOnLocalDay,
  } from "$lib/services/community/utils/supabase-client";
  import CourseGroupHeader from "$lib/ui/time/CourseGroupHeader.svelte";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";
  import { Tabs } from "@skeletonlabs/skeleton-svelte";

  interface Props {
    data: { courseid: string };
  }
  let { data }: Props = $props();

  let connectRows = $state<TutorsConnectLatestRow[]>([]);

  function toVisibleLos(rows: TutorsConnectLatestRow[]): LoRecord[] {
    return rows
      .map((r) => new LoRecord(r.payload))
      .filter((lo) => lo?.user?.fullName !== "Anon");
  }

  const losThisDay = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(connectRows.filter((r) => isReceivedAtOnLocalDay(r.received_at, ref)));
  });

  const losThisWeek = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(
      connectRows.filter(
        (r) =>
          isReceivedAtInLocalWeek(r.received_at, ref) && !isReceivedAtOnLocalDay(r.received_at, ref)
      )
    );
  });

  const losThisMonth = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(
      connectRows.filter(
        (r) =>
          isReceivedAtInLocalMonth(r.received_at, ref) && !isReceivedAtInLocalWeek(r.received_at, ref)
      )
    );
  });

  const losThisYear = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(
      connectRows.filter(
        (r) =>
          isReceivedAtInLocalYear(r.received_at, ref) &&
          !isReceivedAtInLocalMonth(r.received_at, ref)
      )
    );
  });

  onMount(async () => {
    const courseid = data.courseid;
    if (!courseid) return;

    if (presenceService.listeningTo !== courseid) {
      presenceService.startPresenceListener(courseid);
    }
    connectRows = await getTutorsConnectLatestLosByCourseId(courseid);
  });
</script>

<div class="flex w-full min-w-0 flex-col gap-4 pb-4">
  <section
     class="bg-surface-100-800-token border-surface-200-700-token w-full min-w-0 overflow-hidden  p-4">
   <div class="flex flex-wrap justify-center">
      <CourseGroupHeader course={presenceService.studentsOnline.value[0]!} />
      {#each presenceService.studentsOnline.value as lo}
        {#if lo?.user?.fullName !== "Anon"}
          <StudentCard
            {lo}
            cardLayout={{
              layout: "expanded",
              style: "landscape",
            }}
          />
        {/if}
      {/each}
    </div>
  </section>

  <section
    class="bg-surface-100-800-token border-surface-200-700-token w-full min-w-0 overflow-hidden p-4">
    <h2 class="border-surface-300-600-token mb-3 border-b pb-2 text-lg font-semibold">Latest activity</h2>
    <Tabs defaultValue="Day">
      <Tabs.List>
        <Tabs.Trigger value="Day">Today</Tabs.Trigger>
        <Tabs.Trigger value="Week">This Week</Tabs.Trigger>
        <Tabs.Trigger value="Month">This Month</Tabs.Trigger>
        <Tabs.Trigger value="Year">This Year</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="Day">
        <div class="flex flex-wrap justify-center pt-4">
          {#each losThisDay as lo}
            <StudentCard
              {lo}
              cardLayout={{
                layout: "expanded",
                style: "landscape",
              }}
            />
          {:else}
            <p class="text-surface-600-300-token text-sm">
              No saved activity today in tutors-connect-latest for this course yet.
            </p>
          {/each}
        </div>
      </Tabs.Content>
      <Tabs.Content value="Week">
        <div class="flex flex-wrap justify-center pt-4">
          {#each losThisWeek as lo}
            <StudentCard
              {lo}
              cardLayout={{
                layout: "expanded",
                style: "landscape",
              }}
            />
          {:else}
            <p class="text-surface-600-300-token text-sm">
              No activity earlier this week (outside today) in tutors-connect-latest for this course yet.
            </p>
          {/each}
        </div>
      </Tabs.Content>
      <Tabs.Content value="Month">
        <div class="flex flex-wrap justify-center pt-4">
          {#each losThisMonth as lo}
            <StudentCard
              {lo}
              cardLayout={{
                layout: "expanded",
                style: "landscape",
              }}
            />
          {:else}
            <p class="text-surface-600-300-token text-sm">
              No activity earlier this month (outside this week) in tutors-connect-latest for this course yet.
            </p>
          {/each}
        </div>
      </Tabs.Content>
      <Tabs.Content value="Year">
        <div class="flex flex-wrap justify-center pt-4">
          {#each losThisYear as lo}
            <StudentCard
              {lo}
              cardLayout={{
                layout: "expanded",
                style: "landscape",
              }}
            />
          {:else}
            <p class="text-surface-600-300-token text-sm">
              No activity earlier this year (outside this month) in tutors-connect-latest for this course yet.
            </p>
          {/each}
        </div>
      </Tabs.Content>
    </Tabs>
  </section>
</div>
