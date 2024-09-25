export interface CalendarMap {
  date: string;
  timeActive: number;
}

export interface LearningObject {
  route: string;
  loTitle: string;
  parentLoTitle: string | undefined;
  date: Date;
  pageLoads: number;
  timeActive: number;
  nickname: string;
}

export interface LearningInteraction {
  id?: Date;
  loid?: string;
  courseid: string;
  studentid: string;
  date: Date;
  pageloads: number;
  timeactive: number;
  fullName?: string;
  avatarUrl: string;
}

export interface GridConfig {
  left: string | number;
  right: string | number;
  bottom: string | number;
  top: string | number;
  width: string | number;
  height: string | number;
  containLabel: boolean;
}

export type ChartType = {
  type:
    | "line"
    | "bar"
    | "pie"
    | "scatter"
    | "effectScatter"
    | "radar"
    | "tree"
    | "treemap"
    | "sunburst"
    | "boxplot"
    | "candlestick"
    | "heatmap"
    | "parallel"
    | "lines"
    | "graph"
    | "sankey"
    | "funnel"
    | "gauge"
    | "pictorialBar"
    | "themeRiver"
    | "calendar"
    | "map"
    | "custom";
};

export interface BackgroundColor {
  image: HTMLImageElement;
  repeat: "repeat";
}

export type HeatmapShowBoolean = {
  show: boolean;
};

export interface AxisLabel {
  interval: number;
  fontSize: number;
  margin?: number; // Adjust margin to control spacing
  padding?: number[];
}

export interface AxisTick {
  alignWithLabel: boolean;
}

export interface axisPointer {
  type: "line" | "shadow" | "none";
}

export interface XAxis {
  type: "value" | "category";
  data: string[] | number[];
  boundaryGap?: number[];
  nameLocation?: "start" | "middle" | "center" | "end";
  splitArea?: HeatmapShowBoolean;
  axisLabel?: AxisLabel;
  axisTick?: AxisTick;
  axisPointer?: axisPointer;
  position?: "top" | "bottom";
}

export interface YAxis {
  type: "value" | "category";
  data: string[];
  splitArea?: HeatmapShowBoolean;
  axisLabel?: AxisLabel;
}

export interface Color {
  image: HTMLImageElement;
  repeat: string;
}

export interface ItemStyle {
  color: Color;
  borderWidth: number;
  borderColor: string;
}

export interface Tooltip {
  position: "top" | "bottom" | "left" | "right";
  trigger?: "item";
  formatter?: (param: string | number) => string;
  //formatter: string; //"{a} <br/>{b}: {c} mins"
}

export interface Series {
  type: ChartType;
  data: number[];
  itemStyle: ItemStyle;
}

export interface BoxplotChartConfig {
  backgroundColor: BackgroundColor;
  xAxis: XAxis;
  yAxis: YAxis;
  series: Series[];
  tooltip: Tooltip;
}

export type ChartTitle = {
  top: string;
  left: string;
  text: string;
};

export interface VisualMap {
  min: number;
  max: number;
  calculable: boolean;
  orient: "horizontal" | "vertical";
  left: number | string | "center" | "left" | "right";
  align: "auto" | "left" | "right" | "center";
  bottom: number | string | "center" | "top" | "bottom";
}

export interface HeatMapChartConfig {
  title: ChartTitle;
  tooltip: Tooltip;
  backgroundColor: BackgroundColor;
  grid: GridConfig;
  xAxis: XAxis;
  yAxis: YAxis;
  visualMap: VisualMap;
  series: HeatMapSeriesData[];
}

export interface BoxplotTooltip {
  trigger: "item";
  formatter: (param: string | number) => string;
  //formatter: string; //"{a} <br/>{b}: {c} mins"
}

export interface HeatmapTooltip {
  position: "top" | "bottom" | "left" | "right";
  trigger: "item";
  formatter: string; //"{a} <br/>{b}: {c} mins"
}

export type NameTypeData = {
  name: string;
  type?: string;
};

export interface HeatMapSeriesData {
  top: string | number;
  name: string;
  type: "heatmap";
  selectedMode: "single" | "multiple";
  data: number[][];
  label: HeatmapShowBoolean;
}

// export type HeatMapSeriesData = NameTypeData & {
//   data: number[][];
//   top: string;
//   selectedMode?: string;
//   label: { show: boolean };
// };

export type BoxplotData = NameTypeData & {
  value: [number, number, number, number, number];
  lowNickname: string;
  highNickname: string;
};

export type DrilledDownData = NameTypeData & {
  value: number;
};
