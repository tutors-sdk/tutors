import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import { currentLo } from "$lib/stores";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  const los = await courseService.readWall(params.courseid, params.type, fetch);
  const type = params.type;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:next-line
  currentLo.set({
    title: `All ${params.type}s in Module`,
    type: type,
    parentLo: course.lo,
    route: "wall"
  });
  return {
    type: params.type,
    lo: course.lo,
    los: los,
    panelVideos: los.filter((lo) => lo.type === "panelvideo"),
    talkVideos: los.filter((lo) => lo.type !== "panelvideo")
  };
};
