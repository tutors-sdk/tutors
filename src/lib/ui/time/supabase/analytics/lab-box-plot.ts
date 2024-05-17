import * as echarts from 'echarts/core';
import * as d3 from 'd3';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import { BoxplotChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { backgroundPattern } from '../charts/tutors-charts-background-url';
import { boxplot, combinedBoxplotChart } from '../charts/boxplot-chart';
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BoxplotChart,
  CanvasRenderer
]);

const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export class LabBoxPlotChart {
  prepareBoxplotData(userDataMap) {
    const boxplotData = [];
    const userNicknames = [];

    userDataMap.forEach((userData, nickname) => {
      userNicknames.push(nickname); // Collect nicknames for the y-axis

      const counts = userData?.labActivity.map(activity => activity.count);
      counts.sort((a, b) => a - b);

      const min = d3.min(counts);
      const q1 = d3.quantileSorted(counts, 0.25);
      const median = d3.median(counts);
      const q3 = d3.quantileSorted(counts, 0.75);
      const max = d3.max(counts);

      boxplotData.push([min, q1, median, q3, max]);
    });

    return { boxplotData, userNicknames };
  }

  //combined boxplot
  prepareCombinedBoxplotData(data) {
    const labActivities = new Map();

    // Aggregate counts and nicknames for each lab
    data.forEach(user => {
      user?.labActivity.forEach(lab => {
        if (!labActivities.has(lab.title)) {
          labActivities.set(lab.title, []);
        }
        // Push an object containing count and nickname
        labActivities.get(lab.title).push({ count: lab.count, nickname: user.nickname });
      });
    });

    const boxplotData = Array.from(labActivities).map(([title, activities]) => {
      activities.sort((a, b) => a.count - b.count);
      const lowData = activities[0];
      const q1 = d3.quantileSorted(activities.map(a => a.count), 0.25);
      const median = d3.quantileSorted(activities.map(a => a.count), 0.5);
      const q3 = d3.quantileSorted(activities.map(a => a.count), 0.75);
      const highData = activities[activities.length - 1];
      // Convert the data into the format expected by ECharts
      return {
        value: [lowData.count, q1, median, q3, highData.count],
        title: title, // Keep the title for xAxis labels
        lowNickname: lowData.nickname,
        highNickname: highData.nickname
      };
    });

    // Sort by median
    boxplotData.sort((a, b) => a.median - b.median);

    return boxplotData;
  }

  renderBoxPlot(container, boxplotData, userNicknames) {
    const chart = echarts.init(container);
    const option = boxplot(bgPatternImg, userNicknames ,boxplotData, 'Lab Activity per Student Boxplot');
    chart.setOption(option);
  }

  renderCombinedBoxplotChart(container, boxplotData) {
    const chartInstance = echarts.init(container);

    const option = combinedBoxplotChart(bgPatternImg, boxplotData, 'All Lab Activity Boxplot');

    chartInstance.setOption(option);
    chartInstance.resize();       // Force a resize to ensure proper layout
  }
}




