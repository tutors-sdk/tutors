export const load = async ({ params, parent, fetch }) => {
  // presenceService.startCoursePresenceListener(params.courseid);
  return {
    courseid: params.courseid
  };
};
