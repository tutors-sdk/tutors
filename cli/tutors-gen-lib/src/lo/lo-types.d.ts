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
    title: string;
    summary: string;
    contentMd: string;
    frontMatter: Properties;
    contentHtml?: string;
    los: Array<Lo | LabStep>;
    route: string;
    img: string;
    imgFile: string;
    icon?: IconType;
    pdf: string;
    pdfFile: string;
    archiveFile?: string;
    video: string;
    videoids: VideoIdentifiers;
    hide: boolean;
    properties?: Properties;
    calendar?: Properties;
    parentLo?: Lo;
    parentCourse?: Lo;
    panels?: any;
    units?: any;
    breadCrumbs?: Lo[];
}
export declare const preOrder: Map<string, number>;
