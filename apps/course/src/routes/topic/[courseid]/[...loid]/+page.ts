import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";
import { currentLo } from "tutors-reader-lib/src/stores/stores";

export const load: PageLoad = async ({ params }) => {
  let topicId = params.loid;
  let unitId = "";
  const unitPos = topicId.indexOf("/unit");
  if (unitPos !== -1) {
    unitId = topicId.slice(unitPos + 1);
    topicId = topicId.slice(0, unitPos);
  }
  if (topicId.slice(-1) == "/") topicId = topicId.slice(0, -1);
  const topic = await courseService.readTopic(params.courseid, topicId);
  if (unitPos !== -1) {
    const unitLo = topic.lo.los.filter((lo) => lo.id == unitId);
    currentLo.set(unitLo[0]);
  } else {
    currentLo.set(topic.lo);
    unitId = "";
  }

  return {
    topic: topic,
    lo: topic.lo,
    unitId: unitId
  };
};
