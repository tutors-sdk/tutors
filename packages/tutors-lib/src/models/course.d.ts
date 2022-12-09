import { LearningObject } from "./lo";
import { Properties } from "../utils/properties";
interface LoWall {
    course: Course;
    isWall: boolean;
    los: Array<LearningObject>;
}
export declare class Course extends LearningObject {
    enrollment?: Properties;
    calendar?: Properties;
    los: Array<LearningObject>;
    contentMd: string;
    walls: LoWall[];
    insertCourseRef(los: Array<LearningObject>): void;
    constructor(parent?: LearningObject);
    publish(path: string): void;
}
export {};
