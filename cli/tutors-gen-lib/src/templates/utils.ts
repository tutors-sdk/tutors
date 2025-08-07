import type { Lo } from "@tutors/tutors-model-lib";

function stripProtocol(url: string): string {
  if (!url || !url.includes('//')) return url;
  if (url.includes('///')) {
    return url.substring(url.indexOf('///') + 3);
  }
  return url.substring(url.indexOf('//') + 2);
}

export function fixWallRoutes(los: Lo[]): void {
  los.forEach((lo) => {
    lo.route = stripProtocol(lo.route);
    lo.img = stripProtocol(lo.img);
    switch (lo.type) {
      case "talk":
      case "lab":
      case "note": {
        lo.route += "/index.html";
        break;
      }
      case "web":
      case "github": {
        lo.route = `https://${lo.route}`;
        break;
      }
    }
  });
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
  