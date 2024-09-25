import * as echarts from "echarts/core";
import * as d3 from "d3";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import { BoxplotChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { backgroundPattern } from "../charts/tutors-charts-background-url";
import { boxplot, combinedBoxplotChart } from "../charts/boxplot-chart";
import type { Course } from "$lib/services/models/lo-types";
import { filterByType } from "$lib/services/models/lo-utils";
import type { BoxplotChartConfig, BoxplotData } from "$lib/services/types/supabase-metrics";
import { generateStudent } from "../../../../../routes/(time)/simulate/generateStudent";
// import { getUser } from "$lib/services/utils/supabase-utils";

echarts.use([TitleComponent, TooltipComponent, GridComponent, BoxplotChart, CanvasRenderer]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class LabBoxPlotChart {
  course: Course;
  userIds: string[];
  userNamesUseridsMap: Map<string, [string, string]>;

  constructor(course: Course, userIds: string[], userNamesUseridsMap: Map<string, [string, string]>) {
    this.course = course;
    this.userIds = userIds;
    this.userNamesUseridsMap = userNamesUseridsMap;
  }

  async getName(): Promise<string> {
    return (await generateStudent()).fullName;
  }

  async prepareBoxplotData() {
    const boxplotData: number[][] = [];
    const userNicknames: string[] = [];
    const labs = filterByType(this.course.los, "lab");
    const steps = filterByType(this.course.los, "step");
    const allLabSteps = [...labs, ...steps];
    const userActivities = new Map<string, number[]>();

    allLabSteps.forEach((step) => {
      this.userIds.forEach((userId) => {
        const userActivity = step.learningRecords?.get(userId);

        if (userActivity && userActivity.timeActive != null) {
          if (userActivities.has(userId)) {
            userActivities.get(userId)?.push(userActivity.timeActive);
          } else {
            userActivities.set(userId, [userActivity.timeActive]);
          }
        }
      });
    });

    const userActivitiesPromises = Array.from(userActivities.entries()).map(async ([userId, activities]) => {
      if (activities.length > 0) {
        //const fullname = await this.getName(); //generate fake name
        //const fullname = (await getUser(userId)) || userId;
        //const fullname = this.userNamesUseridsMap.get(userId) || userId;
        const [fullname] = this.userNamesUseridsMap?.get(userId) || [undefined, undefined];

        activities.sort((a, b) => a - b);
        const min = d3.min(activities) ?? 0;
        const q1 = d3.quantile(activities, 0.25) ?? 0;
        const median = d3.median(activities) ?? 0;
        const q3 = d3.quantile(activities, 0.75) ?? 0;
        const max = d3.max(activities) ?? 0;
        boxplotData.push([min, q1, median, q3, max]);
        userNicknames.push(fullname ?? userId);
      }
    });

    await Promise.all(userActivitiesPromises);

    return { boxplotData, userNicknames };
  }

  async prepareCombinedBoxplotData(): Promise<BoxplotData[]> {
    const labs = filterByType(this.course.los, "lab");
    const steps = filterByType(this.course.los, "step");
    const allLabSteps = [...labs, ...steps];
    const labActivities = new Map<string, { timeActive: number; nickname: string }[]>();

    for (const lab of allLabSteps) {
      const title = lab.parentLo?.type === "lab" ? lab.parentLo?.title : lab.title;

      if (!labActivities.has(title)) {
        labActivities.set(title, []);
      }

      for (const [userId, labRecord] of lab.learningRecords || []) {
        if (this.userIds?.includes(userId) && labRecord.timeActive != null) {
          //const nickname = await this.getName(); //generate fake names
          //const nickname = (await getUser(userId)) || userId;
          const [fullname] = this.userNamesUseridsMap?.get(userId) || [undefined, undefined];

          //const nickname = this.userNamesUseridsMap.get(userId) || userId;
          labActivities.get(title)?.push({
            timeActive: labRecord.timeActive,
            nickname: fullname ?? userId
          });
        }
      }
    }

    const boxplotData: BoxplotData[] = [];

    for (const [title, activities] of labActivities) {
      const aggregatedActivities = new Map<string, number>();

      activities.forEach(({ nickname, timeActive }) => {
        if (aggregatedActivities.has(nickname)) {
          aggregatedActivities.set(nickname, aggregatedActivities.get(nickname)! + timeActive);
        } else {
          aggregatedActivities.set(nickname, timeActive);
        }
      });

      const aggregatedTimeActiveValues = Array.from(aggregatedActivities.entries());
      if (aggregatedTimeActiveValues.length > 0) {
        aggregatedTimeActiveValues.sort((a, b) => a[1] - b[1]);

        const timeActiveValues = aggregatedTimeActiveValues.map((a) => a[1]);
        const min = d3.min(timeActiveValues) ?? 0;
        const q1 = d3.quantile(timeActiveValues, 0.25) ?? 0;
        const median = d3.median(timeActiveValues) ?? 0;
        const q3 = d3.quantile(timeActiveValues, 0.75) ?? 0;
        const max = d3.max(timeActiveValues) ?? 0;

        const lowNickname = aggregatedTimeActiveValues[0][0];
        const highNickname = aggregatedTimeActiveValues[aggregatedTimeActiveValues.length - 1][0];

        boxplotData.push({
          value: [min, q1, median, q3, max],
          name: title,
          lowNickname: lowNickname,
          highNickname: highNickname
        });
      }
    }

    return boxplotData;
  }

  renderBoxPlot(container: HTMLElement | null | undefined, boxplotData: number[][], userNicknames: string[]) {
    if (!container) return;

    const chart = echarts.init(container);
    const option: BoxplotChartConfig = boxplot(bgPatternImg, userNicknames, boxplotData, "Lab Activity per Student Boxplot");
    chart.setOption(option);
  }

  renderCombinedBoxplotChart(container: HTMLElement | null | undefined, boxplotData: BoxplotData[]) {
    if (!container) return;

    const chartInstance = echarts.init(container);
    const option = combinedBoxplotChart(bgPatternImg, boxplotData, "Lab Activity (students) per Lab Boxplot");
    chartInstance.setOption(option);
  }
}
