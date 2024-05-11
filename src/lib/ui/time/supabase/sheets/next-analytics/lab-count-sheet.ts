import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import type { Lo } from '$lib/services/models/lo-types';
import { backgroundPattern, textureBackground } from '../next-charts/next-charts-background-url';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  BarChart,
  GridComponent,
  CanvasRenderer,
  LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
  echarts.EChartsOption
>;

let option: EChartsOption;

const bgTexture = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTexture;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class LabCountSheet {
  private myChart: echarts.ECharts | null;
  private listOfLabs: string[];

  constructor(userData: UserMetric) {
    this.myChart = null;
    this.listOfLabs = [];
    this.user = userData;
  }

  populateCols(los: Lo[]) {
    this.listOfLabs = los.map(lab => lab.title).filter(Boolean);
  }

  createChartContainer(containerId: string) {
    const container = document.createElement('div');
    container.id = `${containerId}`;
    document.body.appendChild(container);  // Append the container to the body or a specific parent element
    return container;
  }

  renderChart() {
    const chartId = this.user ? `chart-${this.user?.nickname}` : 'chart';
    let chartContainer = document.getElementById(chartId);

    // Create chart container dynamically if it doesn't exist
    if (!chartContainer) {
      chartContainer = this.createChartContainer(chartId)
    }

    // Initialise chart in the specific container
    this.myChart = echarts.init(chartContainer);

    const grid = {
      top: 50,
      width: '40%',
      bottom: '30%',
      left: 34,
      containLabel: true
    };

    const series: (echarts.PieSeriesOption | echarts.BarSeriesOption)[] = [];

    this.configurePieSeries(series);
    this.configureBarSeries(series);

    this.configureOption(series, grid);

    this.configureClickHandler();

    this.myChart.setOption(option);
  }

  private configurePieSeries(series: (echarts.PieSeriesOption | echarts.BarSeriesOption)[]) {
    const pieSeries: echarts.PieSeriesOption = {
      name: 'Inner Pie',
      type: 'pie',
      selectedMode: 'single',
      center: ['70%', '70%'],
      bottom: '45%',
      radius: [0, '40%'],
      color: [
        '#4d4dff', '#6699ff', '#99ccff', '#b3d9ff', '#ccffff',
        '#ccffcc', '#99ff99', '#66cc66', '#339933', '#006600'
      ],
      label: {
        position: 'inner',
        fontSize: 14
      },
      labelLine: {
        show: false
      },
      data: this.user?.labActivity.map((lab) => ({
        value: Math.round(lab.count / 2) || 0,
        name: lab.title
      })) || []
    };
    series.push(pieSeries);
    series.push({
      name: 'Outer Pie',
      type: 'pie',
      center: ['70%', '70%'],
      bottom: '45%',
      radius: ['90%', '80%'],
      labelLine: { length: 3 },
      label: {
        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}:}{c} mins  {per|{d}%}  ',
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          a: { color: '#6E7079', lineHeight: 22, align: 'center' },
          hr: { borderColor: '#8C8D8E', width: '100%', borderWidth: 1, height: 0 },
          b: { color: '#4C5058', fontSize: 14, fontWeight: 'bold', lineHeight: 33 },
          per: { color: '#fff', backgroundColor: '#4C5058', padding: [3, 4], borderRadius: 4 }
        }
      },
      data: []
    });
  }

  private configureBarSeries(series: (echarts.PieSeriesOption | echarts.BarSeriesOption)[]) {
    series.push({
      name: 'Bar Chart',
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      label: {
        show: false,
        formatter: (params: any) => `{a|${params.name}}\n{hr|}\n  {b|${Math.round(params.value) / 2}} mins  `,
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          a: { color: '#6E7079', lineHeight: 22, align: 'center' },
          hr: { borderColor: '#8C8D8E', width: '100%', borderWidth: 1, height: 0 },
          b: { color: '#4C5058', fontSize: 14, fontWeight: 'bold', lineHeight: 33 },
          per: { color: '#fff', backgroundColor: '#4C5058', padding: [3, 4], borderRadius: 4 }
        }
      },
      itemStyle: {
        opacity: 0.7,
        color: { image: piePatternImg, repeat: 'repeat' },
        borderWidth: 3,
        borderColor: '#235894'
      },
      data: []
    });
  }

  private configureOption(series: (echarts.PieSeriesOption | echarts.BarSeriesOption)[], grid: any) {
    option = {
      backgroundColor: {
        image: bgPatternImg,
        repeat: 'repeat'
      },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: this.listOfLabs,
        axisLabel: { fontSize: 14 }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} mins'
      },
      itemStyle: {
        opacity: 0.7,
        color: { image: piePatternImg, repeat: 'repeat' },
        borderWidth: 3,
        borderColor: '#235894'
      },
      series: series,
      grid: grid,
    };
  }

  private configureClickHandler() {
    this.myChart?.on('click', (params) => {
      if (params.seriesName === 'Inner Pie') {
        const outerPieData: any[] = [];
        const axisLabels: string[] = [];
        this.user?.detailedLabInfo.forEach((lab) => {
          if (lab.lab_title === params.name) {
            outerPieData.push({ value: Math.round(lab.total_duration / 2), name: lab.title });
            axisLabels.push(lab.title);
          }
        });
        const chartInstance = echarts.getInstanceByDom(document.getElementById('chart-' + this.user?.nickname));
        if (chartInstance) {
          chartInstance.setOption({
            series: [{ name: 'Outer Pie', data: outerPieData }]
          });
          chartInstance.setOption({
            series: [{ name: 'Bar Chart', data: outerPieData }],
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: axisLabels },
            color: [
              '#4d4dff', '#6699ff', '#99ccff', '#b3d9ff', '#ccffff',
              '#ccffcc', '#99ff99', '#66cc66', '#339933', '#006600'
            ],
          });
        }
      }
    });
  }
}
