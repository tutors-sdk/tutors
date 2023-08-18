import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import { currentLo } from "$lib/stores";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  let topicId = params.loid;
  let unitId = "";
  let unitPos = topicId.indexOf("/unit");
  if (unitPos !== -1) {
    unitId = topicId.slice(unitPos + 1);
    topicId = topicId.slice(0, unitPos);
  }
  unitPos = topicId.indexOf("/side");
  if (unitPos !== -1) {
    unitId = topicId.slice(unitPos + 1);
    topicId = topicId.slice(0, unitPos);
  }
  if (topicId.slice(-1) == "/") topicId = topicId.slice(0, -1);
  const topic = await courseService.readTopic(params.courseid, topicId, fetch);
  if (unitPos !== -1) {
    const unitLo = topic.lo.los.filter((lo) => lo.id == unitId);
    currentLo.set(unitLo[0]);
  } else {
    currentLo.set(topic.lo);
    unitId = "";
  }

  return {
    course: topic.course,
    topic: topic,
    lo: topic.lo,
    unitId: unitId
  };
};
