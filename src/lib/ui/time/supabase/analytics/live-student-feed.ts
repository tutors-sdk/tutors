import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { TooltipComponent, GridComponent, GraphicComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { textureBackground, backgroundPattern } from "../charts/tutors-charts-background-url";
import { barchart } from "../charts/barchart";

echarts.use([BarChart, TooltipComponent, GridComponent, GraphicComponent, CanvasRenderer]);

echarts.use([GraphicComponent, CanvasRenderer]);

const bgTextureImg = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTextureImg;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class LiveStudentFeedChart {
  constructor(users, courseName) {
    // If users is already a Map, use it directly; otherwise, convert it to a Map
    this.users = users instanceof Map ? users : new Map(Object.entries(users));
    this.chart = null;
    this.courseId = courseName;
    this.loadingIndicator = document.getElementById("loadingIndicator");
  }

  showLoading() {
    this.loadingIndicator.style.display = "block";
  }

  hideLoading() {
    this.loadingIndicator.style.display = "none";
  }

  renderCharts() {
    this.showLoading();

    const container = this.getChartContainer();
    if (!container) return;

    this.chart = echarts.init(container);
    this.updateChartData(Array.from(this.users.values()));
    this.chart.showLoading();
    this.subscribeToDataUpdates();
  }

  getChartContainer() {
    const container = document.getElementById("heatmap-container");
    if (container) {
      container.style.width = "100%";
      container.style.height = "100%";
    }
    return container;
  }

  updateChartData(usersData) {
    const chartData = usersData.map((user) => user[1] || user);
    let option = barchart(piePatternImg, bgPatternImg, chartData);
    this.chart.setOption(option, true);
  }

  subscribeToDataUpdates() {
    studentInteractionsUpdates((updatedUser) => {
      const userKey = updatedUser.student_id;
      if (updatedUser.course_id === this.courseId) {
        this.users.forEach((user, key) => {
          if (user.nickname === userKey) {
            this.users.set(key, { ...user, ...updatedUser });
          } else {
            this.users.set(key, user);

            this.updateChartData(Array.from(this.users));
          }
        });
      }
      this.chart.hideLoading();
      this.hideLoading();
    });
  }
}
