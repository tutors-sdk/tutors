import * as echarts from 'echarts/core';
import * as d3 from 'd3';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import { BoxplotChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { backgroundPattern } from '../charts/tutors-charts-background-url';
import { boxplot, combinedBoxplotChart } from '../charts/boxplot-chart';
import type { Course } from '$lib/services/models/lo-types';
import { filterByType } from '$lib/services/models/lo-utils';
import type { BoxplotData } from '$lib/services/types/supabase-metrics';
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BoxplotChart,
  CanvasRenderer
]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class LabBoxPlotChart {
  course: Course;
  userIds: string[];
  constructor(course: Course, userIds: string[]) {
    this.course = course;
    this.userIds = userIds;
  }

  prepareBoxplotData() {
    let boxplotData: number[][] = [];
    const userNicknamesSet: Set<string> = new Set();
    let labs = filterByType(this.course.los, 'lab');
    let steps = filterByType(this.course.los, 'step');
    const allLabSteps = [...labs, ...steps];
    const labActivities = new Map<string, { timeActive: number; nickname: string }[]>();
  
    // Iterate over allLabSteps to aggregate total timeActive for each step
    allLabSteps.forEach(step => {
      const title = step.parentLo?.type === 'lab' ? step.parentLo?.title : step.title;
      
      if (!labActivities.has(title)) {
        labActivities.set(title, []);
      }
  
      step.learningRecords?.forEach((lab, key) => {
        userNicknamesSet.add(key); // Collect nicknames for the y-axis
  
        if (this.userIds?.includes(key)) {
          labActivities.get(title)?.push({
            timeActive: lab.timeActive,
            nickname: key
          });
        }
      });
    });
  
    Array.from(labActivities.entries()).forEach(([title, activities]) => {
      activities.sort((a, b) => a.timeActive - b.timeActive);

      const timeActiveValues = activities.map(a => a.timeActive || 0);
  
      const min = d3.min(timeActiveValues) ?? 0;
      const q1 = d3.quantileSorted(timeActiveValues, 0.25) ?? 0;
      const median = d3.median(timeActiveValues) ?? 0;
      const q3 = d3.quantileSorted(timeActiveValues, 0.75) ?? 0;
      const max = d3.max(timeActiveValues) ?? 0;
  
      boxplotData.push([min, q1, median, q3, max]);
    });
  
    const userNicknames = Array.from(userNicknamesSet); // Convert Set to Array
    return { boxplotData, userNicknames };
  }
  
  //combined boxplot
  prepareCombinedBoxplotData(): BoxplotData[] {
    const userNicknamesSet: Set<string> = new Set();
    let labs = filterByType(this.course.los, 'lab');
    let steps = filterByType(this.course.los, 'step');
    const allLabSteps = [...labs, ...steps];
    const labActivities = new Map<string, { timeActive: number; nickname: string }[]>();

    // Aggregate counts and nicknames for each lab
    allLabSteps.forEach(lab => {
    const title = lab.parentLo?.type === 'lab' ? lab.parentLo?.title : lab.title;

    if (!labActivities.has(title)) {
      labActivities.set(title, []);
    }

    lab.learningRecords?.forEach((lab, key) => {
      // userNicknamesSet.add(key); // Collect nicknames for the y-axis

      if (this.userIds?.includes(key)) {
        labActivities.get(title)?.push({
          timeActive: lab.timeActive,
          nickname: key
        });
      }
    });
  });

    const boxplotData: BoxplotData[] = Array.from(labActivities.entries()).map(([title, activities]) => {
      activities.sort((a, b) => a.timeActive - b.timeActive);

      const timeActiveValues = activities.map(a => a.timeActive || 0);

      const lowData = activities[0] ?? { timeActive: 0, nickname: 'No Interaction' };
      const q1 = d3.quantileSorted(timeActiveValues, 0.25) ?? 0;
      const median = d3.median(timeActiveValues) ?? 0;
      const q3 = d3.quantileSorted(timeActiveValues, 0.75) ?? 0;
      const highData = activities[activities.length - 1] ?? { timeActive: 0, nickname: 'No Interaction' };

      return {
        value: [lowData.timeActive, q1, median, q3, highData.timeActive],
        title: title,
        lowNickname: lowData.nickname,
        highNickname: highData.nickname
      };
    });

    return boxplotData;
}

  renderBoxPlot(container: HTMLElement | null | undefined, boxplotData: number[][], userNicknames: string[]) {
    const chart = echarts.init(container);
    const option = boxplot(bgPatternImg, userNicknames ,boxplotData, 'Lab Activity per Student Boxplot');
    chart.setOption(option);
  }

  renderCombinedBoxplotChart(container: HTMLElement | null | undefined, boxplotData: BoxplotData[]) {
    const chartInstance = echarts.init(container);
    const option = combinedBoxplotChart(bgPatternImg, boxplotData, 'All Lab Activity Boxplot');
    chartInstance.setOption(option);
  }
}
