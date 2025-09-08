import type { Lo } from "@tutors/tutors-model-lib";

function stripProtocol(url: string): string {
  if (!url || !url.includes('//')) return url;
  if (url.includes('///')) {
    return url.substring(url.indexOf('///') + 3);
  }
  return url.substring(url.indexOf('//') + 2);
}

export function generateLink(lo: Lo, isAbsolute: boolean = false): string {
  // For web and github links, always use the route with target blank
  if (lo.type === "web" || lo.type === "github") {
    return `${lo.route}`;
  }
  
  // For absolute links
  if (isAbsolute) {
    switch (lo.type) {
      case "talk":
      case "lab":
      case "note":
      case "topic":
      case "unit":
        if (lo.parentLo && lo.parentLo.type === "course") {
          return "home.html";
        }
        return `${stripProtocol(lo.route)}/index.html`;
      case "archive":
        return stripProtocol(lo.route);
      default:
        return lo.route;
    }
  } 
  
  // For relative links
  if (lo.type === "archive") {
    const archive = lo as unknown as { archiveFile?: string };
    const archiveFile = archive.archiveFile || "";
    return `${lo.id}/${archiveFile}`;
  } else {
    const hasParentUnit = lo.parentLo && (lo.parentLo.type === "unit" || lo.parentLo.type === "side");
    const prefix = hasParentUnit ? `./${lo?.parentLo?.id}/` : `./`;
    return `${prefix}${lo.id}/index.html`;
  }
}

export function generateImg(lo : Lo, isAbsolute: boolean = false): string {
  if (isAbsolute) {
    return stripProtocol(lo.img);
  } else {
    const hasParentUnit = lo.parentLo && (lo.parentLo.type === "unit" || lo.parentLo.type === "side");
    const prefix = hasParentUnit ? `./${lo?.parentLo?.id}/` : `./`;
    return `${prefix}${lo.id}/${lo.imgFile}`;
  }
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

export function tocLink(fromlo: Lo, lo: Lo): string {
  let depth = 0;
  let pathPart = "";
  if (fromlo.route && fromlo.route.includes('//')) {
    pathPart = fromlo.route.substring(fromlo.route.indexOf('//') + 2);
    depth = (pathPart.match(/\//g) || []).length + 1;
  }
  const url = depth > 0 ? "../".repeat(depth) : "./";
  const link = `${url}${generateLink(lo, true)}`;
  return link;
}

export function generateRefLink(lo: Lo, path: string): string {
  if (lo.type === "panelvideo") {
    return `../../index.html`;
  }
  if (lo.type === "web" || lo.type === "github") {
    return `${lo.route}`;
  } else if (lo.type === "archive") {
    const archive = lo as unknown as { archiveFile?: string };
    const archiveFile = archive.archiveFile || "";
    return `${path}/${lo.id}/${archiveFile}`;
  } else {
    return `${path}${lo.id}/index.html`;
  }
}

export function generateVideoLink(lo: Lo): string {
  const id = lo?.videoids?.videoid;
  if (!id) return "";

  let url = `https://www.youtube.com/watch?v=${id}`;

  const src = lo.video || "";
  // If a start parameter is present, convert to YouTube's t parameter
  const startMatch = src.match(/[?&]start=(\d+)/);
  if (startMatch) {
    url += `&t=${startMatch[1]}s`;
    return url;
  }
  // If t already present, preserve it
  const tMatch = src.match(/[?&]t=([0-9hms]+)/);
  if (tMatch) {
    url += `&t=${tMatch[1]}`;
  }
  return url;
}


export function generateCrumbLink(index: number, lo: Lo): string {
  let page = lo.type === "course" ? "home" : "index";
  let url: string;
  
  if (lo.type === "unit" && lo.parentLo && lo.parentLo.type === "course") {
    page = "home";
  }
  if (lo.parentLo?.type === "course") {
    index++;
    url = "../".repeat(index) + "home.html";
    return url;
  }
  
  if (lo.type === "unit" || lo.type === "side") {
    url = `../../${page}.html`;
  } else {
    url = "../".repeat(index) + `${page}.html`;
  }
  return url;
}