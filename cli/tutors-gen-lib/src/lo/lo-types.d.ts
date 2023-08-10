import { VideoIdentifiers } from "../lr/lr-types";
export declare const loTypes: string[];
export declare class Properties {
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
    type: string;
    id: string;
    route: string;
    title: string;
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
export declare const preOrder: Map<string, number>;
