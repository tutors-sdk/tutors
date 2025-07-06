/**
 * Base structure for learning resources
 */
export type LearningResource = {
    courseRoot: string;
    route: string;
    id: string;
    lrs: LearningResource[];
    files: Array<string>;
    type: string;
  };
  