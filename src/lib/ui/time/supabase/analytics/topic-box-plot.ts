import * as echarts from "echarts/core";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import { BoxplotChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { backgroundPattern } from "../charts/tutors-charts-background-url";
import { boxplot, combinedBoxplotChart } from "../charts/boxplot-chart";
import type { Course, Lo } from "$lib/services/models/lo-types";
import { getCompositeValues, getSimpleTypesValues } from "$lib/services/utils/supabase-utils";
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
  // values.sort((a, b) => a - b);

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
    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];
    const userActivities = new Map<string, number[]>();

    const getTopTopicParentLo = (lo: Lo): Lo | null => {
      if (lo.hide) return null;
      if (lo.type === "topic") return lo;
      if (lo.parentLo) return getTopTopicParentLo(lo.parentLo);
      return null;
    };

    // Group user activities by their parent topic
    allTypes.forEach((lo) => {
      const topTopic = getTopTopicParentLo(lo); // Get top-level topic for the LO
      if (topTopic) {
        lo.learningRecords?.forEach((record, userId) => {
          if (this.userIds.includes(userId)) {
            if (!userActivities.has(userId)) {
              userActivities.set(userId, []);
            }
            userActivities.get(userId)!.push(record.timeActive);
          }
        });
      }
    });

    const userActivitiesPromises = Array.from(userActivities.entries()).map(async ([userId, activities]) => {
      if (activities.length > 0) {
        //const fullname = await this.getName(); //generate fakenames
        //const fullname = this.userNamesUseridsMap.get(userId) || userId;
        const [fullname] = this.userNamesUseridsMap?.get(userId) || [undefined, undefined];

        const [min, q1, median, q3, max] = calculateBoxplotStats(activities);
        boxplotData.push([min, q1, median, q3, max]);
        userNicknames.push(fullname ?? userId);
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

    const getTopTopicParentLo = (lo: Lo): Lo | null => {
      if (lo.hide) return null;
      if (lo.type === "topic") return lo;
      if (lo.parentLo) return getTopTopicParentLo(lo.parentLo);
      return null;
    };

    const promises = allTypes.map(async (lo) => {
      const topTopic = getTopTopicParentLo(lo); // Get top-level topic for the LO
      if (topTopic && lo.learningRecords && lo.learningRecords.size !== 0) {
        const title = topTopic.title; // Use top topic's title

        if (!topicActivities.has(title)) {
          topicActivities.set(title, []);
        }

        const recordsPromises = Array.from(lo.learningRecords.entries()).map(async ([userId, record]) => {
          if (this.userIds.includes(userId)) {
            //const nickname = await this.getName(); //generate a fake name
            //const nickname = this.userNamesUseridsMap.get(userId) || userId;
            const [fullname] = this.userNamesUseridsMap?.get(userId) || [undefined, undefined];

            topicActivities.get(title)!.push({
              timeActive: record.timeActive,
              nickname: fullname ?? userId // change to userId when changing back
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
        name: title,
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
