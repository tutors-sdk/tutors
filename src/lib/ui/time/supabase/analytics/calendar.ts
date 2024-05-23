import * as echarts from 'echarts/core';
import {
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { calendar, calendarCombined } from '../charts/calendar-chart';
import { backgroundPattern } from '../charts/tutors-charts-background-url';
import { GraphicComponent } from 'echarts/components';
import { tutorsAnalyticsLogo } from '../charts/personlised-logo';
import type { CalendarMap } from '$lib/services/types/supabase-metrics';
import type { Course } from '$lib/services/models/lo-types';
import type { Session } from '@supabase/supabase-js';
import { getUser } from '$lib/services/utils/supabase-utils';

echarts.use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer,
  GraphicComponent
]);

let option: EChartsOption;
let currentRange: string = new Date().getFullYear().toString();  // Initially set to a default year

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class CalendarChart {
  chartRendered: boolean;
  myChart: null;
  chartDom: null;
  myCharts: {};
  constructor() {
    this.chartRendered = false;
    this.myChart = null;
    this.chartDom = null;
    this.myCharts = {};
  }

  createChartContainer(containerId: string) {
    const container = document.createElement('div');
    container.id = `chart-${containerId}`;
    container.style.width = '100%';
    container.style.height = '100%'; // Set a fixed height or make it dynamic as needed
    const parentContainer = document.getElementById('heatmap-container') || document.body;
    parentContainer.appendChild(container);
    return container;
  };

  clickMonth(chart) {
    chart.on('click', (params) => {
      // Check the current range and toggle it
      if (currentRange.length === 4) {  // Only the year is currently set
        const date = new Date(params.data[0]);
        currentRange = echarts.time.format(date, '{yyyy}-{MM}', false); // Change to specific month
      } else {
        currentRange = currentRange.substring(0, 4); // Reset to only the year
      }

      chart.setOption({
        calendar: {
          range: currentRange,
        },
      });
    });
  };

  getChartContainer(nickname: string) {
    return document.getElementById(`chart-${nickname}`);
  };

  renderChart(course: Course, timeActiveMap: Map<string, Map<string, number>>, session: Session) {
    const chartContainer = this.getChartContainer(session.user.user_metadata.user_name);

    if (!chartContainer) {
      console.error('Chart container not found for user:', session.user.user_metadata.user_name);
      return;
    }

    const callendarMapCollection: CalendarMap[] = [];
    for (const [key, value] of timeActiveMap.entries()) {
      if (key.includes(session.user.user_metadata.user_name)) {
        for (const [date, timeActive] of value.entries()) {
          const calendarMap: CalendarMap = {
            date: date,
            timeActive: timeActive
          };
          callendarMapCollection.push(calendarMap);
        }
      }
    };

    const chart = echarts.init(chartContainer);
    if (!sessionStorage.getItem('logoShown')) {
      chart.setOption(tutorsAnalyticsLogo("Next Tutors Analytics"));
      sessionStorage.setItem('logoShown', 'true');
      setTimeout(() => {
        // Prepare the actual data settings

        const option = calendar(session, callendarMapCollection, bgPatternImg, currentRange);

        chart.setOption(option, true); // The 'true' parameter clears the previous setting completely before applying new options

        // Explicitly refresh the chart to ensure updates are visiw ble
        chart.hideLoading();  // Hide loading overlay if used
        chart.resize();       // Force a resize to ensure proper layout
      }, 2900);

    } else {
      this.myCharts[session.user.user_metadata.user_name] = chart;
      // Prepare the actual data settings
      const option = calendar(session, callendarMapCollection, bgPatternImg, currentRange);

      chart.setOption(option, true); // The 'true' parameter clears the previous setting completely before applying new options

    }

    this.clickMonth(chart);
  };

  async renderCombinedChart(course: Course, calendarMap: Map<string, number>, userId: string) {
    const chartContainer = this.getChartContainer(userId);

    if (!chartContainer) {
      console.error('Chart container not found for user:', userId);
      return;
    }

    const chart = echarts.init(chartContainer);
    const avatarUrl = await getGithubAvatarUrl(userId);
    const fullName = await getUser(userId);
    const option = calendarCombined(userId, calendarMap, bgPatternImg, currentRange, avatarUrl, fullName);

    chart.setOption(option, true);
  }
};

async function getGithubAvatarUrl(username:string) {
  const url = `https://api.github.com/users/${username}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`User not found: ${response.status}`);
    }
    const data = await response.json();
    return data.avatar_url;
  } catch (error) {
    console.error('Error fetching the avatar URL:', error);
    return null;
  }
};
