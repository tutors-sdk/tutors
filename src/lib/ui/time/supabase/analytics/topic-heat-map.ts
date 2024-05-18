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
import { filterByType } from '$lib/services/models/lo-utils';
import type { HeatMapSeriesData } from '$lib/services/types/supabase-metrics';
import { getCompositeValues, getSimpleTypesValues } from '$lib/services/utils/supabase-utils';

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
  }

  populateUsersData() {
    this.populateTopicTitles(this.course.los)
    this.populateAndRenderUsersData(this.course.los, this.userIds);
  }

  populateSingleUserData() {
    this.populateTopicTitles(this.course.los)
    this.populateAndRenderSingleUserData();
  }

  populateTopicTitles(allTopics: Lo[]) {
    const topicTitles = allTopics.map(topic => topic.title.trim());
    this.categories = new Set(topicTitles);
  }

  getChartContainer() {
    // Assuming there is one container for the whole heatmap
    const container = document.getElementById('heatmap-container');
    if (container) {
      container.style.width = '100%';
      container.style.height = '100%';
    }
    return container;
  }

  prepareTopicData(userId: string, index: number = 0) {
    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    // Map to store total timeActive for each step
    const totalTimesMap = new Map<string, number>();

    allTypes.forEach((lo) => {
      let title: string = "";
      if (lo.parentTopic?.type === 'topic') {
        title = lo.parentTopic?.title
      } else if (lo.parentLo?.parentTopic?.type === 'topic') {
        title = lo.parentLo?.parentTopic?.title
      } else {
        title = lo.title
      }
      const timeActive = lo.learningRecords?.get(userId)?.timeActive || 0;

      // Add timeActive to the total time for the lo
      if (totalTimesMap.has(title!)) {
        totalTimesMap.set(title!, totalTimesMap.get(title!)! + timeActive);
      } else {
        totalTimesMap.set(title!, timeActive);
      }
    });

    const topicTitles = this.course.los.map(topic => topic.title.trim());

    // Construct seriesData array using the aggregated total times
    const seriesData = Array.from(totalTimesMap.entries()).map(([title, timeActive]) => {
      return [
        topicTitles.indexOf(title.trim()),
        index,
        timeActive
      ];
    });

    return [{
      name: 'Lab Activity for ' + this.session.user.user_metadata.user_name,
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  };

  populateAndRenderSingleUserData() {
    const container = this.getChartContainer();
    if (!container) return; // Exit if no container found

    // yAxisData for a single user should be an array with a single element
    this.yAxisData = [this.session.user.user_metadata.user_name]; // Even for a single user, this should be an array

    const seriesData = this.prepareTopicData(this.session.user.user_metadata.user_name);

    // Now seriesData contains the data for a single user
    this.series = [{
      name: 'Topic Activity',
      type: 'heatmap',
      data: seriesData[0]?.data || [],
      top: '5%',
      label: {
        show: true
      }
    }];

    this.renderChart(container);
  };

  populateAndRenderUsersData(topics: Lo[], usersIds: string[]) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData: HeatMapSeriesData[] = [];
    let yAxisData: string[] = []; // Array to store yAxis data
    const labTitles = topics.map((topic: { title: string; }) => topic.title.trim());
    this.categories = new Set(labTitles);

    usersIds.forEach((userId, index) => {
      const seriesData = this.prepareTopicData(userId, index);
      allSeriesData = allSeriesData.concat(seriesData[0].data);

      if (!yAxisData.includes(userId)) {
        yAxisData.push(userId);
      }
    });

    this.series = [{
      name: 'Lab Activity',
      type: 'heatmap',
      data: allSeriesData || [],
      label: {
        show: true
      }
    }];

    this.yAxisData = yAxisData;
    this.renderChart(container);
  };

  renderChart(container: HTMLElement | null | undefined) {
    const chartInstance = echarts.init(container);
    const option = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, 'Topic Time: Per Student');
    chartInstance.setOption(option);
  };

  prepareCombinedTopicData(userIds: string[]) {
    const topicActivities = new Map();
    const allComposites = this.getCompositeValues();
    const allSimpleTypes = this.getSimpleTypesValues();
    const allTypes = [...allComposites, ...allSimpleTypes];

    allTypes?.forEach(lo => {
      if (lo.learningRecords?.size !== 0) {
        let title: string = "";
        if (lo.parentTopic?.type === 'topic') {
          title = lo.parentTopic?.title
        } else if (lo.parentLo?.parentTopic?.type === 'topic') {
          title = lo.parentLo?.parentTopic?.title
        } else {
          title = lo.title
        }

        if (!topicActivities.has(title)) {
          topicActivities.set(title, []);
        }

        lo.learningRecords?.forEach((topic, key) => {
          if (userIds?.includes(key)) {
            // Push the activity to the corresponding title in labActivities
            topicActivities.get(title).push({
              timeActive: topic.timeActive,
              nickname: key
            });
          }
        });
      }
    });

    const heatmapData = Array.from(topicActivities).map(([title, activities]) => {
      activities.sort((a: { timeActive: number; }, b: { timeActive: number; }) => a.timeActive - b.timeActive);
      const addedCount = activities.reduce((acc: number, curr: { timeActive: number; }) => acc + curr.timeActive, 0);

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
  };  

  renderCombinedTopicChart(container: HTMLElement, heatmapActivities: any[], chartTitle: string) {
    const chart = echarts.init(container);

    const heatmapData = heatmapActivities.map((item, index) => [index, 0, item.value]);
    const titles = heatmapActivities.map(item => item.title);

    // Heatmap option
    const option = {
      title: {
        top: 30,
        left: 'center',
        text: chartTitle,
      },
      tooltip: {
        position: 'bottom',
        formatter: function (params) {
          const dataIndex = params.dataIndex;
          const dataItem = heatmapActivities[dataIndex];
          let tipHtml = dataItem.title + '<br />';
          tipHtml += 'Min: ' + dataItem.lowValue + ' (' + dataItem.lowNickname + ')<br />';
          tipHtml += 'Max: ' + dataItem.highValue + ' (' + dataItem.highNickname + ')';
          return tipHtml;
        }
      },
      backgroundColor: {
        image: bgPatternImg,
        repeat: 'repeat'
      },
      grid: {
        height: '30%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: titles,

      },
      yAxis: {
        type: 'category',
        data: [''] // Single category axis
      },
      axisLabel: {
        interval: 0,
        fontSize: 15
      },
      visualMap: {
        min: 0,
        max: this.series[0]?.data.length !== 0 ? Math.max(...this.series[0]?.data?.map(item => item[2])) : 0,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [{
        name: 'Value',
        type: 'heatmap',
        data: heatmapData, //the format of data [1,0,6]
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

    // Set the option to the chart
    chart.setOption(option);
  };
}