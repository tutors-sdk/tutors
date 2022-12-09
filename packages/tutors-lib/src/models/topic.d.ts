import { LearningObject } from "./lo";
export declare class Topic extends LearningObject {
    los: Array<LearningObject>;
    units: Array<LearningObject>;
    panelVideos: Array<LearningObject>;
    panelTalks: Array<LearningObject>;
    panelNotes: Array<LearningObject>;
    standardLos: Array<LearningObject>;
    allLos: LearningObject[];
    constructor(parent: LearningObject);
    setDefaultImage(): void;
    publish(path: string): void;
}
export declare class Unit extends Topic {
    standardLos: Array<LearningObject>;
    constructor(parent: LearningObject);
}
