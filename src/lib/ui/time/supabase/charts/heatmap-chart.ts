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
    if (series.name === "student engagement for lab" || series.name === "student engagement for topic") {
      gridConfig = {
        left: "15%",
        right: "10%",
        bottom: "10%",
        top: "10%",
        width: "80%", // Fixed width
        height: "80%", // Fixed height
        containLabel: false // Prevent resizing based on labels
      };
    } else {
      gridConfig = {
        left: "15%",
        right: "15%",
        bottom: "15%",
        top: "15%",
        width: "80%", // Fixed width
        height: "80px", // Fixed height
        containLabel: true // Prevent resizing based on labels
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
        interval: 3,
        fontSize: 12,
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

export function renderCombinedChart(heatmapActivities: any[], bgPatternImg: HTMLImageElement, chartTitle: string) {
  const heatmapData = heatmapActivities.map((item, index) => [index, 0, Math.round(item.value / 2)]);
  const titles = heatmapActivities.map((item) => item.title);

  return {
    title: {
      top: "15%",
      left: "center",
      text: chartTitle
    },
    tooltip: {
      position: "bottom",
      formatter: function (params: { dataIndex: number }) {
        const dataIndex = params.dataIndex;
        const dataItem = heatmapActivities[dataIndex];
        if (dataItem) {
          let tipHtml = dataItem.title + "<br />";
          tipHtml += "Min: " + dataItem.lowValue + " (" + dataItem.lowNickname + ")<br />";
          tipHtml += "Max: " + dataItem.highValue + " (" + dataItem.highNickname + ")";
          return tipHtml;
        }
        return "";
      }
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: "repeat"
    },
    grid: {
      height: "30%",
      top: "30%"
    },
    xAxis: {
      type: "category",
      data: titles
    },
    yAxis: {
      type: "category",
      data: [""]
    },
    axisLabel: {
      interval: 0,
      fontSize: 12
    },
    visualMap: {
      min: 0,
      max: Math.max(...heatmapActivities.map((item) => item.value / 2)),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%"
    },
    series: [
      {
        name: "Value",
        type: "heatmap",
        data: heatmapData,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };
}
