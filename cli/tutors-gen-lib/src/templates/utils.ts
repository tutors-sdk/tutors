import type { Lo } from "@tutors/tutors-model-lib";

function stripProtocol(url: string): string {
  if (!url || !url.includes('//')) return url;
  if (url.includes('///')) {
    return url.substring(url.indexOf('///') + 3);
  }
  return url.substring(url.indexOf('//') + 2);
}

export function loPath(lo : Lo): string {
    let path = lo.route;
    switch (lo.type) {
      case "talk":
      case "lab":
      case "note": {
        path = `${stripProtocol(lo.route)}/index.html`;
        break;
      }
      case "archive": {
        path = stripProtocol(lo.route);
        break;
      }
    }
    return path;
}

export function loImagePath(lo : Lo): string {
  return stripProtocol(lo.img);
}

export function wallPath(lo: Lo): string {
  let depth = 0;
  
  if (lo.route && lo.route.includes('//')) {
    const pathPart = lo.route.substring(lo.route.indexOf('//') + 2);
    depth = (pathPart.match(/\//g) || []).length + 1;
  }
  const url = depth > 0 ? "../".repeat(depth) : "./";
  return url;
}
  