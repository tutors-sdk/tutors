import { LearningResource } from "./lo-types";
export declare const resourceBuilder: {
    lr: LearningResource;
    root: string;
    getLoType(route: string): string;
    build(dir: string): LearningResource;
    pruneTree(lr: LearningResource): void;
    buildTree(dir: string): void;
    copyAssetFiles(lr: LearningResource, dest: string): void;
    copyAssets(dest: string): void;
};
