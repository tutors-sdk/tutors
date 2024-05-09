export interface Metric {
  id: string;
  title: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
}

export interface DayMeasure {
  date: string;
  dateObj: number;
  metric: number;
}

export interface UserMetric {
  title: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
  labActivity: Metric[];
  calendarActivity: DayMeasure[];
}

export interface UserSummary {
  name: string;
  picture: string;
}
