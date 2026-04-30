<script lang="ts">
  import { TutorsTime, type LearningRecord, type TutorsTimeCourse } from "@tutors/tutors-time-lib";
  import { LoRecord, presenceService } from "$lib/services/community";
  import CourseGroupHeader from "$lib/ui/time/CourseGroupHeader.svelte";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";
    import { currentCourse } from "$lib/runes.svelte";
    import type { Course } from "@tutors/tutors-model-lib";

  interface Props {
    data: { courseid: string, course: Course };
  }
  let { data }: Props = $props();

  function localYyyyMmDd(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function recordLocalYmd(dateLastAccessed: string | null): string | null {
    if (!dateLastAccessed) return null;
    try {
      const date = new Date(dateLastAccessed);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return null;
    }
  }

  /** Epoch ms from full `date_last_accessed` (date and time). Invalid / missing → sort as oldest. */
  function recordAccessInstantMs(dateLastAccessed: string | null): number {
    if (!dateLastAccessed?.trim()) return Number.NEGATIVE_INFINITY;
    const t = Date.parse(dateLastAccessed.trim());
    return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY;
  }

  function learningRecordToLoEvent(
    r: LearningRecord,
    courseId: string,
    courseTitle: string
  ): LoRecord {
    const displayName = r.full_name?.trim() || r.student_id;
    const loId = r.lo_id?.trim() || "";
    const segments = loId.split("/").filter(Boolean);
    const titleFromLo = segments.length ? segments[segments.length - 1]! : "Activity";
    const loRoute = loId.startsWith("http")
      ? loId
      : loId
        ? `/${courseId.replace(/^\//, "")}/${loId.replace(/^\//, "")}`
        : `/${courseId.replace(/^\//, "")}`;

    return new LoRecord({
      courseId: courseId.replace(/^\//, ""),
      courseUrl: courseId.replace(/^\//, ""),
      courseTitle,
      loRoute,
      title: titleFromLo,
      type: (r.type ?? "lab").trim() || "lab",
      user: {
        id: r.student_id,
        fullName: displayName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=128&background=random`,
        sentiment: "neutral",
      },
    });
  }

  let courseTime = $state<TutorsTimeCourse | null>(null);
  let courseTimeError = $state<string | null>(null);

  const earlierTodayLos = $derived.by(() => {
    const ct = courseTime;
    const courseId = data.courseid?.trim();
    if (!ct || !courseId) return [];
    const today = localYyyyMmDd();
    const rows = ct.learningRecords.filter((r) => recordLocalYmd(r.date_last_accessed) === today);
    const sorted = [...rows].sort((a, b) => {
      const tb = recordAccessInstantMs(b.date_last_accessed);
      const ta = recordAccessInstantMs(a.date_last_accessed);
      return tb - ta;
    });
    const seen = new Set<string>();
    const latestPerStudent: LearningRecord[] = [];
    for (const r of sorted) {
      const sid = r.student_id?.trim() || "";
      if (!sid) continue;
      if (seen.has(sid)) continue;
      seen.add(sid);
      latestPerStudent.push(r);
    }
    const los = latestPerStudent.map((r) => learningRecordToLoEvent(r, courseId, ct.title));
    console.log(los);
    los.forEach(l => {
      // console.log(l.user?.fullName);
      if (data.course) {
        const loindex = data.course.loIndex;
        const route =
          "/" +
          l.loRoute
            .replace(/^\//, "")
            .split("/")
            .filter(Boolean)
            .slice(1)
            .join("/");
        const lo = loindex.get(route);
        console.log(lo);
      }
    });
    return los
  });

  $effect(() => {
    const courseId = data.courseid?.trim();
    if (!courseId) return;
    if (presenceService.listeningTo !== courseId) {
      presenceService.startPresenceListener(courseId);
    }
  });

  $effect(() => {
    const courseId = data.courseid?.trim();
    if (!courseId) return;

    const today = localYyyyMmDd();
    let cancelled = false;
    courseTime = null;
    courseTimeError = null;

    void (async () => {
      try {
        const ct = await TutorsTime.loadCourseTime(courseId, today, today);
        if (cancelled) return;
        courseTime = ct;
      } catch (e) {
        if (cancelled) return;
        courseTimeError = e instanceof Error ? e.message : "Failed to load TutorsTime data";
        console.error(e);
      }
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
    <h2 class="border-surface-300-600-token mb-3 border-b pb-2 text-lg font-semibold">Earlier today</h2>
    {#if courseTimeError}
      <p class="text-error-500 text-sm">{courseTimeError}</p>
    {:else if !courseTime}
      <p class="text-surface-600-300-token text-sm">Loading TutorsTime…</p>
    {:else if earlierTodayLos.length === 0}
      <p class="text-surface-600-300-token text-sm">No lab activity recorded for today in TutorsTime yet.</p>
    {:else}
      <div class="flex flex-wrap justify-center">
        {#each earlierTodayLos as lo}
          <StudentCard
            {lo}
            cardLayout={{
              layout: "expanded",
              style: "landscape",
            }}
          />
        {/each}
      </div>
    {/if}
  </section>
</div>
