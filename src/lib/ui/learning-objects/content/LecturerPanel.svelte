<script lang="ts">
  import { currentCourse, isLecturer, contentLocks, tutorsId } from "$lib/runes.svelte";
  import { rbacService } from "$lib/services/rbac";
  import { getTutorsConnectLatestLosByCourseId, getLearningRecordsByCourse } from "$lib/services/community/utils/supabase-client";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { flattenLos } from "@tutors/tutors-model-lib";

  let activeTab = $state<"locks" | "enrollment" | "analytics">("locks");

  let learningRecords = $state<any[]>([]);
  let latestActivity = $state<any[]>([]);
  let analyticsLoaded = $state(false);

  async function loadAnalytics() {
    if (analyticsLoaded || !currentCourse.value) return;
    const courseId = currentCourse.value.courseId;
    const [records, latest] = await Promise.all([
      getLearningRecordsByCourse(courseId),
      getTutorsConnectLatestLosByCourseId(courseId)
    ]);
    learningRecords = records;
    latestActivity = latest;
    analyticsLoaded = true;
  }

  function getAllLockableLos() {
    if (!currentCourse.value) return [];
    const allLos = flattenLos(currentCourse.value.los);
    return allLos.filter((lo) => lo.type === "topic" || lo.type === "unit" || lo.type === "lab" || lo.type === "note" || lo.type === "talk" || lo.type === "tutorial");
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
</script>

{#if isLecturer.value && currentCourse.value}
  <div class="flex flex-col gap-4 p-2">
    <div class="flex gap-1 rounded-lg bg-surface-200 p-1 dark:bg-surface-700">
      <button
        class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {activeTab === 'locks' ? 'bg-surface-50 dark:bg-surface-800 shadow-sm' : 'hover:bg-surface-300 dark:hover:bg-surface-600'}"
        onclick={() => (activeTab = "locks")}
      >
        Locks
      </button>
      <button
        class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {activeTab === 'enrollment' ? 'bg-surface-50 dark:bg-surface-800 shadow-sm' : 'hover:bg-surface-300 dark:hover:bg-surface-600'}"
        onclick={() => (activeTab = "enrollment")}
      >
        Enrollment
      </button>
      <button
        class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {activeTab === 'analytics' ? 'bg-surface-50 dark:bg-surface-800 shadow-sm' : 'hover:bg-surface-300 dark:hover:bg-surface-600'}"
        onclick={() => {
          activeTab = "analytics";
          loadAnalytics();
        }}
      >
        Access
      </button>
    </div>

    {#if activeTab === "locks"}
      <div class="flex flex-col gap-1">
        {#each getAllLockableLos() as lo}
          <div class="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-surface-200 dark:hover:bg-surface-700">
            <div class="flex items-center gap-2 overflow-hidden">
              <Icon type={lo.type} height="18" />
              <span class="truncate text-sm">{lo.title}</span>
            </div>
            <button
              class="shrink-0 rounded-md p-1 transition-colors hover:bg-surface-300 dark:hover:bg-surface-600"
              onclick={() => rbacService.toggleLock(currentCourse.value!.courseId, lo.route, tutorsId.value!.login)}
            >
              <Icon type={contentLocks.value.get(lo.route) ? "lock" : "unlock"} height="18" />
            </button>
          </div>
        {/each}
      </div>
    {/if}

    {#if activeTab === "enrollment"}
      <div class="flex flex-col gap-3">
        {#if currentCourse.value.enrollment?.whitelist && currentCourse.value.enrollment.whitelist.length > 0}
          <div>
            <h4 class="text-surface-500 mb-2 text-sm font-medium">Allowlist ({currentCourse.value.enrollment.whitelist.length})</h4>
            <div class="flex flex-col gap-1">
              {#each currentCourse.value.enrollment.whitelist as login}
                <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm">
                  <Icon type="github" height="16" />
                  <span>{login}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        {#if currentCourse.value.enrollment?.students && currentCourse.value.enrollment.students.length > 0}
          <div>
            <h4 class="text-surface-500 mb-2 text-sm font-medium">Students ({currentCourse.value.enrollment.students.length})</h4>
            <div class="flex flex-col gap-1">
              {#each currentCourse.value.enrollment.students as student}
                <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm">
                  <span class="font-medium">{student.name}</span>
                  <span class="text-surface-400">({student.id})</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        {#if !currentCourse.value.enrollment?.whitelist?.length && !currentCourse.value.enrollment?.students?.length}
          <p class="text-surface-400 px-3 py-4 text-center text-sm">No enrollment data configured for this course.</p>
        {/if}
      </div>
    {/if}

    {#if activeTab === "analytics"}
      <div class="flex flex-col gap-3">
        {#if !analyticsLoaded}
          <p class="text-surface-400 px-3 py-4 text-center text-sm">Loading...</p>
        {:else}
          {#if latestActivity.length > 0}
            <div>
              <h4 class="text-surface-500 mb-2 text-sm font-medium">Recent Activity ({latestActivity.length})</h4>
              <div class="flex flex-col gap-1">
                {#each latestActivity as activity}
                  <div class="rounded-lg px-3 py-1.5 text-sm hover:bg-surface-200 dark:hover:bg-surface-700">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{activity.student_id}</span>
                      <span class="text-surface-400 text-xs">{formatDate(activity.received_at)}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          {#if learningRecords.length > 0}
            <div>
              <h4 class="text-surface-500 mb-2 text-sm font-medium">Learning Records ({learningRecords.length})</h4>
              <div class="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {#each learningRecords.slice(0, 50) as record}
                  <div class="rounded-lg px-3 py-1.5 text-sm hover:bg-surface-200 dark:hover:bg-surface-700">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{record.student_id}</span>
                      <span class="text-surface-400 text-xs">{record.type}</span>
                    </div>
                    <div class="text-surface-400 truncate text-xs">{record.lo_id}</div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          {#if latestActivity.length === 0 && learningRecords.length === 0}
            <p class="text-surface-400 px-3 py-4 text-center text-sm">No access data recorded yet.</p>
          {/if}
        {/if}
      </div>
    {/if}
  </div>
{/if}
