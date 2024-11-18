import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course.svelte";

export const ssr = false;

export const load: PageLoad = async ({ url, params, fetch }) => {
  const lo = await courseService.readLo(params.courseid, url.pathname, fetch);
  return {
    lo: lo
  };
};
