import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import type { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import type { HeatMapSeriesData } from '$lib/services/types/supabase-metrics';

echarts.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);

export function heatmap(categories: Set<string>, yAxisData: string[], series: HeatMapSeriesData[], bgPatternImg: HTMLImageElement, chartTitleString: string): EChartsOption {
  let visualmapValue: number;

  if (series[0]?.data) {
    visualmapValue = series[0].data.length !== 0 ? Math.max(...series[0].data.map(item => item[2])) : 0;
  } else if (series?.data) {
    visualmapValue = series.data.length !== 0 ? Math.max(...series.data.map(item => item[2])) : 0;
  }else {
    visualmapValue = 0;
  }

  return {
    title: {
      top: '5%',
      left: 'center',
      text: chartTitleString,
    },
    tooltip: {
      position: 'top'
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '10%',
      height: '50%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from(categories),
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
      data: yAxisData[0] !== undefined ? yAxisData : '',
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 0,
        fontSize: 15
      },
    },
    visualMap: {
      min: 0,
      max: visualmapValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '25%'
    },
    series: series
  }
};