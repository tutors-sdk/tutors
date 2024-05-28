import type { BoxplotData } from "$lib/services/types/supabase-metrics";

import * as echarts from 'echarts';

export function boxplot(bgPatternImg: HTMLImageElement, userNicknames: string[], boxplotData: number[][], chartTitle: string): echarts.EChartsOption {
  return {
    title: {
      text: chartTitle,
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat',
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (param: any) => {
        const value = param.value;
        console.log(`Tooltip data for ${param.name}:`, value);
        return [
          `${param.name}:`,
          `Min: ${value[1]}`,
          `Q1: ${value[2]}`,
          `Median: ${value[3]}`,
          `Q3: ${value[4]}`,
          `Max: ${value[5]}`,
        ].join('<br/>');
      },
    },
    yAxis: {
      type: 'category',
      data: userNicknames,
    },
    xAxis: {
      type: 'value',
    },
    series: [
      {
        name: chartTitle,
        type: 'boxplot',
        data: boxplotData,
      },
    ],
  };
}


export function combinedBoxplotChart(bgPatternImg: HTMLImageElement, boxplotData: BoxplotData[], chartTitle: string): echarts.EChartsOption {
  return {
    title: {
      text: chartTitle,
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat',
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        const dataIndex = params.dataIndex;
        const dataItem = boxplotData[dataIndex];
        let tipHtml = `${dataItem.title}<br />`;
        tipHtml += `Min: ${dataItem.value[0]} (${dataItem.lowNickname})<br />`;
        tipHtml += `Q1: ${dataItem.value[1]}<br />`;
        tipHtml += `Median: ${dataItem.value[2]}<br />`;
        tipHtml += `Q3: ${dataItem.value[3]}<br />`;
        tipHtml += `Max: ${dataItem.value[4]} (${dataItem.highNickname})`;
        return tipHtml;
      },
    },
    xAxis: {
      type: 'category',
      data: boxplotData.map((item) => item.title), // topic titles
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Time (mins)',
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: chartTitle,
        type: 'boxplot',
        data: boxplotData.map((item) => item.value),
        tooltip: {
          formatter: function (params) {
            const dataIndex = params.dataIndex;
            const dataItem = boxplotData[dataIndex];
            let tipHtml = `${dataItem.title}<br />`;
            tipHtml += `Min: ${dataItem.value[0]} (${dataItem.lowNickname})<br />`;
            tipHtml += `Q1: ${dataItem.value[1]}<br />`;
            tipHtml += `Median: ${dataItem.value[2]}<br />`;
            tipHtml += `Q3: ${dataItem.value[3]}<br />`;
            tipHtml += `Max: ${dataItem.value[4]} (${dataItem.highNickname})`;
            return tipHtml;
          },
        },
      },
    ],
  };
}
