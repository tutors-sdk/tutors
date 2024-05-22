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
import type { LabStepData, OuterPieData } from '$lib/services/types/supabase-metrics';

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
  //labTitleTimesMap = new Map<string, number>();
  //totalTimesMap: Map<string, LabStepData> = new Map();
  totalTimesMap: Map<string, LabStepData> = new Map();
  labTitleTimesMap: Map<string, number> = new Map();

  constructor(course: Course, session: Session) {
    this.myChart = null;
    this.labs = [];
    this.course = course;
    this.session = session;
    //this.labTitleTimesMap = new Map<string, number>();
    //this.totalTimesMap = new Map<string, LabStepData>();
    this.labTitleTimesMap = new Map();
    this.totalTimesMap = new Map();
  }

  singleUserPieClick() {
    if (this.myChart !== null) {
      // Remove any existing click listeners to prevent multiple handlers
      this.myChart.off('click');
      this.myChart.on('click', (params: { seriesName: string; name: string; }) => {
        if (params.seriesName === 'Inner Pie') {
          const outerPieData: OuterPieData[] = []; // Reset outerPieData array

          // Find the corresponding data for the clicked inner pie slice
          this.totalTimesMap.forEach((lo, key) => {
            if (lo.title === params.name) {
              if (lo.aggregatedTimeActive !== 0) {
                outerPieData.push({ value:lo.aggregatedTimeActive!, name: key, type: lo.loType });
              }
            }
          });
          this.populateOuterPieData(outerPieData);
        }
      });
    };
  }

  populateOuterPieData(outerPieData: OuterPieData[]) {
    // Update the data for the outer pie chart
    const chartInstance = echarts.getInstanceByDom(document.getElementById('chart'));
    if (chartInstance) {
      chartInstance.setOption({
        series: [{
          name: "Outer Pie",
          data: outerPieData
        }]
      });
    }
  }

  renderChart() {
    if (!this.myChart) {
      // Create a new chart instance if it doesn't exist
      this.myChart = echarts.init(document.getElementById('chart'));
  } else {
      // Clear the previous chart to prevent aggregation issues
      this.myChart.clear();
  }


    let labs = filterByType(this.course.los, 'lab');
    let steps = filterByType(this.course.los, 'step');

    const allLabSteps = [...labs, ...steps];

    const updateMaps = (lo: Lo, userName: string, timeActive: number) => {
      let topicTitle = lo.type === 'lab' ? lo.title : lo.parentLo!.title;
      let loTitle = lo.id;

      // Add timeActive to the total time for the topic
      if (this.labTitleTimesMap.has(topicTitle)) {
        this.labTitleTimesMap.set(topicTitle, this.labTitleTimesMap.get(topicTitle)! + timeActive);
      } else {
        this.labTitleTimesMap.set(topicTitle, timeActive);
      }

      const existingEntry = this.totalTimesMap.get(loTitle);
        if (existingEntry) {
            existingEntry.aggregatedTimeActive += timeActive;
        } else {
            this.totalTimesMap.set(loTitle, { aggregatedTimeActive: timeActive, title: topicTitle, loType: lo.type});
        }
    };

    allLabSteps.forEach((lo) => {
      const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;
      updateMaps(lo, this.session.user.user_metadata.user_name, timeActive);
    });

    const singleUserInnerData = Array.from(this.labTitleTimesMap.entries()).map(([title, timeActive]) => ({
      name: title,
      value: timeActive 
    }));

    const singleUserOuterData = Array.from(this.totalTimesMap.entries()).map(([title, object]) => ({
      name: title,
      value: object.aggregatedTimeActive 
    }));

    const option = piechart(bgPatternImg, this.course, [], singleUserInnerData, singleUserOuterData);
    this.myChart.setOption(option);
    this.singleUserPieClick();

  }
};

