import { Lo } from "./lo-types";

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
