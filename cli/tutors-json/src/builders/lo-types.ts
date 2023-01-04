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

export interface LearningResource {
  courseRoot: string;
  route: string;
  lrs: LearningResource[];
  files: Array<string>;
  type: string;
}

export interface LearningObject {
  id: string;
  route: string;
  type: string;
  title: string;
  summary: string;
  img: string;
  pdf: string;
  contentMd: string;
  video: string;
  videoids: VideoIdentifiers;
  frontMatter: Properties;
  los: LearningObject[];
  properties?: Properties;
}
