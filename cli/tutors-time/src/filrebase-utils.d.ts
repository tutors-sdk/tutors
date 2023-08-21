export declare function initFirebase(keys: any): Promise<void>;
export declare function deleteNode(root: string, url: string): Promise<void>;
export declare function readValue(key: string): Promise<string>;
export declare function readVisits(courseId: string): Promise<number | undefined>;
export declare function readAllCourseIds(keys: any, root: string): Promise<string[]>;
export declare function isValidCourseName(course: string): boolean;
