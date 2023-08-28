import { isCompositeLo, type Course, type Lo, Composite, Talk } from "./lo-types";

export function findLos(los: Lo[], lotype: string): Lo[] {
  const result: Lo[] = [];
  for (const lo of los) {
    if (lo.type === lotype) {
      result.push(lo);
    }
    if (isCompositeLo(lo)) {
      const compositeLo = lo as Composite;
      result.push(...findLos(compositeLo.los, lotype));
    }
  }
  return result;
}

export function allLos(lotype: string, los: Lo[]): Lo[] {
  const allLos: Lo[] = [];
  for (const lo of los) {
    if (isCompositeLo(lo)) {
      const compositeLo = lo as Composite;
      if (compositeLo.los) allLos.push(...findLos(compositeLo.los, lotype));
    }
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
  if (lo.type == "talk") {
    const talk = lo as Talk;
    talk.pdf = talk.pdf?.replace("{{COURSEURL}}", url);
  }
  if (isCompositeLo(lo)) {
    const compositeLo = lo as Composite;
    if (compositeLo.los) {
      compositeLo.los.forEach((childLo) => {
        injectCourseUrl(childLo, id, url);
      });
    }
  }
}

export function flattenLos(los: Lo[]): Lo[] {
  let result: Lo[] = [];
  los.forEach((lo) => {
    result.push(lo);
    if (isCompositeLo(lo)) {
      const compositeLo = lo as Composite;
      if (compositeLo.los) result = result.concat(flattenLos(compositeLo.los));
    }
  });
  return result;
}
