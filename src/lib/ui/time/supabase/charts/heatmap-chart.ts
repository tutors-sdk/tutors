import type { ChartType, GridConfig, HeatMapChartConfig, HeatMapSeriesData } from "$lib/services/types/supabase-metrics";

export function heatmap(categories: Set<string>, yAxisData: string[], series: HeatMapSeriesData, bgPatternImg: HTMLImageElement, chartTitleString: string): HeatMapChartConfig {
  const cellSize = 30;
  const singleCellSize = 20;

  const numCategories = categories.size;
  const minWidthPercentage = 3; // Minimum width percentage for small number of categories
  const maxWidthPercentage = 100; // Maximum width percentage for large number of categories
  const widthPerCategory = 3;

  // Dynamically calculate the width as a percentage
  const dynamicWidthPercentage = Math.min(maxWidthPercentage, minWidthPercentage + numCategories * widthPerCategory);

  // Calculate the grid height based on the number of rows (yAxisData)
  const gridHeight = yAxisData.length * cellSize;
  const gridWidth = numCategories * cellSize;

  const singleGridHeight = yAxisData.length * singleCellSize;
  const singleGridWidth = 100 * singleCellSize;

  let visualmapValue: number;
  let seriesArray: HeatMapSeriesData[] = [series];

  let gridConfig: GridConfig;
  if (series?.data) {
    if (series.name === "student engagement for lab" || series.name === "student engagement for topic") {
      gridConfig = {
        left: "5%",
        right: gridWidth,
        containLabel: true,
        bottom: "4%",
        top: "4%",
        width: `${dynamicWidthPercentage}%`,
        height: `${gridHeight}` // Let height adjust based on the content
      };
    } else {
      gridConfig = {
        left: "5%",
        right: singleGridWidth,
        containLabel: true,
        top: "20%",
        bottom: "4%",
        height: "30%", // Fixed height
        width: `${dynamicWidthPercentage}%`
      };
    }

    // Calculate the max visual map value dynamically from series data
    if (series?.data) {
      visualmapValue = series.data.length !== 0 ? Math.max(...series.data.map((item) => item[2])) : 0;
    } else {
      visualmapValue = 0;
    }

    return {
      title: {
        top: "2%",
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
        splitArea: { show: true },
        axisLabel: {
          interval: 0,
          fontSize: 15,
          rotate: 90,
          align: "right",
          verticalAlign: "middle",
          formatter: (value: string) => (value.length > 20 ? value.slice(0, 20) + "..." : value)
        },
        axisTick: {
          alignWithLabel: true
        },
        axisPointer: {
          type: "shadow"
        },
        position: "top"
      },
      yAxis: {
        type: "category",
        data: yAxisData.length ? yAxisData : [],
        splitArea: { show: true },
        axisLabel: {
          interval: 0,
          fontSize: 15,
          padding: [10, 0, 10, 0],
          margin: 10
        }
      },
      visualMap: {
        min: 0,
        max: visualmapValue,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "1%",
        inRange: {
          color: generateColorGradient("#EDEDED", "#004F27", 20),
          type: "piecewise",
          splitNumber: 20
        }
      },
      series: seriesArray.map((serie) => ({
        ...serie,
        // Adjusting the heatmap cell size
        itemStyle: {
          normal: {
            borderColor: "#004F27",
            borderWidth: 1,
            height: 2,
            width: 2
          }
        }
      }))
    };
  }
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
      height: "20%",
      top: "30%",
      left: "5%"
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
      fontSize: 15
    },
    axisTick: {
      show: false // Disable ticks to make cells square
    },
    visualMap: {
      min: 0,
      max: Math.max(...heatmapActivities.map((item) => item.value / 2)),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "1%",
      inRange: {
        color: generateColorGradient("#EDEDED", "#004F27", 20),
        type: "piecewise",
        splitNumber: 20
      }
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

function generateColorGradient(startColor: string, endColor: string, steps: number) {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  const colors = [];
  if (!start || !end) return;

  for (let i = 0; i < steps; i++) {
    const r = interpolate(start.r, end.r, i, steps);
    const g = interpolate(start.g, end.g, i, steps);
    const b = interpolate(start.b, end.b, i, steps);
    colors.push(rgbToHex(r, g, b));
  }

  return colors;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function interpolate(start: number, end: number, step: number, steps: number) {
  return Math.round(start + ((end - start) * step) / (steps - 1));
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
