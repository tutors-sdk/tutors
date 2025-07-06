import type { Lo, Talk } from "@tutors/tutors-model-lib";

export function fixWallRoutes(los: Lo[]): void {
  los.forEach((lo) => {
    switch (lo.type) {
      case "web":
      case "github": {
        lo.route += ' target="_blank"';
        break;
      }
      case "archive": {
        lo.route = lo.route.substring(lo.route.indexOf('///') + 3);
        break;
      }
      case "talk": {
        lo.route = lo.route.substring(lo.route.indexOf('//') + 2);
        const talk = lo as Talk;
        talk.route = `${talk.route}/index.html`;
        break;
      }
      case "lab":
      case "note": {
        lo.route = lo.route.substring(lo.route.indexOf('//') + 2);
        lo.route += '/index.html';
        break;
      }
      default: {
        if (lo.route.includes('//')) {
          lo.route = lo.route.substring(lo.route.indexOf('//') + 2);
        }
      }
    }
  });
}
