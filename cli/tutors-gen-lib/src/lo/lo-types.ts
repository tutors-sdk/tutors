import { VideoIdentifiers } from "../lr/lr-types";

export const loTypes = ["note", "book", "archive", "web", "github", "panelnote", "paneltalk", "panelvideo", "talk", "unit", "side", "topic"];

export class Properties {
  [key: string]: string;
}

export interface IconType {
  type: string;
  color: string;
}

export interface LabStep {
  title: string;
  shortTitle: string;
  contentMd: string;
  contentHtml: string;
  route: string;
  id: string;
  type: string;
  hide: boolean;
  parentLo?: Lo;
  parentCourse?: Lo;
}

export interface Lo {
  // type of lo, one of loTypes above
  type: string;

  // folder name containing the lo
  id: string;

  // url to the lo, used for dynamic version only
  route: string;
  // extracted from first line of markdown file
  title: string;

  //
  summary: string;
  contentMd: string;
  contentHtml?: string;
  hide: boolean;
  img: string;
  imgFile: string;
  pdf: string;
  pdfFile: string;
  archiveFile?: string;
  video: string;
  videoids: VideoIdentifiers;
  frontMatter: Properties;
  los: Array<Lo | LabStep>;
  properties?: Properties;
  calendar?: Properties;
  icon?: IconType;
  parentLo?: Lo;
  parentCourse?: Lo;
  panels?: any;
  units?: any;
  breadCrumbs?: Lo[];
}

export const preOrder = new Map([
  ["unit", 1],
  ["side", 2],
  ["talk", 3],
  ["lab", 4],
  ["note", 5],
  ["web", 6],
  ["github", 7],
  ["panelnote", 8],
  ["paneltalk", 9],
  ["archive", 10],
  ["panelvideo", 11],
  ["topic", 12],
  ["unknown", 13],
  ["", 0],
]);
