import type { CatalogueEntry, CatalogueService } from "$lib/services/community";
import { supabase } from "../utils/supabase-client";
import { courseBaseDomain } from "$lib/services/course/config";
import log from "$lib/services/logger";

export const catalogueService: CatalogueService = {
  async getCatalogue() {
    try {
      const { data, error } = await supabase.from("tutors-connect-courses").select("*").order("visited_at", { ascending: false });

      if (error) {
        throw error;
      }

      const catalogue = data as Array<CatalogueEntry>;
      return catalogue;
    } catch (error) {
      log.error("Error fetching courses:", error);
      return [];
    }
  },

  async getCatalogueCount() {
    try {
      const { count, error } = await supabase.from("tutors-connect-courses").select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      log.error("Error fetching course count:", error);
      return 0;
    }
  },

  async getStudentCount() {
    try {
      const { count, error } = await supabase.from("tutors-connect-profiles").select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      log.error("Error fetching course count:", error);
      return 0;
    }
  },

  async pruneCatalogue(fetchFunction: typeof fetch) {
    const catalogue = await this.getCatalogue();
    log.debug(`Total courses: ${catalogue.length}`);
    const invalidIds: string[] = [];
    for (const course of catalogue) {
      try {
        const url = `https://${course.course_id}${courseBaseDomain}/tutors.json`;
        const response = await fetchFunction(url, { method: "HEAD" });
        if (!response.ok) {
          invalidIds.push(course.course_id);
        }
      } catch {
        invalidIds.push(course.course_id);
      }
    }
    log.debug(`Invalid IDs: ${invalidIds.join(", ")}`);
    log.debug(`Invalid count: ${invalidIds.length}`);

    if (invalidIds.length > 0) {
      await this.deleteCourses(invalidIds);
    }
  },

  async deleteCourses(courseIds: string[]) {
    try {
      const { error } = await supabase.from("tutors-connect-courses").delete().in("course_id", courseIds);

      if (error) {
        log.error("Error deleting courses:", error);
        throw error;
      }
      log.debug(`Successfully deleted ${courseIds.length} courses`);
    } catch (error) {
      log.error("Error in deleteCourses:", error);
      throw error;
    }
  }
};
