import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import type { Course, Lo } from '$lib/services/models/lo-types';
import { backgroundPattern, textureBackground } from '../charts/tutors-charts-background-url';
import type { Session } from '@supabase/supabase-js';
import { filterByType } from '$lib/services/models/lo-utils';
import type { EChartsOption, SeriesOption } from 'echarts';
import { piechart } from '../charts/piechart';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  BarChart,
  GridComponent,
  CanvasRenderer,
  LabelLayout,
]);

let option: EChartsOption;

const bgTexture = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTexture;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class LabPieChart {
  myChart: any;
  labs: string[];
  course: Course;
  session: Session;
  labTitleTimesMap = new Map<string, number>();
  totalTimesMap: Map<string, { timeActive: number; topicTitle: string }> = new Map();
  constructor(course: Course, session: Session) {
    this.myChart = null;
    this.labs = [];
    this.course = course;
    this.session = session;
    this.labTitleTimesMap = new Map<string, number>();
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
                outerPieData.push({ value: Math.round(lo.timeActive/2)!, name: key });
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
          data: outerPieData.filter(topic => topic.value > 0) || [{}]
        }]
      });
    }
  };

  renderChart() {
    if (this.myChart === null) {
      // If chart instance doesn't exist, create a new one
      this.myChart = echarts.init(document.getElementById('chart'));
    }

    let labs = filterByType(this.course.los, 'lab');
    let steps = filterByType(this.course.los, 'step');

    const allLabSteps = [...labs, ...steps];

    const updateMaps = (lo: Lo, userName: string, timeActive: number) => {
      let topicTitle = lo.parentLo?.type === 'lab' ? lo.parentLo?.title : lo.title;
      let loTitle = lo.title;

      // Add timeActive to the total time for the topic
      if (this.labTitleTimesMap.has(topicTitle)) {
        this.labTitleTimesMap.set(topicTitle, this.labTitleTimesMap.get(topicTitle)! + timeActive);
      }else{
        this.labTitleTimesMap.set(topicTitle, timeActive);
      }

      // // Add timeActive and topicTitle to the totalTimesMap
      if (this.totalTimesMap.has(loTitle)) {
        const existingEntry = this.totalTimesMap.get(loTitle);
        if (existingEntry) {
          existingEntry.timeActive += timeActive;
          existingEntry.topicTitle = topicTitle;
        }
      } else {
        this.totalTimesMap.set(loTitle, { timeActive, topicTitle });
      }

      // Add timeActive and topicTitle to the totalTimesMap
      // if (this.totalTimesMap.has(topicTitle)) {
      //   const existingEntry = this.totalTimesMap.get(topicTitle);
      //   if (existingEntry) {
      //     existingEntry.timeActive += timeActive;
      //   }
      // } else {
      //   this.totalTimesMap.set(topicTitle, { timeActive, loTitle });
      // }
    };

    allLabSteps.forEach((lo) => {
        const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;
        updateMaps(lo, this.session.user.user_metadata.user_name, timeActive);
      
    });

      const singleUserInnerData = Array.from(this.labTitleTimesMap.entries()).map(([title, timeActive]) => ({
        name: title,
        value: timeActive / 2
      }));

      const singleUserOuterData = Array.from(this.totalTimesMap.entries()).map(([title, timeActive]) => ({
        name: title,
        value: timeActive.timeActive / 2
      }));

      const option = piechart(bgPatternImg, this.course, [], singleUserInnerData, singleUserOuterData);
      this.myChart.setOption(option);
      this.singleUserPieClick();
     
  }
};

