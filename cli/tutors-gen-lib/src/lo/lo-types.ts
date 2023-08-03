export const imageTypes = ["png", "jpg", "jpeg", "gif", "PNG", "JPG", "JPEG", "GIF"];

export const assetTypes = imageTypes.concat(["pdf", "zip"]);

export class Properties {
  [key: string]: string;
}

export interface VideoIdentifier {
  service: string;
  id: string;
}

export interface VideoIdentifiers {
  videoid: string;
  videoIds: VideoIdentifier[];
}

export interface IconType {
  type: string;
  color: string;
}

export interface LearningResource {
  courseRoot: string;
  route: string;
  id: string;
  lrs: LearningResource[];
  files: Array<string>;
  type: string;
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
}

export interface LearningObject {
  parentLo?: LearningObject;
  id: string;
  route: string;
  type: string;
  title: string;
  summary: string;
  img: string;
  imgFile: string;
  pdf: string;
  pdfFile: string;
  icon: IconType;
  contentMd: string;
  contentHtml: string;
  video: string;
  videoids: VideoIdentifiers;
  frontMatter: Properties;
  los: Array<LearningObject | LabStep>;
  properties?: Properties;
  calendar?: Properties;
  hide: boolean;
  panels?: any;
  units?: any;
  sides?: any;
  standardLos?: any;
}

export const loTypes = ["/note", "/book", "/archive", "/web", "/github", "/panelnote", "/paneltalk", "/panelvideo", "/talk", "/unit", "/side", "/topic"];

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

