export const imageTypes = ["png", "jpg", "jpeg", "gif", "PNG", "JPG", "JPEG", "GIF"];
export const assetTypes = imageTypes.concat(["pdf", "zip"]);

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
  id: string;
  lrs: LearningResource[];
  files: Array<string>;
  type: string;
}
