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
import type { Session } from '@supabase/supabase-js';
import { filterByType } from '$lib/services/models/lo-utils';
import type { HeatMapSeriesData } from '$lib/services/types/supabase-metrics';

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
  course: Course;
  session: Session;
  series: HeatMapSeriesData;
  los: Lo[];

  constructor(course: Course, session: Session) {
    this.chartRendered = false;
    this.chartInstances = new Map();
    this.labs = course.wallMap?.get("lab") // Array of lab titles
    //this.users = userData; // Array of user objects
    this.categories = new Set();
    this.yAxisData = [];
    this.series = {
      name: "",
      type: "",
      top: "",
      data: [],
      label: {
        show: true
      }
    };
    this.course = course;
    this.session = session;
    this.los = filterByType(this.course.los, 'lab');
  }

  populateUsersData() {
    if (this.labs) {
      this.populateLabTitles(this.labs)
      this.populateAndRenderUsersData(this.course, this.labs);
    }
  }

  populateSingleUserData() {
    if (this.labs) {
      this.populateLabTitles(this.labs)
      this.populateAndRenderSingleUserData(this.session, this.labs);
    }
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

  getIndexFromMap(map: Lo[], key) {
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

  populateSingleUserSeriesData(course: Course, allLabs: Lo[]) {
    const labTitles = allLabs.map((lab: { title: string; }) => lab.title.trim());
    this.categories = new Set(labTitles);
    let los = filterByType(course.los, 'lab');

    const seriesData = los.map(lo => [
      labTitles.indexOf(lo.title.trim()),
      0,
      lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0
    ]);

    return [{
      name: 'Lab Activity for ' + this.session.user.user_metadata.user_name,
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true
      }
    }];
  }

  populateAndRenderSingleUserData(session: Session, allLabs: Lo[]) {
    const container = this.getChartContainer();
    if (!container) return;

    this.yAxisData = [session.user.user_metadata.user_name];

    const seriesData = this.populateSingleUserSeriesData(this.course, allLabs);
    this.series = {
      name: 'Lab Activity',
      type: 'heatmap',
      top: '5%',
      data: seriesData[0]?.data || [],
      label: {
        show: true
      }
    };

    this.renderChart(container);
  };

  populateAndRenderUsersData(course: Course, allLabs: Lo[]) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData: HeatMapSeriesData[] = [];

    let los = filterByType(course.los, 'lab');

    los?.forEach((lo, nickname) => {
      this.yAxisData.push(nickname)

      const index = this.getIndexFromMap(los, nickname);

      const seriesData = this.populateSeriesData(lo, index, allLabs);
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

  renderChart(container: HTMLElement) {
    const chartInstance = echarts.init(container);
    const option = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, 'Lab Time: Per Student');
    chartInstance.setOption(option);
    chartInstance.resize();
  };

  populateAndRenderCombinedUsersData() {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData = [];
    let yAxisData: [] = [];
    this.los?.forEach((user, nickname) => {
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

  prepareCombinedLabData() {
    const labActivities = new Map();

    this.los?.forEach(lo => {
      if (lo.learningRecords) {
        lo?.learningRecords.forEach(lab => {
          if (!labActivities.has(lo.title)) {
            labActivities.set(lo.title, []);
          }
          labActivities.get(lo.title).push({ timeActive: lab.timeActive, nickname: this.session.user.user_metadata.user_name, image: this.session.user.user_metadata.avatar_url });
        });
      }
    });

    const heatmapData = Array.from(labActivities).map(([title, activities]) => {
      activities.sort((a: { timeActive: number; }, b: { timeActive: number; }) => a.timeActive - b.timeActive);
      const addedCount = activities.reduce((acc: any, curr: { timeActive: any; }) => acc + curr.timeActive, 0);

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
        formatter: function (params: { dataIndex: any; }) {
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

