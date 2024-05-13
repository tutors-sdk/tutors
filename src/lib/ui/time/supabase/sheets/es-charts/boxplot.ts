import type { EChartsOption } from "echarts";

export function boxplot(bgPatternImg: HTMLImageElement, userNicknames: string[], boxplotData: number[][], chartTitle: string): EChartsOption {
return {
    title: {
      text: chartTitle
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: 'category',
      data: userNicknames
    },
    xAxis: {
      type: 'value'
    },
    series: [
      {
        name: chartTitle,
        type: 'boxplot',
        data: boxplotData
      }
    ]
  };
};

export function combinedBoxplotChart(bgPatternImg: HTMLImageElement, boxplotData: any[], chartTitle: string): EChartsOption {
    return {
        title: {
          text: chartTitle
        },
        backgroundColor: {
          image: bgPatternImg,
          repeat: 'repeat'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: boxplotData.map(item => item.title), // topic titles
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Count',
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: chartTitle,
            type: 'boxplot',
            data: boxplotData.map(item => item.value), // Use the numerical data
            // Add an extra dataset for tooltip info
            dataset: {
              dimensions: ['min', 'Q1', 'median', 'Q3', 'max', 'lowNickname', 'highNickname', 'title'],
              source: boxplotData
            },
            tooltip: {
              // Now the formatter should refer to the series data indices
              formatter: function (params) {
                const dataIndex = params.dataIndex;
                const dataItem = boxplotData[dataIndex];
                let tipHtml = dataItem.title + '<br />';
                tipHtml += 'Min: ' + dataItem.value[0] + ' (' + dataItem.lowNickname + ')<br />';
                tipHtml += 'Q1: ' + dataItem.value[1] + '<br />';
                tipHtml += 'Median: ' + dataItem.value[2] + '<br />';
                tipHtml += 'Q3: ' + dataItem.value[3] + '<br />';
                tipHtml += 'Max: ' + dataItem.value[4] + ' (' + dataItem.highNickname + ')';
                return tipHtml;
              }
            }
          }
        ]
      };
};

