import type { Lo } from "@tutors/tutors-model-lib";

function stripProtocol(url: string): string {
  if (!url || !url.includes('//')) return url;
  if (url.includes('///')) {
    return url.substring(url.indexOf('///') + 3);
  }
  return url.substring(url.indexOf('//') + 2);
}

export function absoluteLink(lo : Lo): string {
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

export function absoluteImg(lo : Lo): string {
  return stripProtocol(lo.img);
}

export function relativeLink(lo: Lo): string {
  let url: string;
  
  if (lo.type === "web" || lo.type === "github") {
    url = `${lo.route} target="_blank"`;
  } else if (lo.type === "archive") {
    const archive = lo as unknown as { archiveFile?: string };
    const archiveFile = archive.archiveFile || "";
    url = `${lo.id}/${archiveFile}`;
  } else {
    const hasParentUnit = lo.parentLo && (lo.parentLo.type === "unit" || lo.parentLo.type === "side");
    const prefix = hasParentUnit ? `./${lo.parentLo.id}/` : `./`;
    url = `${prefix}${lo.id}/index.html`;
  }
  return url;
}

export function relativeImg(lo: Lo): string {
  const hasParentUnit = lo.parentLo && (lo.parentLo.type === "unit" || lo.parentLo.type === "side");
  const prefix = hasParentUnit ? `./${lo.parentLo.id}/` : `./`;
  return `${prefix}${lo.id}/${lo.imgFile}`;
}

export function wallLink(lo: Lo): string {
  let depth = 0;
  
  if (lo.route && lo.route.includes('//')) {
    const pathPart = lo.route.substring(lo.route.indexOf('//') + 2);
    depth = (pathPart.match(/\//g) || []).length + 1;
  }
  const url = depth > 0 ? "../".repeat(depth) : "./";
  return url;
}