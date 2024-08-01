<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { LabBoxPlotChart } from "../analytics/lab-box-plot";
  import type { Course } from "$lib/services/models/lo-types";
    import { lab } from "d3";

  export let course: Course;
  export let userIds: string[];
  export let userNamesUseridsMap: Map<string, string>;

  let labBoxPlot: LabBoxPlotChart | null = null;

  const renderCharts = () => {
    if (labBoxPlot !== null) {
  labBoxPlot.prepareBoxplotData().then(({ boxplotData, userNicknames }) => {
    labBoxPlot?.renderBoxPlot(document.getElementById("heatmap-container"), boxplotData, userNicknames);
    labBoxPlot?.prepareCombinedBoxplotData().then(combinedBoxplotData => {
      labBoxPlot?.renderCombinedBoxplotChart(document.getElementById("combinedBoxPlot"), combinedBoxplotData);
    });
  });
}
  };

  const handleFocus = () => {
    renderCharts();
  };

  onMount(() => {
    labBoxPlot = new LabBoxPlotChart(course, userIds, userNamesUseridsMap);
    renderCharts();
    window.addEventListener("focus", handleFocus);
  });

  onDestroy(() => {
    if (labBoxPlot) {
      labBoxPlot = null;
    }
    window.removeEventListener("focus", handleFocus);
  });
</script>

<div class="h-screen">
  <div id="heatmap-container" style="height: 50%; width:100%; overflow-y: scroll;"></div>
  <div id="combinedBoxPlot" style="height: 50%; width:100%; overflow-y: scroll;"></div>
</div>
