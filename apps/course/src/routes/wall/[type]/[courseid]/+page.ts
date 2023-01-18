import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";
import { currentLo } from "tutors-reader-lib/src/stores/stores";

export const load: PageLoad = async ({ params }) => {
  const course = await courseService.readCourse(params.courseid);
  const los = await courseService.readWall(params.courseid, params.type);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:next-line
  currentLo.set({
    title: `All ${params.type}s in Module`,
    type: params.type,
    parentLo: course.lo,
    route: "wall"
  });

  const panelVideos = los.filter((lo) => lo.type === "panelvideo");
  const talkVideos = los.filter((lo) => lo.type !== "panelvideo");
  return { type: params.type, lo: course.lo, los, panelVideos, talkVideos };
};
