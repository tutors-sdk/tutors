<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { LiveStudentFeedSheet } from "./sheets/next-analytics/live-student-feed";
  export let userMap: Map<string, StudentRecord>;
  export let courseName: string;

  let liveStudentFeedSheet: LiveStudentFeedSheet | null;

  onMount(() => {
    liveStudentFeedSheet = new LiveStudentFeedSheet(Array.from(userMap.values()), courseName);
    liveStudentFeedSheet.renderCharts();
  });

  onDestroy(() => {
    if (liveStudentFeedSheet) {
      liveStudentFeedSheet = null;
    }
  });

  const renderCharts = () => {
    if (liveStudentFeedSheet) {
      liveStudentFeedSheet.renderCharts();
    }
  };

  window.addEventListener("focus", renderCharts);
</script>

<div class="h-screen">
  <div id="loadingIndicator" style="display: none;">Loading...</div>
  <div id="heatmap-container" style="height: 50%; width:100%; overflow-y: scroll;"></div>
</div>
