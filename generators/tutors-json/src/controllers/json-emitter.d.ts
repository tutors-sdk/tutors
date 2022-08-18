import { Course } from 'tutors-lib/src/models/course';
import { LearningObject } from 'tutors-lib/src/models/lo';
import { Topic, Unit } from 'tutors-lib/src/models/topic';
import { Archive, PanelTalk, Talk } from 'tutors-lib/src/models/los';
import { PanelVideo } from 'tutors-lib/src/models/web-los';
import { Lab } from 'tutors-lib/src/models/lab';
import { Note, PanelNote } from 'tutors-lib/src/models/note';
export declare class JsonEmitter {
    version: string;
    emitLo(lo: LearningObject, url: string, jsonObj: any): void;
    emitTalk(lo: Talk, url: string, jsonObj: any): void;
    emitLab(lo: Lab, url: string, jsonObj: any): void;
    emitNote(lo: Note, url: string, jsonObj: any): void;
    emitPanelNote(lo: PanelNote, url: string, jsonObj: any): void;
    emitPanelTalk(lo: PanelTalk, url: string, jsonObj: any): void;
    emitArchive(lo: Archive, url: string, jsonObj: any): void;
    emitPanelVideo(lo: PanelVideo, url: string, jsonObj: any): void;
    emitUnit(lo: Unit, url: string, jsonObj: any): void;
    emitTopic(lo: Topic, url: string, jsonObj: any): void;
    emitCourse(lo: Course, url: string, jsonObj: any): void;
    generateCourse(version: string, path: string, course: Course): void;
}
