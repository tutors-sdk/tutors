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
import type { Course, LearningRecord, Lo } from '$lib/services/models/lo-types';
import type { Session } from '@supabase/supabase-js';
import { filterByType } from '$lib/services/models/lo-utils';
import type { HeatMapSeriesData, LearningObject } from '$lib/services/types/supabase-metrics';

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
  yAxisData: string[];
  course: Course;
  session: Session;
  series: HeatMapSeriesData;
  los: Lo[];
  userIds: string[];

  constructor(course: Course, session: Session, userIds: string[]) {
    this.chartRendered = false;
    this.chartInstances = new Map();
    this.labs = course.wallMap?.get("lab") // Array of lab titles
    this.userIds = userIds;
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
      this.populateLabTitles(this.labs);
      this.populateAndRenderUsersData(this.course, this.labs, this.userIds);
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

  populatePerUserSeriesData(course: Course, allLabs: Lo[], userId: string, index: number = 0) {
    const labTitles = allLabs.map((lab: { title: string; }) => lab.title.trim());
    this.categories = new Set(labTitles);

    let labs = filterByType(course.los, 'lab');
    let steps = filterByType(course.los, 'step');

    const allLabSteps = [...labs, ...steps];

    // Map to store total timeActive for each step
    const totalTimesMap = new Map<string, number>();

    // Iterate over allLabSteps to aggregate total timeActive for each step
    allLabSteps.forEach((step, stepIndex) => {
      const title = step.parentLo?.type === 'lab' ? step.parentLo?.title : step.title;
      const timeActive = step.learningRecords?.get(userId)?.timeActive || 0;

      // Add timeActive to the total time for the step
      if (totalTimesMap.has(title)) {
        totalTimesMap.set(title, totalTimesMap.get(title)! + timeActive);
      } else {
        totalTimesMap.set(title, timeActive);
      }
    });

    // Construct seriesData array using the aggregated total times
    const seriesData = Array.from(totalTimesMap.entries()).map(([title, timeActive], stepIndex) => {
      return [
        labTitles.indexOf(title.trim()),
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
  }

  populateAndRenderSingleUserData(session: Session, allLabs: Lo[]) {
    const container = this.getChartContainer();
    if (!container) return;

    this.yAxisData = [session.user.user_metadata.user_name];

    const seriesData = this.populatePerUserSeriesData(this.course, allLabs, session.user.user_metadata.user_name);
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

  populateAndRenderUsersData(course: Course, allLabs: Lo[], usersIds: string[]) {
    const container = this.getChartContainer();
    if (!container) return;

    let allSeriesData: HeatMapSeriesData[] = [];
    let yAxisData: string[] = []; // Array to store yAxis data


    const labTitles = allLabs.map((lab: { title: string; }) => lab.title.trim());
    this.categories = new Set(labTitles);

    usersIds.forEach((userId, index) => {




      const seriesData = this.populatePerUserSeriesData(course, allLabs, userId, index);
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

  renderChart(container: HTMLElement) {
    const chartInstance = echarts.init(container);
    const option = heatmap(this.categories, this.yAxisData, this.series, bgPatternImg, 'Lab Time: Per Student');
    chartInstance.setOption(option);
    chartInstance.resize();
  };

  prepareCombinedLabData(userIds: string[]) {
    const labActivities = new Map();
    const labs = filterByType(this.course.los, 'lab');
    const steps = filterByType(this.course.los, 'step');

    const allLabSteps = [...labs, ...steps];

    allLabSteps?.forEach(step => {
      if (step.learningRecords) {
        const title = step.parentLo?.type === 'lab' ? step.parentLo?.title : step.title;
        if (!labActivities.has(title)) {
          labActivities.set(title, []);
        }

        step.learningRecords.forEach((lab, key) => {
          if (userIds.includes(key)) {
            // Push the activity to the corresponding title in labActivities
            labActivities.get(title).push({
              timeActive: lab.timeActive,
              nickname: key
            });
          }
        });
      }
    });

    const heatmapData = Array.from(labActivities).map(([title, activities]) => {
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
  }


  renderCombinedLabChart(container: HTMLElement, labData: any[], chartTitle: string) {
    const chart = echarts.init(container);

    labData.sort((a, b) => a.title.localeCompare(b.title));

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
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: -40,
          interval: 0,
          fontSize: 15
        },
        axisPointer: {
          type: 'shadow'
        },
        position: 'bottom'
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

