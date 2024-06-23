import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import type { Course, Lo } from "$lib/services/models/lo-types";
import { backgroundPattern, textureBackground } from "../charts/tutors-charts-background-url";
import type { Session } from "@supabase/supabase-js";
import { filterByType } from "$lib/services/models/lo-utils";
import type { EChartsOption } from "echarts";
import { piechart } from "../charts/piechart";
import type { LabStepData, OuterPieData } from "$lib/services/types/supabase-metrics";

echarts.use([TooltipComponent, LegendComponent, PieChart, BarChart, GridComponent, CanvasRenderer, LabelLayout]);

let option: EChartsOption;

const bgTexture = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTexture;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class LabPieChart {
  myChart: any;
  labs: string[];
  course: Course;
  session: Session;
  totalTimesMap: Map<string, LabStepData[]>;
  labTitleTimesMap: Map<string, number>;

  constructor(course: Course, session: Session) {
    this.myChart = null;
    this.labs = [];
    this.course = course;
    this.session = session;
    this.labTitleTimesMap = new Map();
    this.totalTimesMap = new Map();
  }

  singleUserPieClick() {
    if (this.myChart !== null) {
      // Remove any existing click listeners to prevent multiple handlers
      this.myChart.off("click");
      this.myChart.on("click", (params: { seriesName: string; name: string }) => {
        if (params.seriesName === "Inner Pie") {
          const outerPieData: OuterPieData[] = []; // Reset outerPieData array

          // Find the corresponding data for the clicked inner pie slice
          this.totalTimesMap.forEach((steps, topicTitle) => {
            if (topicTitle === params.name) {
              steps.forEach((step) => {
                if (step.aggregatedTimeActive !== 0) {
                  outerPieData.push({ value: step.aggregatedTimeActive, name: step.title, type: step.loType });
                }
              });
            }
          });
          this.populateOuterPieData(outerPieData);
        }
      });
    }
  }

  populateOuterPieData(outerPieData: OuterPieData[]) {
    // Update the data for the outer pie chart
    const chartInstance = echarts.getInstanceByDom(document.getElementById("chart"));
    if (chartInstance) {
      chartInstance.setOption({
        series: [
          {
            name: "Outer Pie",
            data: outerPieData
          }
        ]
      });
    }
  }

  renderChart() {
    if (!this.myChart) {
      // Create a new chart instance if it doesn't exist
      this.myChart = echarts.init(document.getElementById("chart"));
    } else {
      // Clear the previous chart to prevent aggregation issues
      this.myChart.clear();
    }

    this.labTitleTimesMap.clear();
    this.totalTimesMap.clear();

    let labs = filterByType(this.course.los, "lab");
    let steps = filterByType(this.course.los, "step");

    const allLabSteps = [...labs, ...steps];

    const updateMaps = (lo: Lo, timeActive: number) => {
      let topicTitle = lo.type === "lab" ? lo.title : lo.parentLo!.title;
      let loTitle = lo.title;

      // Add timeActive to the total time for the topic
      if (this.labTitleTimesMap.has(topicTitle)) {
        this.labTitleTimesMap.set(topicTitle, this.labTitleTimesMap.get(topicTitle)! + timeActive);
      } else {
        this.labTitleTimesMap.set(topicTitle, timeActive);
      }

      if (!this.totalTimesMap.has(topicTitle)) {
        this.totalTimesMap.set(topicTitle, []);
      }

      const existingEntries = this.totalTimesMap.get(topicTitle)!;
      const existingEntry = existingEntries.find((entry) => entry.title === loTitle);

      if (existingEntry) {
        existingEntry.aggregatedTimeActive += timeActive;
      } else {
        existingEntries.push({ aggregatedTimeActive: timeActive, title: loTitle, loType: lo.type });
      }
    };

    allLabSteps.forEach((lo) => {
      const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;
      updateMaps(lo, timeActive);
    });

    const singleUserInnerData = Array.from(this.labTitleTimesMap.entries()).map(([title, timeActive]) => ({
      name: title,
      value: timeActive
    }));

    const singleUserOuterData: OuterPieData[] = [];
    this.totalTimesMap.forEach((steps, topicTitle) => {
      steps.forEach((step) => {
        singleUserOuterData.push({
          name: step.title,
          value: step.aggregatedTimeActive,
          type: step.loType
        });
      });
    });

    const option = piechart(bgPatternImg, this.course, [], singleUserInnerData, singleUserOuterData);
    this.myChart.setOption(option);
    this.singleUserPieClick();
  }
}
