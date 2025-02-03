import { catalogueService } from "$lib/services/community";

export const load = async ({ fetch }) => {
  let catalogueEntries = await catalogueService.getCatalogue();
  catalogueEntries = catalogueEntries
    .filter((entry) => entry.visit_count >= 20)
    .sort((a, b) => b.visit_count - a.visit_count);
  const courseRecords = catalogueEntries.map((entry) => ({
    ...entry.course_record,
    visits: entry.visit_count
  }));
  // await catalogueService.pruneCatalogue(fetch);
  return {
    courseRecords
  };
};
