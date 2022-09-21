import { LearningObject } from '../models/lo';
export declare function reapLos({ parent }: {
    parent: LearningObject;
}): Array<LearningObject>;
export declare function findTopLos(los: Array<LearningObject>, lotype: string): LearningObject[];
export declare function findLos(los: Array<LearningObject>, lotype: string): LearningObject[];
export declare function findTalksWithVideos(los: Array<LearningObject>): LearningObject[];
export declare function publishLos(path: string, los: Array<LearningObject>): void;
export declare function copyResource(src: string, dest: string): void;
export declare function sortLos(los: Array<LearningObject>): LearningObject[];
