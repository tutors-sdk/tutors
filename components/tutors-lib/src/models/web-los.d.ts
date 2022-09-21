import { LearningObject } from './lo';
export declare abstract class WebLearningObject extends LearningObject {
    protected constructor(parent: LearningObject, resourceId: string);
    publish(path: string): void;
}
export declare class Video extends WebLearningObject {
    constructor(parent: LearningObject);
    publish(path: string): void;
}
export declare class PanelVideo extends WebLearningObject {
    constructor(parent: LearningObject);
    publish(path: string): void;
}
export declare class Git extends WebLearningObject {
    githubid?: string;
    constructor(parent: LearningObject);
    publish(path: string): void;
}
export declare class Web extends WebLearningObject {
    weburl?: string;
    constructor(parent: LearningObject);
    publish(path: string): void;
}
