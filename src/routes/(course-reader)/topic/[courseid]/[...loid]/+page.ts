import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course/services/course.svelte";
import type { Topic } from "$lib/services/base/lo-types";

export const ssr = false;

export const load: PageLoad = async ({ params, url, fetch }) => {
  const topicId = url.pathname;
  const topic = (await courseService.readTopic(params.courseid, topicId, fetch)) as Topic;

  return {
    topic: topic
  };
};
