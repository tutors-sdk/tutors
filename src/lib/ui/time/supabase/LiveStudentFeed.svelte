<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { LiveStudentFeedChart } from "./sheets/tutors-analytics/live-student-feed";
  export let userMap: Map<string, StudentRecord>;
  export let courseName: string;

  let liveStudentFeedChart: LiveStudentFeedChart | null;

  onMount(() => {
    liveStudentFeedChart = new LiveStudentFeedChart(Array.from(userMap.values()), courseName);
    liveStudentFeedChart.renderCharts();
  });

  onDestroy(() => {
    if (liveStudentFeedChart) {
      liveStudentFeedChart = null;
    }
  });

  const renderCharts = () => {
    if (liveStudentFeedChart) {
      liveStudentFeedChart.renderCharts();
    }
  };

  window.addEventListener("focus", renderCharts);
</script>

<div class="h-screen">
  <div id="loadingIndicator" style="display: none;">Loading...</div>
  <div id="heatmap-container" style="height: 50%; width:100%; overflow-y: scroll;"></div>
</div>
