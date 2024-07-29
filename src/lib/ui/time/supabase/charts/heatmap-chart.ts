import type { ChartType, GridConfig, HeatMapChartConfig, HeatMapSeriesData } from "$lib/services/types/supabase-metrics";

export function heatmap(categories: Set<string>, yAxisData: string[], series: HeatMapSeriesData, bgPatternImg: HTMLImageElement, chartTitleString: string): HeatMapChartConfig {
  let visualmapValue: number;
  let seriesArray: HeatMapSeriesData[] = [series];
  let gridConfig: GridConfig = {
    left: "30%",
    right: "30%",
    bottom: "15%",
    top: "10%",
    width: "40%", // Fixed width
    height: "80%", // Fixed height
    containLabel: false
  };

  if (series?.data) {
    if (series.name === "Lab Activity For All Users" || series.name === "Topic Activity For All Users") {
      gridConfig = {
        left: "30%",
        right: "30%",
        bottom: "15%",
        top: "10%",
        width: "40%", // Fixed width
        height: "80%", // Fixed height
        containLabel: false // Prevent resizing based on labels
      };
    } else {
      gridConfig = {
        left: "20%",
        right: "10%",
        bottom: "15%",
        top: "15%",
        width: "60%", // Fixed width
        height: "80px", // Fixed height
        containLabel: false // Prevent resizing based on labels
      };
    }
    visualmapValue = series.data.length !== 0 ? Math.max(...series.data.map((item) => item[2])) : 0;
  } else {
    visualmapValue = 0;
  }

  return {
    title: {
      top: "5%",
      left: "center",
      text: chartTitleString
    },
    tooltip: {
      position: "top"
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: "repeat"
    },
    grid: gridConfig,
    xAxis: {
      type: "category",
      data: Array.from(categories),
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 2,
        fontSize: 15,
        margin: 10 // Adjust margin to control spacing
      },
      axisTick: {
        alignWithLabel: true
      },
      axisPointer: {
        type: "shadow"
      },
      position: "bottom"
    },
    yAxis: {
      type: "category",
      data: yAxisData[0] !== undefined ? yAxisData : [],
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 0,
        fontSize: 15,
        padding: [10, 0, 10, 0] // Increase space between rows
      }
    },
    visualMap: {
      min: 0,
      max: visualmapValue,
      calculable: true,
      orient: "horizontal",
      left: "center",
      align: "auto",
      bottom: 0
    },
    series: seriesArray
  };
}
