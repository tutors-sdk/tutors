import type { BoxplotChartConfig, ChartType } from "$lib/services/types/supabase-metrics";
import type { EChartsOption } from "echarts";

export function barchart(piePatternImg: string, bgPatternImg: string, chartData: UserMetric[]): BoxplotChartConfig {
  let type: ChartType = "bar"; // OK
  return {
    backgroundColor: {
      image: bgPatternImg,
      repeat: "repeat"
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      data: chartData.map((user) => user.nickname)
    },
    series: [
      {
        type: type,
        data: chartData.map((user) => Math.round(user.duration / 2) || 0),
        itemStyle: {
          color: {
            image: piePatternImg,
            repeat: "repeat"
          },
          borderWidth: 3,
          borderColor: "#235894"
        }
      }
    ],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} mins"
    }
  };
}
