export declare const imageTypes: string[];
export declare const assetTypes: string[];
export declare class Properties {
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
    id: string;
    lrs: LearningResource[];
    files: Array<string>;
    type: string;
}
export interface LabStep {
    title: string;
    shortTitle: string;
    contentMd: string;
    route: string;
    id: string;
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
    los: Array<LearningObject | LabStep>;
    properties?: Properties;
    calendar?: Properties;
    hide: boolean;
}
export declare const loTypes: string[];
export declare const preOrder: Map<string, number>;
