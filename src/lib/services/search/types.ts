import type { Lo } from "@tutors/tutors-model-lib";

export interface SearchDocument {
  id: string;
  type: string;
  title: string;
  summary: string;
  content: string;
  route: string;
  parentTitle: string;
  topicTitle: string;
}

export interface SearchResult {
  lo: Lo;
  score: number;
  matchedFields: string[];
}
