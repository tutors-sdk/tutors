import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
export declare function publishTemplate(path: string, file: string, template: string, lo: any): void;
export declare const courseBuilderHtml: {
    emitNote(lo: LearningObject, path: string): void;
    emitLab(lo: LearningObject, path: string): void;
    emitLoPage(lo: LearningObject, path: string): void;
    emitUnit(lo: LearningObject, path: string): void;
    emitLo(lo: LearningObject, path: string): void;
    emitTopic(lo: LearningObject, path: string): void;
    generateCourse(path: string, lo: LearningObject): void;
};
