import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import { currentLo } from "$lib/stores";
import type { Composite, Topic } from "$lib/services/models/lo-types";

export const ssr = false;

export const load: PageLoad = async ({ params, url, fetch }) => {
  let topicId = url.pathname;
  let unitId = "";
  let unitPos = topicId.indexOf("/unit");
  if (unitPos !== -1) {
    unitId = topicId.slice(unitPos + 1);
    topicId = topicId.slice(0, unitPos);
  }
  let sidePos = topicId.indexOf("/side");
  if (sidePos !== -1) {
    unitId = topicId.slice(sidePos + 1);
    topicId = topicId.slice(0, sidePos);
  }
  const topic = await courseService.readTopic(params.courseid, topicId, fetch) as Topic;
  if (unitPos !== -1) {
    const unitLo = topic.los.filter((lo) => lo.id == unitId);
    currentLo.set(unitLo[0]);
  } else {
    currentLo.set(topic);
    unitId = "";
  }

  return {
    topic: topic,
  };
};
