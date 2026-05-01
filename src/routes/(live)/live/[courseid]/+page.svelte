<script lang="ts">
  import { onMount } from "svelte";
  import { LoRecord, presenceService } from "$lib/services/community";
  import { getTutorsConnectLatestLosByCourseId, instantLocalYmd, localYyyyMmDd } from "$lib/services/community/utils/supabase-client";
  import CourseGroupHeader from "$lib/ui/time/CourseGroupHeader.svelte";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";

  interface Props {
    data: { courseid: string };
  }
  let { data }: Props = $props();

  let earlierLos = $state<LoRecord[]>([]);

  onMount(() => {
    const courseid = data.courseid;
    if (!courseid) return;

    if (presenceService.listeningTo !== courseid) {
      presenceService.startPresenceListener(courseid);
    }

    let cancelled = false;
    void (async () => {
      const rows = await getTutorsConnectLatestLosByCourseId(courseid);
      if (cancelled) return;
      const today = localYyyyMmDd();
      earlierLos = rows
        .filter((r) => instantLocalYmd(r.received_at) === today)
        .map((r) => new LoRecord(r.payload))
        .filter((lo) => lo?.user?.fullName !== "Anon");
    })();

    return () => {
      cancelled = true;
    };
  });
</script>

<div class="flex flex-col gap-4 px-4 pb-4">
  <section
    class="bg-surface-100-800-token border-surface-200-700-token w-full overflow-hidden rounded-xl border p-4"
  >
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
    class="bg-surface-100-800-token border-surface-200-700-token w-full overflow-hidden rounded-xl border p-4"
  >
    <h2 class="border-surface-300-600-token mb-3 border-b pb-2 text-lg font-semibold">Active Earlier Today</h2>
    <div class="flex flex-wrap justify-center">
      {#each earlierLos as lo}
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
  </section>
</div>
