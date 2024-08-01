import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import type { Course, Lo } from "$lib/services/models/lo-types";
import { backgroundPattern, textureBackground } from "../charts/tutors-charts-background-url";
import type { Session } from "@supabase/supabase-js";
import { filterByType } from "$lib/services/models/lo-utils";
import { piechart } from "../charts/piechart";
import type { DrilledDownData } from "$lib/services/types/supabase-metrics";

echarts.use([TooltipComponent, LegendComponent, PieChart, BarChart, GridComponent, CanvasRenderer, LabelLayout]);

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
  totalTimesMap: Map<string, DrilledDownData[]>;
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
          const outerPieData: DrilledDownData[] = []; // Reset outerPieData array

          // Find the corresponding data for the clicked inner pie slice
          this.totalTimesMap.forEach((steps, topicTitle) => {
            if (topicTitle === params.name) {
              steps.forEach((step) => {
                if (step.value !== 0) {
                  outerPieData.push({ value: step.value, name: step.name, type: step.type });
                }
              });
            }
          });
          this.populateOuterPieData(outerPieData);
        }
      });
    }
  }

  populateOuterPieData(outerPieData: DrilledDownData[]) {
    // Update the data for the outer pie chart
    const element = document.getElementById("chart");
    if (element) {
      const chartInstance = echarts.getInstanceByDom(element);
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
      const existingEntry = existingEntries.find((entry) => entry.name === loTitle);

      if (existingEntry) {
        existingEntry.value += timeActive;
      } else {
        existingEntries.push({ value: timeActive, name: loTitle, type: lo.type });
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

    const singleUserOuterData: DrilledDownData[] = [];
    this.totalTimesMap.forEach((steps, topicTitle) => {
      steps.forEach((step) => {
        if (step.type !== undefined) {
          singleUserOuterData.push({
            name: step.name,
            value: step.value,
            type: step.type
          });
        }
      });
    });

    const option = piechart(bgPatternImg, [], singleUserInnerData, singleUserOuterData);
    this.myChart.setOption(option);
    this.singleUserPieClick();
  }
}
