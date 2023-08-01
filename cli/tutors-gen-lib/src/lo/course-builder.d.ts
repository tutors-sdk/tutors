import { LearningObject, LearningResource } from "./lo-types";
export declare const courseBuilder: {
    lo: LearningObject;
    buildCompositeLo(lo: LearningObject, lr: LearningResource, level: number): LearningObject;
    buildSimpleLo(lo: LearningObject, lr: LearningResource): LearningObject;
    buildLo(lr: LearningResource, level: number, keyFileName?: string): LearningObject;
    buildDefaultLo(lr: LearningResource, keyFileName?: string): LearningObject;
    buildUnit(lo: LearningObject): void;
    buildTalk(lo: LearningObject): void;
    buildSide(lo: LearningObject): void;
    buildPanelvideo(lo: LearningObject): void;
    buildLab(lo: LearningObject, lr: LearningResource): LearningObject;
    buildCourse(lr: LearningResource): void;
};
