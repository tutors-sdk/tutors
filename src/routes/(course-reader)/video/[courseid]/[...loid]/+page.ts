import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course/services/course.svelte";

export const ssr = false;

export const load: PageLoad = async ({ url, params, fetch }) => {
  let videoId = url.pathname;
  let videoStartEnd = url.searchParams.toString();
  if (videoStartEnd.endsWith("=")) {
    videoStartEnd = videoStartEnd.slice(0, -1);
    videoId = `${url.pathname}?${videoStartEnd}`;
  } else if (videoStartEnd) {
    videoId = `${url.pathname}?${videoStartEnd}`;
  } else {
    videoId = `${url.pathname}`;
  }
  const lo = await courseService.readLo(params.courseid, videoId, fetch);
  return {
    lo: lo
  };
};
