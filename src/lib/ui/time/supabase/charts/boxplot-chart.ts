import type { BoxplotData, BoxplotChartConfig } from "$lib/services/types/supabase-metrics";
import * as echarts from "echarts";

export function boxplot(bgPatternImg: HTMLImageElement, userNicknames: string[], boxplotData: number[][], chartTitle: string): BoxplotChartConfig {
  // Determine the min/max range from boxplotData for proper scaling
  const yMin = Math.min(...boxplotData.flat()); // Get the minimum value across all data points
  const yMax = Math.max(...boxplotData.flat()); // Get the maximum value across all data points

  return {
    title: {
      text: chartTitle
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: "repeat"
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow"
      },
      formatter: (param: any) => {
        return [`${param.name}:`, `Min: ${param.value[1]}`, `Q1: ${param.value[2]}`, `Median: ${param.value[3]}`, `Q3: ${param.value[4]}`, `Max: ${param.value[5]}`].join("<br/>");
      }
    },
    xAxis: {
      type: "value", // Numeric axis for the values (flipped to x-axis)
      name: "Time Active (mins)", // Moved to xAxis since it's now horizontal
      min: Math.floor(yMin * 0.9), // Set xAxis minimum slightly lower than the smallest value
      max: Math.ceil(yMax * 1.1), // Set xAxis maximum slightly higher than the largest value
      axisLabel: {
        formatter: "{value} mins",
        fontSize: 15 // Label indicating that the axis represents minutes
      },
      splitLine: {
        show: true // Show grid lines for better readability
      }
    },
    grid: {
      height: "80%", // Increase the height of the grid to accommodate the y-axis labels
      left: "4%",
      right: "5%"
    },
    yAxis: {
      type: "category", // Category axis for student names (flipped to y-axis)
      data: userNicknames, // Ensure userNicknames appear on the y-axis
      name: "Students (metrics are based on a global context)", // Label for the student names
      boundaryGap: true, // Gap between categories for better spacing
      axisLabel: {
        fontSize: 13 // Label indicating that the axis represents minutes
      }
    },
    series: [
      {
        name: chartTitle,
        type: "boxplot",
        data: boxplotData, // Boxplot data (array of [min, Q1, median, Q3, max])
        tooltip: {
          formatter: (param: any) => {
            const value = param.value;
            return [`${param.name}:`, `Min: ${value[1]}`, `Q1: ${value[2]}`, `Median: ${value[3]}`, `Q3: ${value[4]}`, `Max: ${value[5]}`].join("<br/>");
          }
        }
      }
    ]
  };
}

export function combinedBoxplotChart(bgPatternImg: HTMLImageElement, boxplotData: BoxplotData[], chartTitle: string): echarts.EChartsOption {
  return {
    title: {
      text: chartTitle
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: "repeat"
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow"
      },
      formatter: function (params) {
        const dataIndex = params.dataIndex;
        const dataItem = boxplotData[dataIndex];
        let tipHtml = `${dataItem.name}<br />`;
        tipHtml += `Min: ${dataItem.value[0]} (${dataItem.lowNickname})<br />`;
        tipHtml += `Q1: ${dataItem.value[1]}<br />`;
        tipHtml += `Median: ${dataItem.value[2]}<br />`;
        tipHtml += `Q3: ${dataItem.value[3]}<br />`;
        tipHtml += `Max: ${dataItem.value[4]} (${dataItem.highNickname})`;
        return tipHtml;
      }
    },
    grid: {
      left: "4%",
      right: "10%"
    },
    xAxis: {
      type: "category",
      data: boxplotData.map((item) => item.name), // topic titles
      boundaryGap: true,
      nameGap: 10,
      axisLabel: {
        fontSize: 15 // Label indicating that the axis represents minutes
      },
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      name: "Time (mins)",
      splitArea: {
        show: true
      },
      axisLabel: {
        formatter: "{value} mins",
        fontSize: 13 // Label indicating that the axis represents minutes
      }
    },
    series: [
      {
        name: chartTitle,
        type: "boxplot",
        data: boxplotData.map((item) => item.value),
        tooltip: {
          formatter: function (params) {
            const dataIndex = params.dataIndex;
            const dataItem = boxplotData[dataIndex];
            let tipHtml = `${dataItem.name}<br />`;
            tipHtml += `Min: ${dataItem.value[0]} (${dataItem.lowNickname})<br />`;
            tipHtml += `Q1: ${dataItem.value[1]}<br />`;
            tipHtml += `Median: ${dataItem.value[2]}<br />`;
            tipHtml += `Q3: ${dataItem.value[3]}<br />`;
            tipHtml += `Max: ${dataItem.value[4]} (${dataItem.highNickname})`;
            return tipHtml;
          }
        }
      }
    ]
  };
}
