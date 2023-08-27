import type { Course, Lo } from "./lo-types";

export function findLos(los: Lo[], lotype: string): Lo[] {
  const result: Lo[] = [];
  for (const lo of los) {
    if (lo.type === lotype) {
      result.push(lo);
    }
    if (lo.type === "unit" || lo.type === "side") {
      result.push(...findLos(lo.los, lotype));
    }
  }
  return result;
}

export function allLos(lotype: string, los: Lo[]): Lo[] {
  const allLos: Lo[] = [];
  for (const topic of los) {
    allLos.push(...findLos(topic.los, lotype));
  }
  return allLos;
}

export function injectCourseUrl(lo: Lo, id: string, url: string) {
  if (lo.type === "archive" || lo.type === "otherType") {
    lo.route = lo.route?.replace("{{COURSEURL}}", url);
  } else {
    lo.route = lo.route?.replace("{{COURSEURL}}", id);
  }

  lo.img = lo.img?.replace("{{COURSEURL}}", url);
  lo.video = lo.video?.replace("{{COURSEURL}}", id);
  lo.pdf = lo.pdf?.replace("{{COURSEURL}}", url);

  if (lo.los) {
    lo.los.forEach((childLo) => {
      injectCourseUrl(childLo, id, url);
    });
  }
}

export function flattenLos(los: Lo[]): Lo[] {
  let result: Lo[] = [];
  los.forEach((lo) => {
    result.push(lo);
    if (lo.los) result = result.concat(flattenLos(lo.los));
  });
  return result;
}

