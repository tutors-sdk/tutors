import { LearningObject } from './lo';
export declare class Chapter {
    title: string;
    shortTitle: string;
    contentMd: string;
    content: string;
    route: string;
}
export declare class Lab extends LearningObject {
    directories: Array<string>;
    chapters: Array<Chapter>;
    constructor(parent: LearningObject);
    reapChapters(mdFiles: Array<string>): Array<Chapter>;
    reap(): void;
    publish(path: string): void;
}
