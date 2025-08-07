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
