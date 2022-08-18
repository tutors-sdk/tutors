import { LearningObject } from './lo';
import { Properties } from '../utils/properties';
export declare class Note extends LearningObject {
    directories: Array<string>;
    contentMd: string;
    frontMatter?: Properties;
    constructor(parent: LearningObject);
    publish(path: string): void;
}
export declare class PanelNote extends Note {
    constructor(parent: LearningObject);
}
