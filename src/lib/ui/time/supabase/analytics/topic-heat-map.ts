import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { backgroundPattern } from '../charts/tutors-charts-background-url';
import { heatmap } from '../charts/heatmap-chart';
import type { Course, Lo, Topic } from '$lib/services/models/lo-types';
import type { Session } from '@supabase/supabase-js';
import type { HeatMapSeriesData } from '$lib/services/types/supabase-metrics';
import { getCompositeValues, getSimpleTypesValues, getUser } from '$lib/services/utils/supabase-utils';

echarts.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class TopicHeatMapChart {
  chartRendered: boolean = false;
  chartInstances: Map<any, any>;
  course: Course;
  categories: Set<string>;
  yAxisData: string[];
  series: any[];
  topics: string[];
  session: Session;
  userIds: string[];
  chart: any;
  chartInstance: any;

  constructor(course: Course, session: Session, userIds: string[]) {
    this.chartRendered = false;
    this.chartInstances = new Map();
    this.topics = course.los.map(topic => topic.title.trim());
    this.course = course;
    this.categories = new Set();
    this.yAxisData = [];
    this.series = [];
    this.session = session;
    this.userIds = userIds;
    this.chart = null;
    this.chartInstance = null;
  }

  populateUsersData() {
    this.populateTopicTitles(this.course.los);
    this.populateAndRenderUsersData(this.course.los, this.userIds);
  }

  populateSingleUserData() {
    this.populateTopicTitles(this.course.los);
    this.populateAndRenderSingleUserData();
  }

  populateTopicTitles(allTopics: Lo[]) {
    const topicTitles = allTopics.map(topic => topic.title.trim());
    this.categories = new Set(topicTitles);
  }

  getChartContainer() {
    const container = document.getElementById('heatmap-container');
    if (container) {
      container.style.width = '100%';
      container.style.height = '100%';
    }
    return container;
  }

  async prepareTopicData(userId: string, index: number = 0) {
    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    const totalTimesMap = new Map<string, number>();

    allTypes.forEach((lo) => {
      let title: string = "";
      if (lo.parentTopic?.type === 'topic') {
        title = lo.parentTopic?.title;
      } else if (lo.parentLo?.parentTopic?.type === 'topic') {
        title = lo.parentLo?.parentTopic?.title;
      } else {
        title = lo.title;
      }
      const timeActive = lo.learningRecords?.get(userId)?.timeActive || 0;

      if (totalTimesMap.has(title)) {
        totalTimesMap.set(title, totalTimesMap.get(title)! + timeActive);
      } else {
        totalTimesMap.set(title, timeActive);
      }
    });

    const topicTitles = this.course.los.map(topic => topic.title.trim());

    let seriesData = Array.from(totalTimesMap.entries()).map(([title, timeActive]) => {
      return [
        topicTitles.indexOf(title.trim()),
        index,
        Math.round(timeActive / 2)
      ];
    });

    seriesData.sort((a, b) => b[2] - a[2]);

    const userFullName = await getUser(userId) || userId;
    return [{
      name: 'Topic Activity for ' + userFullName,
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  }

  async populateAndRenderSingleUserData() {
    const container = this.getChartContainer();
    if (!container) return;

    this.yAxisData = [this.session.user.user_metadata.user_name];

    const seriesData = await this.prepareTopicData(this.session.user.user_metadata.user_name);

    this.series = [{
      name: 'Topic Activity',
      type: 'heatmap',
      data: seriesData[0]?.data || [],
      selectedMode: 'single',
      top: '5%',
      label: {
        show: true
      }
    }];

    this.renderChart(container);
  }

  async populateAndRenderUsersData(topics: Lo[], usersIds: string[]) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData: HeatMapSeriesData[] = [];
    let yAxisData: string[] = [];
    const topicTitles = topics.map((topic: { title: string; }) => topic.title.trim());
    this.categories = new Set(topicTitles);

    for (const [index, userId] of usersIds.entries()) {
      const seriesData = await this.prepareTopicData(userId, index);
      allSeriesData = allSeriesData.concat(seriesData[0].data);

      if (!yAxisData.includes(userId)) {
        const fullname = await getUser(userId) || userId;
        yAxisData.push(fullname);
      }
    }

    allSeriesData.sort((a, b) => b[2] - a[2]);

    this.series = [{
      name: 'Topic Activity For All Users',
      type: 'heatmap',
      data: allSeriesData || [],
      selectedMode: 'single',
      label: {
        show: true
      }
    }];

    this.yAxisData = yAxisData;
    this.renderChart(container);
  }

  renderChart(container: HTMLElement | null | undefined) {
    this.chartInstance = echarts.init(container);
    const option = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, 'Topic Time: Per Student (click a cell to sort)');
    this.chartInstance.setOption(option);
  }

  prepareCombinedTopicData(userIds: string[]) {
    const topicActivities = new Map();
    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    allTypes.forEach(lo => {
      let title: string = "";
      if (lo.parentTopic?.type === 'topic') {
        title = lo.parentTopic?.title;
      } else if (lo.parentLo?.parentTopic?.type === 'topic') {
        title = lo.parentLo?.parentTopic?.title;
      } else {
        title = lo.title;
      }

      if (!topicActivities.has(title)) {
        topicActivities.set(title, []);
      }

      lo.learningRecords?.forEach((topic, key) => {
        if (userIds.includes(key)) {
          topicActivities.get(title).push({
            timeActive: topic.timeActive,
            nickname: key
          });
        }
      });
    });

    const heatmapData = Array.from(topicActivities.entries()).map(([title, activities]) => {
      activities.sort((a: { timeActive: number; }, b: { timeActive: number; }) => a.timeActive - b.timeActive);

      const addedCount = activities.reduce((acc: number, curr: { timeActive: any; }) => acc + curr.timeActive, 0);

      const lowData = activities[0];
      const highData = activities[activities.length - 1];

      return {
        value: addedCount,
        title: title,
        lowValue: lowData?.timeActive || 0,
        highValue: highData?.timeActive || 0,
        lowNickname: lowData?.nickname || 'No Interaction',
        highNickname: highData?.nickname || 'No Interaction',
      };
    });

    return heatmapData;
  }

  async sortHeatMapValues() {
    if (this.chartInstance !== null) {
      this.chartInstance.off('click');
      this.chartInstance.on('click', async (params: { componentType: string; seriesType: string; value: any[]; }) => {
        if (params.componentType === 'series' && params.seriesType === 'heatmap') {
          const colIndex = params.value[0]; // Column index of the clicked cell  
          // Extract the data for the clicked column
          let columnData = this.series[0].data.filter((item: any[]) => item[0] === colIndex);
          // Sort the column data by the value (timeActive) in ascending order
          columnData.sort((a: number[], b: number[]) => a[2] - b[2]);
          // Reorder yAxisData based on sorted column data
          const sortedUserIndices = columnData.map((item: any[]) => item[1]);
          const sortedYAxisData = sortedUserIndices.map((index: string | number) => this.yAxisData[index]);
          // Reconstruct the series data with sorted y-axis order
          let newData = this.series[0].data.map((item: any[]) => {
            const newIndex = sortedUserIndices.indexOf(item[1]);
            return [item[0], newIndex, item[2]];
          });
          // Update the y-axis data and series data
          this.yAxisData = sortedYAxisData;
          this.series[0].data = newData;
          // Refresh the chart instance
          this.chartInstance.setOption({
            yAxis: {
              data: this.yAxisData
            },
            series: [{
              data: this.series[0].data
            }]
          });
        }
      });
    }
  }

  renderCombinedTopicChart(container: HTMLElement, heatmapActivities: any[], chartTitle: string) {
    this.chart = echarts.init(container);

    const heatmapData = heatmapActivities.map((item, index) => [index, 0, Math.round(item.value / 2)]);
    const titles = heatmapActivities.map(item => item.title);

    const option = {
      title: {
        top: '15%',
        left: 'center',
        text: chartTitle,
      },
      tooltip: {
        position: 'bottom',
        formatter: function (params: { dataIndex: number; }) {
          const dataIndex = params.dataIndex;
          const dataItem = heatmapActivities[dataIndex];
          if (dataItem) {
            let tipHtml = dataItem.title + '<br />';
            tipHtml += 'Min: ' + dataItem.lowValue + ' (' + dataItem.lowNickname + ')<br />';
            tipHtml += 'Max: ' + dataItem.highValue + ' (' + dataItem.highNickname + ')';
            return tipHtml;
          }
          return '';
        }
      },
      backgroundColor: {
        image: bgPatternImg,
        repeat: 'repeat'
      },
      grid: {
        height: '30%',
        top: '30%'
      },
      xAxis: {
        type: 'category',
        data: titles,
      },
      yAxis: {
        type: 'category',
        data: [''],
      },
      axisLabel: {
        interval: 0,
        fontSize: 15
      },
      visualMap: {
        min: 0,
        max: Math.max(...heatmapActivities.map(item => item.value)),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [{
        name: 'Value',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    this.chart.setOption(option);
    this.sortHeatMapValues();
  }
}
