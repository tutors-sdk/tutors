import { Course } from 'tutors-lib/src/models/course';
import { Topic, Unit } from 'tutors-lib/src/models/topic';
import { Lab } from 'tutors-lib/src/models/lab';
import { MarkdownParser } from '../utils/markdown-parser';
import { LearningObject } from 'tutors-lib/src/models/lo';
import { Note } from 'tutors-lib/src/models/note';
export declare function publishTemplate(path: string, file: string, template: string, lo: any): void;
export declare class HtmlEmitter {
    parser: MarkdownParser;
    emitObjectves(lo: LearningObject): void;
    emitNote(note: Note, path: string): void;
    emitLab(lab: Lab, path: string): void;
    emitUnit(unit: Unit, path: string): void;
    emitLo(lo: LearningObject, path: string): void;
    emitTopic(topic: Topic, path: string): void;
    emitCourse(course: Course, path: string): void;
    generateCourse(path: string, course: Course): void;
}
