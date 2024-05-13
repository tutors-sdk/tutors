import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { backgroundPattern } from '../es-charts/tutors-charts-background-url';
import { heatmap } from '../es-charts/heatmap';
import type { Topic } from '$lib/services/models/lo-types';

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

  constructor(topics, userData) {
    this.chartRendered = false;
    this.chartInstances = new Map();
    this.topics = topics;
    this.users = userData;
    this.categories = new Set();
    this.user = null;
    this.yAxisData = [];
    this.series = [];
  }

  populateUsersData() {
    this.populateTopicTitles(this.topics)
    this.populateAndRenderUsersData(this.users, this.topics);
  }

  populateSingleUserData(user: StudentRecord) {
    this.user = user;
    this.populateAndRenderSingleUserData(this.user, this.topics);
  }

  populateTopicTitles(allTopics: Topic[]) {
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

  getIndexFromMap(map, key) {
    const keysArray = Array.from(map.keys());
    return keysArray.indexOf(key);
  }

  populateSeriesData(user, userIndex: number, topics) {
    const topicTitles = topics.map(topic => topic.title.trim());
    this.categories = new Set(topicTitles);

    //const seriesData = usersData.forEach((user, userIndex) => 
    const seriesData = user?.topicActivity?.map(activity => [
      topicTitles.indexOf(activity.title.trim()),
      userIndex, // yIndex is now the index of the user in usersData array
      activity.count
    ])

    return [{
      name: 'Topic Activity',
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  }

  populateSingleUserSeriesData(user: StudentRecord, topics) {
    const topicTitles = topics.map(topic => topic.title.trim());
    this.categories = new Set(topicTitles);

    const seriesData = user?.topicActivity.map(activity => [
      topicTitles.indexOf(activity.title.trim()),
      0,
      activity.count
    ])

    return [{
      name: 'Topic Activity',
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  }

  populateAndRenderSingleUserData(user: StudentRecord, topics: any) {
    const container = this.getChartContainer();
    if (!container) return; // Exit if no container found

    // yAxisData for a single user should be an array with a single element
    this.yAxisData = [user?.student.nickname]; // Even for a single user, this should be an array

    const seriesData = this.populateSingleUserSeriesData(user, topics);

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

  populateAndRenderUsersData(usersData, topics) {
    const container = this.getChartContainer();
    if (!container) return; // Exit if no container found

    let allSeriesData = [];
    usersData?.forEach((user, nickname) => {
      this.yAxisData.push(user?.nickname)

      const index = this.getIndexFromMap(usersData, nickname);

      const seriesData = this.populateSeriesData(user, index, topics);
      allSeriesData = allSeriesData.concat(seriesData[0].data);
    });

    // Now allSeriesData contains the combined data for all users
    this.series = [{
      name: 'Topic Activity',
      type: 'heatmap',
      data: allSeriesData || [],
      label: {
        show: true
      }
    }] || [];

    this.renderChart(container);
  };

  renderChart(container) {
    const chartInstance = echarts.init(container);

    const option = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, 'Topic Time: Per Student');

    chartInstance.setOption(option);
  };

  populateAndRenderCombinedUsersData(usersData, allLabs) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData = [];
    usersData?.forEach((user, nickname) => {
      this.yAxisData.push(user?.nickname)

      const index = this.getIndexFromMap(usersData, nickname);

      const seriesData = this.populateSeriesData(user, index, allLabs);
      allSeriesData = allSeriesData.concat(seriesData[0].data);
    });

    // Now allSeriesData contains the combined data for all users
    this.series = [{
      name: 'Topic Activity',
      type: 'heatmap',
      data: allSeriesData,
      label: {
        show: true
      }
    }];

    this.renderChart(container);
  };

  prepareCombinedTopicData(data) {
    const topicActivities = new Map();

    // Aggregate counts and nicknames for each lab
    data?.forEach(user => {
      user?.topicActivity.forEach(topic => {
        if (!topicActivities.has(topic.title)) {
          topicActivities.set(topic.title, []);
        }
        // Push an object containing count and nickname
        topicActivities.get(topic.title).push({ count: topic.count, nickname: user.nickname });
      });
    });

    const heatmapData = Array.from(topicActivities).map(([title, activities]) => {
      activities.sort((a, b) => a.count - b.count);
      const addedCount = activities.reduce((acc, curr) => acc + curr.count, 0);

      const lowData = activities[0];
      const highData = activities[activities.length - 1];
      // Convert the data into the format expected by ECharts
      return {
        value: addedCount,
        title: title,
        lowValue: lowData.count,
        highValue: highData.count,
        lowNickname: lowData.nickname,
        highNickname: highData.nickname
      };
    });

    return heatmapData;
  }

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