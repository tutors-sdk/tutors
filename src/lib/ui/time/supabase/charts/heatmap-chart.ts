import type { HeatMapSeriesData } from "$lib/services/types/supabase-metrics";
import type { EChartsOption } from "echarts";

export function heatmap(categories: Set<string>, yAxisData: string[], series: HeatMapSeriesData[], bgPatternImg: HTMLImageElement, chartTitleString: string): EChartsOption {
  let visualmapValue: number;
  let gridConfig;


  if (series[0]?.data) {
    if(series[0].name === 'Lab Activity For All Users' || series[0].name === 'Topic Activity For All Users'){
    gridConfig = {
      left: '30%',
      right: '30%',
      bottom: '15%',
      top: '10%',
      width: '40%',  // Fixed width
      height: '80%',  // Fixed height
      containLabel: false  // Prevent resizing based on labels
    };
      
  }else{
    gridConfig = {
      left: '20%',
      right: '10%',
      bottom: '15%',
      top: '15%',
      width: '60%',  // Fixed width
      height: '80px',  // Fixed height
      containLabel: false  // Prevent resizing based on labels
    };
  }
    
    visualmapValue = series[0].data.length !== 0 ? Math.max(...series[0].data.map(item => item[2])) : 0;
  } else if (series?.data) {
    gridConfig = {
      left: '30%',
      right: '30%',
      bottom: '15%',
      top: '15%',
      width: '40%',  // Fixed width
      height: '40%',  // Fixed height
      containLabel: false  // Prevent resizing based on labels
    };
    visualmapValue = series.data.length !== 0 ? Math.max(...series.data.map(item => item[2])) : 0;
  } else {
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
    grid: gridConfig,
    xAxis: {
      type: 'category',
      data: Array.from(categories),
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 1,
        fontSize: 15,
        margin: 10, // Adjust margin to control spacing
      },
      axisTick: {
        alignWithLabel: true
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
        fontSize: 15,
        padding: [10, 0, 10, 0], // Increase space between rows
      },
    },
    visualMap: {
      min: 0,
      max: visualmapValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
    },
    series: series
  }
};
