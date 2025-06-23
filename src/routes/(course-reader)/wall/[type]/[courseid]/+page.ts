import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import { currentLo } from "$lib/runes.svelte";
export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  const los = await courseService.readWall(params.courseid, params.type, fetch);
  const type = params.type;

  currentLo.value = {
    breadCrumbs: [course],
    title: `All ${params.type}s in Module`,
    type: type,
    parentLo: course,
    parentCourse: course,
    route: "wall"
  };
  return {
    type: params.type,
    lo: course,
    los: los
  };
};
