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
import type { Course, Lo } from '$lib/services/models/lo-types';

echarts.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class LabHeatMapChart {
  chartRendered: boolean = false;
  chartInstances: Map<any, any>;
  labs: Lo[] | undefined;
  categories: Set<String>;
  yAxisData: number[];
  series: string[];

  constructor(course: Course) {
    this.chartRendered = false;
    this.chartInstances = new Map();
    this.labs = course.wallMap?.get("lab") // Array of lab titles
    //this.users = userData; // Array of user objects
    this.categories = new Set();
    //this.user = null;
    this.yAxisData = [];
    this.series = [];
  }

  populateUsersData() {
    this.populateLabTitles(this.labs)
    this.populateAndRenderUsersData(this.users, this.labs);
  }

  populateSingleUserData(user: UserMetric) {
    this.user = user;
    this.populateLabTitles(this.labs)
    this.populateAndRenderSingleUserData(this.user, this.labs);
  }

  populateLabTitles(allLabs: Lo[]) {
    const labTitles = allLabs.map(lab => lab.title.trim());
    this.categories = new Set(labTitles);
  }

  getChartContainer() {
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

  populateSeriesData(user: UserMetric, userIndex: number, allLabs) {
    const labTitles = allLabs.map(lab => lab.title.trim());
    this.categories = new Set(labTitles);

    const seriesData = user?.labActivity?.map(activity => [
      labTitles.indexOf(activity.title.trim()),
      userIndex, // yIndex is now the index of the user in usersData array
      activity.count
    ])

    return [{
      name: 'Lab Activity',
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  }

  populateSingleUserSeriesData(user: UserMetric, allLabs) {
    const labTitles = allLabs.map(lab => lab.title.trim());
    this.categories = new Set(labTitles);

    const seriesData = user?.labActivity?.map(activity => [
      labTitles.indexOf(activity.title.trim()),
      0,
      activity.count
    ])

    return [{
      name: 'Lab Activity',
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  }

  populateAndRenderSingleUserData(user: UserMetric, allLabs: any) {
    const container = this.getChartContainer();
    if (!container) return;

    this.yAxisData = [user?.nickname];

    const seriesData = this.populateSingleUserSeriesData(user, allLabs);
    this.series = [{
      name: 'Lab Activity',
      type: 'heatmap',
      top: '5%',
      data: seriesData[0]?.data || [],
      label: {
        show: true
      }
    }];

    this.renderChart(container);
  };

  populateAndRenderUsersData(usersData, allLabs) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData = [];
    usersData?.forEach((user, nickname) => {
      this.yAxisData.push(user?.nickname)

      const index = this.getIndexFromMap(usersData, nickname);

      const seriesData = this.populateSeriesData(user, index, allLabs);
      allSeriesData = allSeriesData.concat(seriesData[0].data);
    });

    this.series = [{
      name: 'Lab Activity',
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
    const option = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, 'Lab Time: Per Student');
    chartInstance.setOption(option);
    chartInstance.resize();
  };

  populateAndRenderCombinedUsersData(usersData, allLabs) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData = [];
    let yAxisData: [] = [];
    usersData?.forEach((user, nickname) => {
      yAxisData.push(user?.nickname)

      const index = this.getIndexFromMap(usersData, nickname);

      const seriesData = this.populateSeriesData(user, index, allLabs);
      allSeriesData = allSeriesData.concat(seriesData[0].data);
    });

    const series = [{
      name: 'Lab Activity',
      type: 'heatmap',
      data: allSeriesData,
      label: {
        show: true
      }
    }];

    this.renderChart(container);
  };

  prepareCombinedLabData(data) {
    const labActivities = new Map();

    data?.forEach(user => {
      user?.labActivity.forEach(lab => {
        if (!labActivities.has(lab.title)) {
          labActivities.set(lab.title, []);
        }
        labActivities.get(lab.title).push({ count: lab.count, nickname: user.nickname, image: user.picture });
      });
    });

    const heatmapData = Array.from(labActivities).map(([title, activities]) => {
      activities.sort((a, b) => a.count - b.count);
      const addedCount = activities.reduce((acc, curr) => acc + curr.count, 0);

      const lowData = activities[0];
      const highData = activities[activities.length - 1];
      return {
        value: addedCount,
        title: title,
        lowValue: lowData.count,
        highValue: highData.count,
        lowNickname: lowData.nickname,
        highNickname: highData.nickname,
      };
    });

    return heatmapData;
  }

  renderCombinedLabChart(container: HTMLElement, labData: any[], chartTitle: string) {
    const chart = echarts.init(container);

    const heatmapData = labData.map((item, index) => [index, 0, item.value]);
    const titles = labData.map(item => item.title);

    const option = {
      title: {
        top: '5%',
        left: 'center',
        text: chartTitle,
      },
      tooltip: {
        position: 'bottom',
        formatter: function (params) {
          const dataIndex = params.dataIndex;
          const dataItem = labData[dataIndex];
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
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: titles,
      },
      yAxis: {
        type: 'category',
        data: [''] // Single category axis
        , axisLabel: {
          interval: 0,
          fontSize: 15
        },
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

    // Set the option to the chart
    chart.setOption(option);
  };
}

