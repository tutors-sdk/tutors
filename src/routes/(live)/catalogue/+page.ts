import { catalogueService } from "$lib/services/catalogue";

export const load = async ({ fetch }) => {
  let catalogueEntries = await catalogueService.getCatalogue();
  catalogueEntries = catalogueEntries
    .filter((entry) => entry.visit_count >= 4)
    .sort((a, b) => b.visit_count - a.visit_count);
  const courseRecords = catalogueEntries.map((entry) => entry.course_record);
  return {
    courseRecords
  };
};
