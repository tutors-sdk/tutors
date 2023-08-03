import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
export declare function publishTemplate(path: string, file: string, template: string, lo: any): void;
export declare function threadLos(parent: LearningObject): void;
export declare const courseBuilderHtml: {
    emitLo(lo: LearningObject, path: string): void;
    emitNote(note: LearningObject, path: string): void;
    emitLab(lab: LearningObject, path: string): void;
    emitUnit(unit: LearningObject, path: string): void;
    emitTopic(lo: LearningObject, path: string): void;
    generateCourse(path: string, lo: LearningObject): void;
};
