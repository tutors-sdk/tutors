import * as echarts from 'echarts/core';
import { backgroundPattern } from '../charts/tutors-charts-background-url';
import { piechart } from '../charts/piechart';
import type { Course } from '$lib/services/models/lo-types';
import type { Session } from '@supabase/supabase-js';
import { getCompositeValues, getSimpleTypesValues } from '$lib/services/utils/supabase-utils';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register the required components and charts
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
  totalTimesMap: Map<string, { timeActive: number; topicTitle: string }> = new Map();
  constructor(course: Course, session: Session) {
    this.myChart = null;
    this.topics = [];
    this.course = course;
    this.session = session;
    this.topicTitleTimesMap = new Map<string, number>();
    this.totalTimesMap = new Map<string, { timeActive: number; topicTitle: string }>();
  }

  singleUserPieClick() {
    if (this.myChart !== null) {
      // Listen to click event on the inner pie chart
      this.myChart.on('click', (params: { seriesName: string; name: string; }) => {
        if (params.seriesName === 'Inner Pie') {
          let outerPieData: { value: number; name: string; }[] = []; // Reset outerPieData array

          // Find the corresponding data for the clicked inner pie slice
          this.totalTimesMap.forEach((lo, key) => {
            if (lo.topicTitle === params.name) {
              if (lo?.timeActive !== 0) {
                outerPieData.push({ value: lo.timeActive!, name: key });
              }
            }
          });
          this.populateOuterPieData(outerPieData);
        }
      });
    };
  }

  populateOuterPieData(outerPieData: { value: number; name: string; }[]) {
    // Update the data for the outer pie chart
    const chartInstance = echarts.getInstanceByDom(document.getElementById('chart'));
    if (chartInstance) {
      chartInstance.setOption({
        series: [{
          name: 'Outer Pie',
          data: outerPieData
        }]
      });
    }
  };

  multipleUsersPieClick() {
    this.myChart.on('click', (params) => {
      if (params.seriesName === 'Inner Pie') {
        // Aggregate total_duration for the clicked topic for all users
        const usersArray = Array.from(this.users.values());
        const outerPieData = usersArray.reduce((acc, user) => {
          user.topics.forEach(topic => {
            if (topic.topic_title === params.name) {

              const existing = acc.find(a => a.name === topic.lo_title);
              if (existing) {
                existing.value += topic.total_duration;
              } else {
                acc.push({ value: topic.total_duration, name: topic.lo_title });
              }
            }
          });

          return acc;
        }, []);
        this.populateOuterPieData(outerPieData);
      }
    });
  };

  // aggregateInnerPieTopicData(): any[] {
  //   let allUsersTopicActivity: any = [];
  //   const usersArray = Array.from(this.users.values());
  //   allUsersTopicActivity = usersArray.reduce((acc, user) => {
  //     user.topicActivity.forEach(activity => {
  //       let existing = acc.find(item => item.name === activity.title);
  //       if (existing) {
  //         existing.value += activity.count;
  //       } else {
  //         acc.push({ value: activity.count, name: activity.title });
  //       }
  //     });
  //     return acc;
  //   }, []);
  //   return allUsersTopicActivity;
  // }

  renderChart() {
    if (this.myChart === null) {
      // If chart instance doesn't exist, create a new one
      this.myChart = echarts.init(document.getElementById('chart'));
    }

    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    allTypes.forEach((lo) => {
      let topicTitle: string = "";
      let loTitle = lo.title;
      if (lo.parentTopic?.type === 'topic') {
        topicTitle = lo.parentTopic?.title;
      } else if (lo.parentLo?.parentTopic?.type === 'topic') {
        topicTitle = lo.parentLo?.parentTopic?.title;
      } else {
        topicTitle = lo.title;
      }
      const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;

      // Add timeActive to the total time for the topic
      if (this.topicTitleTimesMap.has(topicTitle)) {
        this.topicTitleTimesMap.set(topicTitle, this.topicTitleTimesMap.get(topicTitle)! + timeActive);
      } else {
        this.topicTitleTimesMap.set(topicTitle, timeActive);
      }

      // Add timeActive and topicTitle to the totalTimesMap
      if (this.totalTimesMap.has(loTitle)) {
        const existingEntry = this.totalTimesMap.get(loTitle)!;
        existingEntry.timeActive += timeActive;
        existingEntry.topicTitle = topicTitle;
      } else {
        this.totalTimesMap.set(loTitle, { timeActive, topicTitle });
      }
    });

    // if (this.course === null) {

    const singleUserInnerData = Array.from(this.topicTitleTimesMap.entries()).map(([title, timeActive]) => ({
      name: title,
      value: timeActive
    }));

    const singleUserOuterData = Array.from(this.totalTimesMap.entries()).map(([title, timeActive]) => ({
      name: title,
      value: timeActive
    }));

    const option = piechart(bgPatternImg, this.course, [], singleUserInnerData, singleUserOuterData);
    this.myChart.setOption(option);
    this.singleUserPieClick();
    // } else {
    //   this.multipleUsersPieClick();
    //   const allUsersTopicActivity = this.aggregateInnerPieTopicData();
    //   const option = piechart(bgPatternImg, this.user, allUsersTopicActivity, [], []);
    //   this.myChart.setOption(option);
    // }
  }
};

