import type { Topic } from "../models/topic";

export interface Student {
  name: string;
  github: string;
}

export interface WeekType {
  title: string;
  type: string;
  date: string;
  dateObj: Date;
}

export interface Calendar {
  title: string;
  weeks: WeekType[];
}

export interface VideoIdentifier {
  service: string;
  id: string;
}

export interface VideoIdentifiers {
  videoid: string;
  videoIds: VideoIdentifier[];
}

export interface Lo {
  parentLo: Lo;
  properties: { [prop: string]: string };
  enrollment: { students: Student[] };
  calendar: any;
  version: string;
  type: string;
  shortTitle: string;
  title: string;
  img: string;
  video: string;
  videoids?: VideoIdentifiers;
  frontMatter?: { [prop: string]: string };
  pdf: string;
  summary: string;
  contentMd: string;
  route: string;
  id: string;
  hide: boolean;
  los: Lo[];
  parent: Topic;
  icon?: any;
}
