import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import type { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);

export function heatmap(categories: any, yAxisData: any, series: any, bgPatternImg: HTMLImageElement, chartTitleString: string): EChartsOption {
  const visualmapValue = series[0]?.data.length !== 0 ? Math.max(...series[0].data?.map(item => item[2])) : 0;
  // const visualmapValue = series?.data.length !== 0 ? Math.max(...series.data?.map(item => item[2])) : 0;

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
      bottom: '20%',
      top: '10%',
      height: '30%',
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