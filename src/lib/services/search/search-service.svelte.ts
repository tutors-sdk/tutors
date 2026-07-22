import MiniSearch from "minisearch";
import { flattenLos } from "@tutors/tutors-model-lib";
import type { Course, Lo, Lab } from "@tutors/tutors-model-lib";
import type { SearchDocument, SearchResult } from "./types";

const INDEXABLE_TYPES = new Set(["note", "lab", "panelnote", "tutorial", "notebook", "topic"]);
const TITLE_ONLY_TYPES = new Set(["topic"]);

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .trim();
}

function buildDocuments(course: Course): SearchDocument[] {
  const allLos = flattenLos(course.los);
  const documents: SearchDocument[] = [];
  const seenIds = new Set<string>();

  for (const lo of allLos) {
    if (lo.hide || !INDEXABLE_TYPES.has(lo.type)) continue;
    if (!lo.route || seenIds.has(lo.route)) continue;
    seenIds.add(lo.route);

    const content = TITLE_ONLY_TYPES.has(lo.type) ? "" : stripMarkdown(lo.contentMd ?? "");

    documents.push({
      id: lo.route,
      type: lo.type,
      title: lo.title ?? "",
      summary: lo.summary ?? "",
      content,
      route: lo.route,
      parentTitle: lo.parentLo?.title ?? "",
      topicTitle: lo.parentTopic?.title ?? lo.parentLo?.title ?? ""
    });

    if (lo.type === "lab") {
      const lab = lo as Lab;
      if (lab.los) {
        for (const step of lab.los) {
          const stepRoute = step.route ?? `${lo.route}/${step.id}`;
          if (seenIds.has(stepRoute)) continue;
          seenIds.add(stepRoute);

          documents.push({
            id: stepRoute,
            type: "step",
            title: step.title ?? "",
            summary: "",
            content: stripMarkdown(step.contentMd ?? ""),
            route: stepRoute,
            parentTitle: lo.title,
            topicTitle: lo.parentTopic?.title ?? lo.parentLo?.title ?? ""
          });
        }
      }
    }
  }

  return documents;
}

function createSearchService() {
  const indices = new Map<string, MiniSearch<SearchDocument>>();
  const loMaps = new Map<string, Map<string, Lo>>();

  return {
    buildIndex(course: Course): void {
      if (indices.has(course.courseId)) return;

      const documents = buildDocuments(course);
      const miniSearch = new MiniSearch<SearchDocument>({
        fields: ["title", "summary", "content"],
        storeFields: ["type", "title", "route", "parentTitle", "topicTitle"],
        searchOptions: {
          boost: { title: 3, summary: 2, content: 1 },
          fuzzy: 0.2,
          prefix: true
        }
      });
      miniSearch.addAll(documents);
      indices.set(course.courseId, miniSearch);

      const loMap = new Map<string, Lo>();
      const allLos = flattenLos(course.los);
      for (const lo of allLos) {
        loMap.set(lo.route, lo);
        if (lo.type === "lab") {
          const lab = lo as Lab;
          if (lab.los) {
            for (const step of lab.los) {
              if (step.route) loMap.set(step.route, step as unknown as Lo);
            }
          }
        }
      }
      loMaps.set(course.courseId, loMap);
    },

    search(courseId: string, query: string): SearchResult[] {
      const index = indices.get(courseId);
      const loMap = loMaps.get(courseId);
      if (!index || !loMap || !query.trim()) return [];

      const rawResults = index.search(query, {
        fuzzy: 0.2,
        prefix: true,
        boost: { title: 3, summary: 2, content: 1 }
      });

      return rawResults.map((result) => ({
        lo: loMap.get(result.id) ?? ({ title: result.title, route: result.id, type: result.type } as unknown as Lo),
        score: result.score,
        matchedFields: Object.keys(result.match)
      }));
    },

    isIndexed(courseId: string): boolean {
      return indices.has(courseId);
    },

    clearIndex(courseId: string): void {
      indices.delete(courseId);
      loMaps.delete(courseId);
    }
  };
}

export const searchService = createSearchService();
