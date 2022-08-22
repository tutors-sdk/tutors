import { LearningObject } from './lo';
export declare abstract class DiscreteLearningObject extends LearningObject {
    protected constructor(parent: LearningObject);
    reap(pattern: string): void;
    publish(path: string): void;
}
export declare class Talk extends DiscreteLearningObject {
    constructor(parent: LearningObject);
}
export declare class PanelTalk extends DiscreteLearningObject {
    constructor(parent: LearningObject);
}
export declare class Archive extends DiscreteLearningObject {
    constructor(parent: LearningObject);
}
