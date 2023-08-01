import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
export declare function publishTemplate(path: string, file: string, template: string, lo: any): void;
export declare const courseBuilderHtml: {
    emitObjectves(lo: LearningObject): void;
    emitNote(note: LearningObject, path: string): void;
    emitLab(lab: LearningObject, path: string): void;
    emitUnit(unit: LearningObject, path: string): void;
    emitLo(lo: LearningObject, path: string): void;
    emitTopic(topic: LearningObject, path: string): void;
    emitCourse(course: LearningObject, path: string): void;
    generateCourse(path: string, course: LearningObject): void;
};
