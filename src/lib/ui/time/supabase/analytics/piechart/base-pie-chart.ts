import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import type { Course, Lo } from "$lib/services/models/lo-types";
import { backgroundPattern, textureBackground } from "../../charts/tutors-charts-background-url";
import type { Session } from "@supabase/supabase-js";
import type { DrilledDownData } from "$lib/services/types/supabase-metrics";

echarts.use([TooltipComponent, LegendComponent, PieChart, BarChart, GridComponent, CanvasRenderer, LabelLayout]);

const bgTexture = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTexture;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class BasePieChart<T> {
  myChart: any;
  course: Course;
  session: Session;
  totalTimesMap: Map<string, DrilledDownData[]>;
  titleTimesMap: Map<string, T>;

  constructor(course: Course, session: Session) {
    this.myChart = null;
    this.course = course;
    this.session = session;
    this.titleTimesMap = new Map();
    this.totalTimesMap = new Map();
  }

  initChart() {
    if (!this.myChart) {
      // Create a new chart instance if it doesn't exist
      this.myChart = echarts.init(document.getElementById("chart"));
    } else {
      // Clear the previous chart to prevent aggregation issues
      this.myChart.clear();
    }
  }

  handlePieClick() {
    if (this.myChart !== null) {
      // Remove any existing click listeners to prevent multiple handlers
      this.myChart.off("click");
      this.myChart.on("click", (params: { seriesName: string; name: string }) => {
        if (params.seriesName === "Inner Pie") {
          const outerPieData: DrilledDownData[] = []; // Reset outerPieData array

          // Find the corresponding data for the clicked inner pie slice
          this.totalTimesMap.forEach((steps, title) => {
            if (title === params.name) {
              steps.forEach((step) => {
                if (step.value !== 0) {
                  outerPieData.push({ value: Math.round(step.value / 2), name: step.name, type: step.type });
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

  updateMaps(lo: Lo, timeActive: number, getTitle: (lo: Lo) => string | null) {
    const title = getTitle(lo);
    const loTitle = lo.title;

    if (!title) {
      return;
    }

    // Add timeActive to the total time for the title
    if (this.titleTimesMap.has(title)) {
      // Update the total time for the title
      this.titleTimesMap.set(title, ((this.titleTimesMap.get(title)! as number) + timeActive) as unknown as T);
    } else {
      this.titleTimesMap.set(title, timeActive as unknown as T);
    }

    // Initialize totalTimesMap for the title if it doesn't exist
    if (!this.totalTimesMap.has(title)) {
      this.totalTimesMap.set(title, []);
    }

    const existingEntries = this.totalTimesMap.get(title)!;
    const existingEntry = existingEntries.find((entry) => entry.name === loTitle);

    // Update or add the timeActive for this particular LO
    if (existingEntry) {
      existingEntry.value += timeActive;
    } else {
      existingEntries.push({ value: timeActive, name: loTitle, type: lo.type });
    }
  }

  renderChart() {
    this.initChart();
    this.handlePieClick();
  }

  setOption(option: any) {
    if (this.myChart) {
      this.myChart.setOption(option);
    }
  }
}
