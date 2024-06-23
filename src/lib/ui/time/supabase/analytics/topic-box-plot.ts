import * as echarts from "echarts/core";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import { BoxplotChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { backgroundPattern } from "../charts/tutors-charts-background-url";
import { boxplot, combinedBoxplotChart } from "../charts/boxplot-chart";
import type { Course } from "$lib/services/models/lo-types";
import { getCompositeValues, getSimpleTypesValues, getUser } from "$lib/services/utils/supabase-utils";
import type { BoxplotData } from "$lib/services/types/supabase-metrics";
import * as d3 from "d3";
import { generateStudent } from "../../../../../routes/(time)/simulate/generateStudent";

echarts.use([TitleComponent, TooltipComponent, GridComponent, BoxplotChart, CanvasRenderer]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

function calculateBoxplotStats(values: number[]): [number, number, number, number, number] {
  if (values.length === 0) {
    return [0, 0, 0, 0, 0];
  }

  // Sort the array
  values.sort((a, b) => a - b);

  const min = d3.min(values) ?? 0;
  const q1 = d3.quantile(values, 0.25) ?? 0;
  const median = d3.median(values) ?? 0;
  const q3 = d3.quantile(values, 0.75) ?? 0;
  const max = d3.max(values) ?? 0;

  return [min, q1, median, q3, max];
}

export class TopicBoxPlotChart {
  course: Course;
  userIds: string[];

  constructor(course: Course, userIds: string[]) {
    this.course = course;
    this.userIds = userIds;
  }

  async getName(): Promise<string> {
    return (await generateStudent()).fullName;
  }

  async prepareBoxplotData() {
    const boxplotData: number[][] = [];
    const userNicknames: string[] = [];
    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];
    const userActivities = new Map<string, number[]>();

    allTypes.forEach((lo) => {
      lo.learningRecords?.forEach((record, userId) => {
        if (this.userIds.includes(userId)) {
          if (!userActivities.has(userId)) {
            userActivities.set(userId, []);
          }
          userActivities.get(userId)!.push(record.timeActive);
        }
      });
    });

    const userActivitiesPromises = Array.from(userActivities.entries()).map(async ([userId, activities]) => {
      if (activities.length > 0) {
        //const fullname = await this.getName(); //generate fakenames
        const fullname = (await getUser(userId)) || userId;
        const [min, q1, median, q3, max] = calculateBoxplotStats(activities);
        boxplotData.push([min, q1, median, q3, max]);
        userNicknames.push(fullname); // replace with userId when changing back
      }
    });

    await Promise.all(userActivitiesPromises);

    return { boxplotData, userNicknames };
  }

  async prepareCombinedBoxplotData(): Promise<BoxplotData[]> {
    const topicActivities = new Map<string, { timeActive: number; nickname: string }[]>();
    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    const promises = allTypes.map(async (lo) => {
      if (lo.learningRecords && lo.learningRecords.size !== 0) {
        let title = "";
        if (lo.parentTopic?.type === "topic") {
          title = lo.parentTopic?.title;
        } else if (lo.parentLo?.parentTopic?.type === "topic") {
          title = lo.parentLo?.parentTopic?.title;
        } else {
          title = lo.title;
        }

        if (!topicActivities.has(title)) {
          topicActivities.set(title, []);
        }

        const recordsPromises = Array.from(lo.learningRecords.entries()).map(async ([userId, record]) => {
          if (this.userIds.includes(userId)) {
            //const nickname = await this.getName(); //generate a fake name
            const nickname = (await getUser(userId)) || userId;
            topicActivities.get(title)!.push({
              timeActive: record.timeActive,
              nickname: nickname // change to userId when changing back
            });
          }
        });

        await Promise.all(recordsPromises);
      }
    });

    await Promise.all(promises);

    const boxplotData: BoxplotData[] = Array.from(topicActivities.entries()).map(([title, activities]) => {
      const timeActiveValues = activities.map((a) => a.timeActive);
      const [min, q1, median, q3, max] = calculateBoxplotStats(timeActiveValues);

      const lowNickname = activities[0]?.nickname || "No Interaction";
      const highNickname = activities[activities.length - 1]?.nickname || "No Interaction";

      return {
        value: [min, q1, median, q3, max],
        title: title,
        lowNickname: lowNickname,
        highNickname: highNickname
      };
    });

    return boxplotData;
  }

  renderBoxPlot(container: HTMLElement | null | undefined, boxplotData: number[][], userNicknames: string[]) {
    if (!container) return;

    const chart = echarts.init(container);
    const option = boxplot(bgPatternImg, userNicknames, boxplotData, "Topic Activity per Student Boxplot");
    chart.setOption(option);
  }

  renderCombinedBoxplotChart(container: HTMLElement | null | undefined, boxplotData: BoxplotData[]) {
    if (!container) return;

    const chartInstance = echarts.init(container);
    const option = combinedBoxplotChart(bgPatternImg, boxplotData, "Topic Activity (students) per Topic Boxplot");
    chartInstance.setOption(option);
  }
}
