import { VideoIdentifiers } from "../lr/lr-types";
export declare const loTypes: string[];
export declare class Properties {
    [key: string]: string;
}
export interface IconType {
    type: string;
    color: string;
}
export interface Panels {
    panelVideos: Lo[];
    panelTalks: Lo[];
    panelNotes: Lo[];
}
export interface Units {
    units: Lo[];
    sides: Lo[];
    standardLos: Lo[];
}
export interface Lo {
    type: string;
    id: string;
    title: string;
    summary: string;
    contentMd: string;
    frontMatter: Properties;
    contentHtml?: string;
    shortTitle?: string;
    los: Lo[];
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
    parentLo?: Lo;
    parentCourse?: Course;
    panels?: Panels;
    units?: Units;
    breadCrumbs?: Lo[];
}
export interface Course extends Lo {
    walls?: Lo[][];
    properties?: Properties;
    calendar?: Properties;
}
export declare const preOrder: Map<string, number>;
