import { Lo } from "./lo-types";
import { LearningResource } from "../lr/lr-types";
export declare const courseBuilder: {
    lo: Lo;
    buildCompositeLo(lo: Lo, lr: LearningResource, level: number): Lo;
    buildSimpleLo(lo: Lo, lr: LearningResource): Lo;
    buildLo(lr: LearningResource, level: number, keyFileName?: string): Lo;
    buildDefaultLo(lr: LearningResource, keyFileName?: string): Lo;
    buildUnit(lo: Lo): void;
    buildTalk(lo: Lo): void;
    buildSide(lo: Lo): void;
    buildPanelvideo(lo: Lo): void;
    buildLab(lo: Lo, lr: LearningResource): Lo;
    buildCourse(lr: LearningResource): void;
};
