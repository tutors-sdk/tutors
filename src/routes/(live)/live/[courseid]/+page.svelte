<script lang="ts">
  import { onMount } from "svelte";
  import { LoRecord, presenceService } from "$lib/services/community";
  import type { TutorsConnectLatestRow } from "$lib/services/community/types.svelte";
  import {
    getTutorsConnectLatestLosByCourseId,
    isReceivedAtInLocalMonth,
    isReceivedAtInLocalWeek,
    isReceivedAtInLocalYear,
    isReceivedAtOnLocalDay
  } from "$lib/services/community/utils/supabase-client";
  import ConnectLatestLosCards from "$lib/ui/time/ConnectLatestLosCards.svelte";
  import CourseGroupHeader from "$lib/ui/time/CourseGroupHeader.svelte";
  import { Tabs } from "@skeletonlabs/skeleton-svelte";
  import type { Course } from "@tutors/tutors-model-lib";
  import { t } from "$lib/services/i18n";

  interface Props {
    data: { courseid: string; course: Course };
  }
  let { data }: Props = $props();

  let connectRows = $state<TutorsConnectLatestRow[]>([]);

  function toVisibleLos(rows: TutorsConnectLatestRow[]): LoRecord[] {
    return rows.map((r) => new LoRecord(r.payload)).filter((lo) => lo?.user?.fullName !== "Anon");
  }

  const losThisDay = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(connectRows.filter((r) => isReceivedAtOnLocalDay(r.received_at, ref)));
  });

  const losThisWeek = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(connectRows.filter((r) => isReceivedAtInLocalWeek(r.received_at, ref) && !isReceivedAtOnLocalDay(r.received_at, ref)));
  });

  const losThisMonth = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(connectRows.filter((r) => isReceivedAtInLocalMonth(r.received_at, ref) && !isReceivedAtInLocalWeek(r.received_at, ref)));
  });

  const losThisYear = $derived.by(() => {
    const ref = new Date();
    return toVisibleLos(connectRows.filter((r) => isReceivedAtInLocalYear(r.received_at, ref) && !isReceivedAtInLocalMonth(r.received_at, ref)));
  });

  const studentsOnlineVisible = $derived(presenceService.studentsOnline.value.filter((lo) => lo?.user?.fullName !== "Anon"));

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
  <section class="bg-surface-100-800-token border-surface-200-700-token w-full min-w-0 overflow-hidden p-4">
    <div class="flex flex-wrap justify-center">
      <div class="border-surface-300-600-token mb-2 w-full">
        <CourseGroupHeader courseId={data.course.courseId!} courseTitle={data.course.title!} />
      </div>
      <h2 class="border-surface-300-600-token mb-3 w-full border-b pb-2 text-lg font-semibold">{t("live.onlineNow")}</h2>
      <ConnectLatestLosCards
        los={studentsOnlineVisible}
        emptyMessage={t("live.emptyOnline")}
      />
    </div>
  </section>

  <section
    class="bg-surface-100-800-token border-surface-200-700-token w-full min-w-0 overflow-hidden p-4">
    <h2 class="border-surface-300-600-token mb-3 border-b pb-2 text-lg font-semibold">{t("live.latestActivity")}</h2>
    <Tabs defaultValue="Day">
      <Tabs.List>
        <Tabs.Trigger value="Day">{t("live.today")}</Tabs.Trigger>
        <Tabs.Trigger value="Week">{t("live.thisWeek")}</Tabs.Trigger>
        <Tabs.Trigger value="Month">{t("live.thisMonth")}</Tabs.Trigger>
        <Tabs.Trigger value="Year">{t("live.thisYear")}</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="Day">
        <ConnectLatestLosCards
          los={losThisDay}
          emptyMessage={t("live.emptyToday")}
        />
      </Tabs.Content>
      <Tabs.Content value="Week">
        <ConnectLatestLosCards
          los={losThisWeek}
          emptyMessage={t("live.emptyWeek")}
        />
      </Tabs.Content>
      <Tabs.Content value="Month">
        <ConnectLatestLosCards
          los={losThisMonth}
          emptyMessage={t("live.emptyMonth")}
        />
      </Tabs.Content>
      <Tabs.Content value="Year">
        <ConnectLatestLosCards
          los={losThisYear}
          emptyMessage={t("live.emptyYear")}
        />
      </Tabs.Content>
    </Tabs>
  </section>
</div>
