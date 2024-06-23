import * as echarts from "echarts/core";
import { backgroundPattern } from "../charts/tutors-charts-background-url";
import { piechart } from "../charts/piechart";
import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";
import { getCompositeValues, getSimpleTypesValues } from "$lib/services/utils/supabase-utils";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { LabStepData, OuterPieData } from "$lib/services/types/supabase-metrics";

echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

const bgPatternSrc = backgroundPattern;

const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class TopicPieChart {
  myChart: any;
  topics: string[];
  course: Course;
  session: Session;
  topicTitleTimesMap = new Map<string, number>();
  totalTimesMap: Map<string, LabStepData[]>;
  userIds: string[];
  multipleUsers: boolean;

  constructor(course: Course, session: Session, userIds: string[], multipleUsers: boolean) {
    this.myChart = null;
    this.topics = [];
    this.course = course;
    this.session = session;
    this.userIds = userIds;
    this.topicTitleTimesMap = new Map<string, number>();
    this.totalTimesMap = new Map<string, LabStepData[]>();
    this.multipleUsers = multipleUsers;
  }

  singleUserPieClick() {
    if (this.myChart !== null) {
      // Listen to click event on the inner pie chart
      this.myChart.on("click", (params: { seriesName: string; name: string }) => {
        if (params.seriesName === "Inner Pie") {
          let outerPieData: OuterPieData[] = []; // Reset outerPieData array

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
            data: outerPieData.filter((topic) => topic.value > 0) || [{}]
          }
        ]
      });
    }
  }

  multipleUsersInnerPieClick() {
    this.myChart.on("click", (params: { seriesName: string; name: any }) => {
      if (params.seriesName === "Inner Pie") {
        const outerPieData: OuterPieData[] = [];

        this.totalTimesMap.forEach((steps, topicTitle) => {
          if (topicTitle === params.name) {
            steps.forEach((step) => {
              const existing = outerPieData.find((data) => data.name === step.title);
              if (existing) {
                existing.value += step.aggregatedTimeActive;
              } else {
                outerPieData.push({ value: step.aggregatedTimeActive, name: step.title, type: step.loType });
              }
            });
          }
        });
        this.populateOuterPieData(outerPieData);
      }
    });
  }

  getOuterPieDataForMultipleUsers(): { value: number; name: string }[] {
    const outerPieData: { value: number; name: string }[] = [];
    this.topicTitleTimesMap.forEach((value, key) => {
      const existing = outerPieData.find((data) => data.name === key);
      if (existing) {
        existing.value += value;
      } else {
        outerPieData.push({ value, name: key });
      }
    });

    return outerPieData;
  }

  renderChart(userIds = null as string[] | null) {
    if (this.myChart === null) {
      // If chart instance doesn't exist, create a new one
      this.myChart = echarts.init(document.getElementById("chart"));
    }

    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    const updateMaps = (lo: Lo, userName: string, timeActive: number) => {
      let topicTitle = "";
      let loTitle = lo.title;
      if (lo.parentTopic?.type === "topic") {
        topicTitle = lo.parentTopic?.title;
      } else if (lo.parentLo?.parentTopic?.type === "topic") {
        topicTitle = lo.parentLo?.parentTopic?.title;
      } else {
        topicTitle = lo.title;
      }

      // Add timeActive to the total time for the topic
      if (this.topicTitleTimesMap.has(topicTitle)) {
        this.topicTitleTimesMap.set(topicTitle, this.topicTitleTimesMap.get(topicTitle)! + timeActive);
      } else {
        this.topicTitleTimesMap.set(topicTitle, timeActive);
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

    allTypes.forEach((lo) => {
      if (userIds && userIds.length > 0) {
        userIds.forEach((userId) => {
          const timeActive = lo.learningRecords?.get(userId)?.timeActive || 0;
          updateMaps(lo, userId, timeActive);
        });
      } else {
        const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;
        updateMaps(lo, this.session.user.user_metadata.user_name, timeActive);
      }
    });

    if (this.multipleUsers === false) {
      const singleUserInnerData = Array.from(this.topicTitleTimesMap.entries()).map(([title, timeActive]) => ({
        name: title,
        value: timeActive
      }));

      const option = piechart(bgPatternImg, this.course, [], singleUserInnerData, []);
      this.myChart.setOption(option);
      this.singleUserPieClick();
    } else {
      const allUsersTopicActivity = this.getOuterPieDataForMultipleUsers();
      const option = piechart(bgPatternImg, this.course, allUsersTopicActivity, [], []);
      this.myChart.setOption(option);
      this.multipleUsersInnerPieClick();
    }
  }
}
