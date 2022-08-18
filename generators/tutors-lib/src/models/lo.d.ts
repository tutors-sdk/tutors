import { Properties } from '../utils/properties';
import { VideoIdentifiers } from '../utils/videoutils';
export declare abstract class LearningObject {
    parent?: LearningObject;
    course?: LearningObject;
    lotype: string;
    title?: string;
    img?: string;
    videoid?: string;
    videoids?: VideoIdentifiers;
    link?: string;
    folder?: string;
    parentFolder?: string;
    objectivesMd?: string;
    objectives?: string;
    frontMatter?: Properties;
    hide: boolean;
    properties?: Properties;
    icon?: any;
    protected constructor(parent?: LearningObject);
    reap(pattern: string): void;
    abstract publish(path: string): void;
}
