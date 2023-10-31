import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";

export const ssr = false;

export const load: PageLoad = async ({ url, params, fetch }) => {
  const liveLab = await courseService.readLab(params.courseid, url.pathname, fetch);

  const lastSegment = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
  if (lastSegment.startsWith("book")) {
     liveLab.setFirstPageActive();
   } else {
     liveLab.setActivePage(lastSegment);
   }
  return {
    lab: liveLab,
  };
};
