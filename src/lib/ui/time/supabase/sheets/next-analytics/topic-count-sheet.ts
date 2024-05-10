import * as echarts from 'echarts/core';
import { backgroundPattern } from '../next-charts/next-charts-background-url';
import { StudentPieChart } from '../next-charts/pie-chart';
import type { StudentRecord } from '$lib/services/types/supabase-metrics';


const bgPatternSrc = backgroundPattern;

const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class TopicCountSheet {
  constructor() {
    this.myChart = null;
    this.listOfTopics = [];
    this.users = null;
    this.user = null;
  }

  populateUserData(userData: StudentRecord) {
    this.user = userData;
  };

  singleUserPieClick() {
    // Listen to click event on the inner pie chart
    this.myChart.on('click', (params) => {
      if (params.seriesName === 'Inner Pie') {
        let outerPieData = []; // Reset outerPieData array

        // Find the corresponding data for the clicked inner pie slice
        this.user.topics.forEach((topic) => {
          if (topic.topic_title === params.name) {
            outerPieData.push({ value: topic.total_duration, name: topic.lo_title });
          }
        });
        this.populateOuterPieData(outerPieData);
      }
    });
  };

  populateUsersData(usersData: Map<string, StudentRecord>) {
    this.users = usersData || [];
  };

  populateOuterPieData(outerPieData: any[]) {
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

  aggregateInnerPieTopicData(): any[] {
    let allUsersTopicActivity: any = [];
    const usersArray = Array.from(this.users.values());
    allUsersTopicActivity = usersArray.reduce((acc, user) => {
      user.topicActivity.forEach(activity => {
        let existing = acc.find(item => item.name === activity.title);
        if (existing) {
          existing.value += activity.count;
        } else {
          acc.push({ value: activity.count, name: activity.title });
        }
      });
      return acc;
    }, []);
    return allUsersTopicActivity;
  }

  renderChart() {
    if (this.myChart === null) {
      // If chart instance doesn't exist, create a new one
      this.myChart = echarts.init(document.getElementById('chart'));
    }
    if (this.users === null) {

      const singleUserInnerData = this.user?.topicActivity.map((topic) => ({
        value: topic.count,
        name: topic.title
      }));

      const singleUserOuterData = this.user?.topics.map((topic) => ({
        value: topic.total_duration,
        name: topic.title
      }));

      const option = StudentPieChart(bgPatternImg, this.user, [], singleUserInnerData, singleUserOuterData);
      this.myChart.setOption(option);
      this.singleUserPieClick();
    } else {
      this.multipleUsersPieClick();
      const allUsersTopicActivity = this.aggregateInnerPieTopicData();
      const option = StudentPieChart(bgPatternImg, this.user, allUsersTopicActivity, [], []);
      this.myChart.setOption(option);
    }
  }
}

