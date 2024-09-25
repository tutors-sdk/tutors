import * as echarts from "echarts/core";
import { TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { HeatmapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import { calendar, calendarCombined } from "../charts/calendar-chart";
import { backgroundPattern } from "../charts/tutors-charts-background-url";
import { GraphicComponent } from "echarts/components";
import { tutorsAnalyticsLogo } from "../charts/personlised-logo";
import type { CalendarMap } from "$lib/services/types/supabase-metrics";
import type { Course } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";
import { getGithubAvatarUrl } from "$lib/services/utils/supabase-utils";
import { generateStudent, getDefaultAvatar } from "../../../../../routes/(time)/simulate/generateStudent";

echarts.use([TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent, HeatmapChart, CanvasRenderer, GraphicComponent]);

let option: EChartsOption;
let currentRange: string = new Date().getFullYear().toString(); // Initially set to a default year

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class CalendarChart {
  chartRendered: boolean;
  myChart: any;
  chartDom: any;
  myCharts: { [key: string]: any };
  medianCalendarRendered: boolean;
  userAvatarsUseridsMap: Map<string, [string, string]>;

  constructor(userAvatarsUseridsMap: Map<string, [string, string]>) {
    this.chartRendered = false;
    this.myChart = null;
    this.chartDom = null;
    this.myCharts = {};
    this.medianCalendarRendered = false;
    this.userAvatarsUseridsMap = userAvatarsUseridsMap;
  }

  createChartContainer(containerId: string) {
    const container = document.createElement("div");
    container.id = `chart-${containerId}`;
    container.style.width = "100%";
    container.style.height = "100%"; // Set a fixed height or make it dynamic as needed
    const parentContainer = document.getElementById("heatmap-container") || document.body;
    parentContainer.appendChild(container);
    return container;
  }

  // clickMonth() {
  //   if (this.myChart) {
  //     this.myChart.on('click', (params) => {
  //       // Check the current range and toggle it
  //       if (currentRange.length === 4) {  // Only the year is currently set
  //         const date = new Date(params.data[0]);
  //         currentRange = echarts.time.format(date, '{yyyy}-{MM}', false); // Change to specific month
  //       } else {
  //         currentRange = currentRange.substring(0, 4); // Reset to only the year
  //       }

  //       this.myChart.setOption({
  //         calendar: {
  //           range: currentRange,
  //         },
  //       });
  //     });
  //   }
  // };

  getChartContainer(nickname: string) {
    return document.getElementById(`chart-${nickname}`);
  }

  renderChart(timeActiveMap: Map<string, Map<string, number>>, session: Session) {
    const chartContainer = this.getChartContainer(session.user.user_metadata.user_name);

    if (!chartContainer) {
      console.error("Chart container not found for user:", session.user.user_metadata.user_name);
      return;
    }

    const callendarMapCollection: CalendarMap[] = [];
    for (const [key, value] of timeActiveMap.entries()) {
      if (key.includes(session.user.user_metadata.user_name)) {
        for (const [date, timeActive] of value.entries()) {
          const calendarMap: CalendarMap = {
            date: date,
            timeActive: timeActive
          };
          callendarMapCollection.push(calendarMap);
        }
      }
    }

    const chart = echarts.init(chartContainer);
    if (!sessionStorage.getItem("logoShown")) {
      chart.setOption(tutorsAnalyticsLogo("Next Tutors Analytics"));
      sessionStorage.setItem("logoShown", "true");
      setTimeout(() => {
        const option = calendar(session, callendarMapCollection, bgPatternImg, currentRange);

        chart.setOption(option, true); // The 'true' parameter clears the previous setting completely before applying new options

        chart.hideLoading(); // Hide loading overlay if used
        chart.resize(); // Force a resize to ensure proper layout
      }, 2900);
    } else {
      this.myCharts[session.user.user_metadata.user_name] = chart;
      const option = calendar(session, callendarMapCollection, bgPatternImg, currentRange);

      chart.setOption(option, true); // The 'true' parameter clears the previous setting completely before applying new options
    }

    //this.clickMonth();
  }

  async renderCombinedChart(calendarMap: Map<string, number>, userId: string) {
    const chartContainer = this.getChartContainer(userId);

    if (!chartContainer) {
      console.error("Chart container not found for user:", userId);
      return;
    }

    const chart = echarts.init(chartContainer);
    const [fullName, avatarUrl] = this.userAvatarsUseridsMap?.get(userId) || [undefined, undefined];
    // const fullName = this.userNamesUseridsMap.get(userId) || userId;
    // const avatarUrl = this.userAvatarsUseridsMap.get(userId) || "";
    const option = calendarCombined(userId, calendarMap, bgPatternImg, currentRange, avatarUrl ?? getDefaultAvatar(), fullName ?? userId);

    chart.setOption(option, true);

    //const fullname = (await getUser(userId)) || userId; //real
    //const fullname = (await generateStudent()).fullName; //fake

    //const student = await generateStudent(); //generate fake student
    // const avatarUrl = await getGithubAvatarUrl(userId);
    // const fullName = await getUser(userId);
    // const option = calendarCombined(userId, calendarMap, bgPatternImg, currentRange, avatarUrl, fullName);

    // chart.setOption(option, true);
  }

  // New method to render the additional calendar for median timeactive values
  renderMedianTimeCalendar(medianTime: Map<string, number>) {
    if (this.medianCalendarRendered) {
      // If the median calendar has already been rendered, update its data
      const chart = echarts.getInstanceByDom(document.getElementById("median-calendar"));
      if (chart) {
        const medianCalendarData = Array.from(medianTime.entries()).map(([date, mediantimeactive]) => ({
          date,
          mediantimeactive
        }));
        const option: EChartsOption = {
          series: [
            {
              data: medianCalendarData.map((item) => [echarts.time.format(item.date, "{yyyy}-{MM}-{dd}", false), item.mediantimeactive])
            }
          ]
        };
        chart.setOption(option);
      }
      return;
    }

    const medianCalendarContainer = document.getElementById("median-chart");

    const chart = echarts.init(medianCalendarContainer);
    const option: EChartsOption = {
      title: {
        text: "Median Time Active Per Day",
        left: "center"
      },
      tooltip: {
        trigger: "item"
      },
      backgroundColor: {
        image: bgPatternImg,
        repeat: "repeat"
      },
      visualMap: {
        min: 0,
        max: Math.max(...medianTime.map((item) => item.mediantimeactive)),
        type: "piecewise",
        orient: "horizontal",
        left: "center",
        top: 65,
        pieces: [
          { min: 0, max: 25, color: "#EDEDED" },
          { min: 25, max: 50, color: "#D7E5A1" },
          { min: 50, max: 75, color: "#B0D98C" },
          { min: 75, max: 100, color: "#89CC78" },
          { min: 100, max: 125, color: "#63C168" },
          { min: 125, max: 150, color: "#44B95B" },
          { min: 150, max: 175, color: "#2EA94F" },
          { min: 175, max: 200, color: "#1D9543" },
          { min: 200, max: 225, color: "#0F7C38" },
          { min: 225, max: 250, color: "#006E31" },
          { min: 250, max: 275, color: "#005E2C" },
          { min: 275, max: 1000, color: "#004F27" }
        ]
      },
      calendar: {
        top: 120,
        left: "5%",
        right: "5%",
        cellSize: ["auto", 20],
        range: currentRange,
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: true }
      },
      series: [
        {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: medianTime.map((item) => [echarts.time.format(item.date, "{yyyy}-{MM}-{dd}", false), item.mediantimeactive]),
          label: {
            show: true,
            formatter: "{@[1]}", // Display the mediantimeactive value in the cell
            color: "#000",
            fontSize: 10
          }
        }
      ]
    };

    chart.setOption(option);
    this.medianCalendarRendered = true;
  }
}
