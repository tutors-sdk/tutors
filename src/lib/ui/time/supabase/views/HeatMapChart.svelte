<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { LabHeatMapChart } from "../analytics/heatmap/lab-heat-map-chart";
  import { TopicHeatMapChart } from "../analytics/heatmap/topic-heat-map-chart";
  import type { Course } from "$lib/services/models/lo-types";
  import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[] = [];
  export let userNamesAvatars: Map<string, [string, string]> = new Map();
  export let multipleUsers: boolean = false;
  export let chartType: "LabHeatMap" | "TopicHeatMap";

  let chartInstance: LabHeatMapChart | TopicHeatMapChart | null = null;
  let numOfCategories: number = 0;
  onMount(async () => {
    // Initialise the appropriate heatmap chart based on chartType
    if (chartType === "LabHeatMap") {
      numOfCategories = course.wallMap?.get("lab")?.length || 0;

      chartInstance = new LabHeatMapChart(course, session, userIds, userNamesAvatars, multipleUsers);
    } else if (chartType === "TopicHeatMap") {
      numOfCategories = course.topicIndex.size;

      chartInstance = new TopicHeatMapChart(course, session, userIds, userNamesAvatars, multipleUsers);
    } else {
      throw new Error(`Invalid chart type: ${chartType}`);
    }
    if (multipleUsers) {
      //combined
      const element = document.getElementById("combined-heatmap");
      if (!element) {
        throw new Error("Element with ID 'combined-heatmap' not found");
      }
    }
    chartInstance.populateAndRenderData();
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance = null;
    }
  });

  window.addEventListener("focus", () => {
    if (chartInstance) {
      const container = document.getElementById("heatmap-container");
      chartInstance.renderChart(container!);
    }
  });

  numOfCategories = chartType === "LabHeatMap" 
  ? course.wallMap?.get("lab")?.length || 0 
  : Array.from(course.topicIndex.values()).filter(topic => !topic.hide).length;  
  
  let innerDivWidth = numOfCategories * 15; // The width for the inner div
  let innerDivHeight = userIds.length * 45; // The height based on user count
</script>

<!-- Scrollable container -->
{#if multipleUsers}
  <div class="scrollable-container">
    <!-- Inner content that exceeds the height of the scrollable container -->
    <div class="inner-content" style="height: {innerDivHeight}px; width: {innerDivWidth}%;">
      <!-- Heatmap containers -->
      <div id="heatmap-container" class="heatmap"></div>
      <div id="combined-heatmap" class="combined-heatmap"></div>
    </div>
  </div>
{:else}
  <div class="large-container">
    <!-- For single users: one container with full height -->
    <div id="heatmap-container" class="heatmap-single"></div>
  </div>
{/if}

<style>
  /* Outer scrollable container */
  .scrollable-container {
    height: 100%; /* Adjust this value based on the height you want */
    max-width: 100%; /* Full width */
    overflow: auto; /* Enable both vertical and horizontal scrolling */
    border: 1px solid #ccc; 
    padding: 10px;
  }

  /* Inner content that may overflow the outer container */
  .inner-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: auto;
    height: auto;
    min-width: 100vw; /* Set a minimum width */

  }

  /* Individual heatmap styling */
  .heatmap {
    height: 75%; /* 75% of the inner-content height */
    width: 100%; /* Full width of the inner-content */
    min-height: 300px; /* Set a minimum height */

  }

  .combined-heatmap {
    height: 25%; /* 25% of the inner-content height */
    width: 100%; /* Full width of the inner-content */
    min-height: 100px; /* Set a minimum height */
  }

  /* Single-user view container */
  .large-container {
    height: 100vh; /* Full viewport height */
    width: 100%; /* Full width */
    border: 1px solid #ccc; 
    padding: 1px;
  }

  /* Heatmap for single user */
  .heatmap-single {
    height: 100%; /* Full height for single heatmap */
    width: 100%; /* Full width */
  }
</style>