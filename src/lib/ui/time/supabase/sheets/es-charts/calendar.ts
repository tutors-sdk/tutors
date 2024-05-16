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
import type { Session } from '@supabase/supabase-js';
import type { CalendarMap } from '$lib/services/types/supabase-metrics';

echarts.use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);

export function calendar(session: Session, calendarMap: CalendarMap[], bgPatternImg: HTMLImageElement, currentRange: string): EChartsOption {
  return {
    title: {
      top: 30,
      left: 'center',
      text: 'GitHub Account for ' + session.user.user_metadata.user_name,
      link: 'https://www.github.com/' + session.user.user_metadata.user_name,
      target: 'self'
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    graphic: [
      {
        type: 'image',
        id: 'user-image',
        left: '5%',  // You might need to adjust this
        top: '2%',
        z: 100,
        bounding: 'raw',
        style: {
          image: session.user.user_metadata.avatar_url,  // URL to user's profile picture
          width: 50,
          height: 50
        }
      },

    ],
    responsive: true,
    maintainAspectRatio: false,
    tooltip: { position: 'top' },
    visualMap: {
      min: 0,
      max: 300, // total amount of minutes in a day
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 65,
      pieces: [
        { min: 0, max: 25, color: '#EDEDED' },
        { min: 25, max: 50, color: '#D7E5A1' },
        { min: 50, max: 75, color: '#B0D98C' },
        { min: 75, max: 100, color: '#89CC78' },
        { min: 100, max: 125, color: '#63C168' },
        { min: 125, max: 150, color: '#44B95B' },
        { min: 150, max: 175, color: '#2EA94F' },
        { min: 175, max: 200, color: '#1D9543' },
        { min: 200, max: 225, color: '#0F7C38' },
        { min: 225, max: 250, color: '#006E31' },
        { min: 250, max: 275, color: '#005E2C' },
        { min: 275, max: 300, color: '#004F27' }
      ]
    },
    calendar: {
      top: 120,
      left: '5%',
      right: '5%',
      cellSize: ['auto', 50],
      range: currentRange,
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: true }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: calendarMap.map((calendar) => ([
        echarts.time.format(calendar.date, '{yyyy}-{MM}-{dd}', false),
        Math.round(calendar.timeActive / 2) || 0
      ])) || [],
      // data: user?.calendarActivity?.map((calendar) => ([
      //   echarts.time.format(calendar.date, '{yyyy}-{MM}-{dd}', false),
      //   Math.round(calendar.metric / 2) || 0
      // ])) || [],
    },
    label: {
      show: true,
      formatter: function (params: { value: any[]; }) {
        return params.value[1]; // Display the value of the heatmap data
      }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }

};

export function calendarCombined(userId: string, calendarMap: Map<string, number>, bgPatternImg: HTMLImageElement, currentRange: string): EChartsOption {
  return {
    title: {
      top: 30,
      left: 'center',
      text: 'GitHub Account for ' + userId,
      link: 'https://www.github.com/' + userId,
      target: 'self'
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    graphic: [
      {
        type: 'image',
        id: 'user-image',
        left: '5%',  
        top: '2%',
        z: 100,
        bounding: 'raw',
        style: {
          image: '',  // URL to user's profile picture
          width: 50,
          height: 50
        }
      },

    ],
    responsive: true,
    maintainAspectRatio: false,
    tooltip: { position: 'top' },
    visualMap: {
      min: 0,
      max: 300, // total amount of minutes in a day
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 65,
      pieces: [
        { min: 0, max: 25, color: '#EDEDED' },
        { min: 25, max: 50, color: '#D7E5A1' },
        { min: 50, max: 75, color: '#B0D98C' },
        { min: 75, max: 100, color: '#89CC78' },
        { min: 100, max: 125, color: '#63C168' },
        { min: 125, max: 150, color: '#44B95B' },
        { min: 150, max: 175, color: '#2EA94F' },
        { min: 175, max: 200, color: '#1D9543' },
        { min: 200, max: 225, color: '#0F7C38' },
        { min: 225, max: 250, color: '#006E31' },
        { min: 250, max: 275, color: '#005E2C' },
        { min: 275, max: 300, color: '#004F27' }
      ]
    },
    calendar: {
      top: 120,
      left: '5%',
      right: '5%',
      cellSize: ['auto', 50],
      range: currentRange,
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: true }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: Array.from(calendarMap).map(([date, timeActive]) => ([
        echarts.time.format(date, '{yyyy}-{MM}-{dd}', false),
        Math.round(timeActive / 2) || 0
      ])) || [],
      // data: user?.calendarActivity?.map((calendar) => ([
      //   echarts.time.format(calendar.date, '{yyyy}-{MM}-{dd}', false),
      //   Math.round(calendar.metric / 2) || 0
      // ])) || [],
    },
    label: {
      show: true,
      formatter: function (params: { value: any[]; }) {
        return params.value[1]; // Display the value of the heatmap data
      }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }

};
