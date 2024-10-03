import * as echarts from "echarts/core";
import { TooltipComponent, GridComponent, VisualMapComponent } from "echarts/components";
import { HeatmapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { backgroundPattern } from "../../charts/tutors-charts-background-url";
import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";
import type { HeatMapSeriesData, HeatMapChartConfig } from "$lib/services/types/supabase-metrics";
import { heatmap, renderCombinedChart } from "../../charts/heatmap-chart";

echarts.use([TooltipComponent, GridComponent, VisualMapComponent, HeatmapChart, CanvasRenderer]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class BaseHeatMapChart<T> {
  chartRendered = false;
  chartInstances: Map<echarts.ECharts, echarts.ECharts>;
  course: Course;
  session: Session;
  userIds: string[];
  userAvatarsUseridsMap: Map<string, [string, string]>;
  chartInstance: echarts.ECharts | null = null;
  categories: Set<string> = new Set();
  yAxisData: string[] = [];
  series: HeatMapSeriesData = {
    top: "",
    name: "",
    data: [],
    type: "heatmap",
    selectedMode: "single",
    label: {
      show: true
    }
  };
  multipleUsers: boolean;

  constructor(course: Course, session: Session, userIds: string[], userAvatarsUseridsMap: Map<string, [string, string]>, multipleUsers: boolean) {
    this.chartInstances = new Map();
    this.course = course;
    this.session = session;
    this.userIds = userIds;
    this.userAvatarsUseridsMap = userAvatarsUseridsMap;
    this.multipleUsers = multipleUsers;
  }

  initChart() {
    if (!this.chartInstance) {
      // Create a new chart instance if it doesn't exist
      this.chartInstance = echarts.init(document.getElementById("chart"));
    } else {
      // Clear the previous chart to prevent aggregation issues
      this.chartInstance.clear();
    }
  }

  getChartContainer() {
    const container = document.getElementById("heatmap-container");
    return container;
  }

  getCombinedChartContainer() {
    const container = document.getElementById("combined-heatmap");
    return container;
  }

  async getUserFullName(userId: string) {
    return this.userAvatarsUseridsMap.get(userId) || userId;
  }

  async populatePerUserSeriesData(allItems: Lo[], userId: string, index: number, learninObjValue: string): Promise<number[][]> {
    const totalTimesMap = new Map<string, number>();
    const titleList: string[] = [];
    let totalTimeActive = 0; // Variable to store the total time

    // Recursive function to find the topmost parentLo of type 'topic', skipping hidden items
    const getTopTopicParentLo = (lo: Lo): Lo | null => {
      if (lo.hide) return null; // Skip hidden items
      if (lo.type === "topic") return lo; // Return the Lo if it's of type 'topic'
      if (lo.parentLo) return getTopTopicParentLo(lo.parentLo); // Recursively traverse up the hierarchy
      return null; // If no parentLo or no topic found, return null
    };

    allItems.forEach((item) => {
      if (item.hide) return; // Skip hidden items
      let title: string = "";

      if (learninObjValue === "lab") {
        if (item.parentLo?.type === "lab") {
          if (item.hide || item.parentLo.hide) return; // Skip if either the item or its parent is hidden
          title = item.parentLo.title;
        } else {
          title = item.title;
        }
      } else {
        const topTopicLo = getTopTopicParentLo(item);
        if (!topTopicLo || topTopicLo.hide) return; // Skip if no topic parent is found or if it's hidden
        title = topTopicLo.title;
      }

      const timeActive = item.learningRecords?.get(userId)?.timeActive || 0;

      // Accumulate total time for this user
      totalTimeActive += timeActive;

      if (totalTimesMap.has(title)) {
        totalTimesMap.set(title, totalTimesMap.get(title)! + timeActive);
      } else {
        totalTimesMap.set(title, timeActive);
        titleList.push(title.trim());
      }
    });

    // Add "Total" as a category
    this.categories = new Set(["Total", ...Array.from(totalTimesMap.keys())]);

    const categoriesArray = Array.from(this.categories);

    // Construct series data with the total time included
    const seriesData: number[][] = Array.from(totalTimesMap.entries()).map(([title, timeActive]) => {
      return [categoriesArray.indexOf(title), index, Math.floor(timeActive / 2)];
    });

    // Add the total time for this user in the "Total" column
    seriesData.push([categoriesArray.indexOf("Total"), index, Math.floor(totalTimeActive / 2)]);

    return seriesData;
  }

  async populateAndRenderUsersData(allItems: Lo[], userIds: string[], learninObjValue: string) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData: number[][] = [];
    const yAxisData: string[] = [];

    for (const [index, userId] of userIds.entries()) {
      const seriesData = await this.populatePerUserSeriesData(allItems, userId, index, learninObjValue);
      allSeriesData = allSeriesData.concat(seriesData);
      const [fullname] = this.userAvatarsUseridsMap?.get(userId) || [undefined, undefined];

      //const fullName = await this.getUserFullName(userId);
      yAxisData.push(fullname ?? userId);
    }

    this.series = {
      name: `student engagement for ${learninObjValue}`,
      type: "heatmap",
      data: allSeriesData,
      selectedMode: "single",
      top: "2%",
      label: {
        show: true
      }
    };

    this.yAxisData = yAxisData;
    this.renderChart(container, "");
  }

  async populateAndRenderSingleUserData(session: Session, allItems: Lo[], learninObjValue: string) {
    const container = this.getChartContainer();
    if (!container) return;

    const userId = session.user.user_metadata.full_name ?? session.user.user_metadata.user_name;
    this.yAxisData = [userId];

    const seriesData: number[][] = await this.populatePerUserSeriesData(allItems, session.user.user_metadata.user_name, 0, learninObjValue);
    this.series = {
      top: "5%",
      name: `${learninObjValue.valueOf()} Activity`,
      type: "heatmap",
      data: seriesData,
      selectedMode: "single",
      label: {
        show: true
      }
    };

    this.renderChart(container, "");
  }

  renderChart(container: HTMLElement, title: string) {
    this.chartInstance = echarts.init(container);
    const option: HeatMapChartConfig = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, title);
    this.chartInstance.setOption(option);
    this.chartInstance.resize();
    this.sortHeatMapValues();
  }

  prepareCombinedTopicData(allTypes: Lo[], userIds: string[], getTitle: (lo: Lo) => string | undefined) {
    const loActivities = new Map();
    const container = this.getCombinedChartContainer();
    if (!container) return undefined;

    // Recursive function to find the topmost parentLo of type 'topic', skipping hidden items
    const getTopTopicParentLo = (lo: Lo): Lo | null => {
      if (lo.hide) return null;
      if (lo.type === "topic") return lo;
      if (lo.parentLo) return getTopTopicParentLo(lo.parentLo);
      return null;
    };

    allTypes.forEach((lo) => {
      if (lo.hide) return; // Skip if the LO itself is hidden

      // For all types, traverse to the top parent of type 'topic', skipping hidden ones
      const topTopicLo = getTopTopicParentLo(lo);
      if (!topTopicLo || topTopicLo.hide) return; // Skip if no topic parent or it's hidden
      const title = topTopicLo.title;

      if (!loActivities.has(title)) {
        loActivities.set(title, []);
      }

      lo.learningRecords?.forEach((topic, userId) => {
        if (userIds.includes(userId)) {
          loActivities.get(title).push({
            timeActive: topic.timeActive,
            nickname: userId
          });
        }
      });
    });

    const heatmapData = Array.from(loActivities.entries()).map(([title, activities]) => {
      activities.sort((a: { timeActive: number }, b: { timeActive: number }) => a.timeActive - b.timeActive);

      const addedCount = activities.reduce((acc: number, curr: { timeActive: any }) => acc + curr.timeActive, 0);

      const lowData = activities[0];
      const highData = activities[activities.length - 1];

      return {
        value: addedCount,
        title: title,
        lowValue: lowData?.timeActive || 0,
        highValue: highData?.timeActive || 0,
        lowNickname: lowData?.nickname || "No Interaction",
        highNickname: highData?.nickname || "No Interaction"
      };
    });
    this.renderCombinedTopicChart(container, heatmapData, "Aggregated Time");
  }

  renderCombinedTopicChart(container: HTMLElement, heatmapData: any[], title: string) {
    const chartInstance = echarts.init(container);
    const option = renderCombinedChart(heatmapData, bgPatternImg, title);
    chartInstance.setOption(option, true);
    chartInstance.resize();
    this.sortHeatMapValues();
  }

  async sortHeatMapValues() {
    if (this.chartInstance !== null) {
      this.chartInstance.off("click");
      this.chartInstance.on("click", async (params: { componentType: string; seriesType: string; value: any[] }) => {
        if (params.componentType === "series" && params.seriesType === "heatmap") {
          const colIndex = params.value[0]; // Column index of the clicked cell
          // Extract the data for the clicked column
          let columnData = this.series.data.filter((item: any[]) => item[0] === colIndex);
          // Sort the column data by the value (timeActive) in ascending order
          columnData.sort((a: number[], b: number[]) => a[2] - b[2]);
          // Reorder yAxisData based on sorted column data
          const sortedUserIndices = columnData.map((item: any[]) => item[1]);
          const sortedYAxisData = sortedUserIndices.map((index: string | number) => this.yAxisData[index]);
          // Reconstruct the series data with sorted y-axis order
          let newData = this.series.data.map((item: any[]) => {
            const newIndex = sortedUserIndices.indexOf(item[1]);
            return [item[0], newIndex, item[2]];
          });
          // Update the y-axis data and series data
          this.yAxisData = sortedYAxisData;
          this.series.data = newData;
          // Refresh the chart instance
          this.chartInstance?.setOption({
            yAxis: {
              data: this.yAxisData
            },
            series: [
              {
                data: this.series.data
              }
            ]
          });
        }
      });
    }
  }
}
