import type { CatalogueEntry, CatalogueService } from "$lib/services/community";
import { supabase } from "$lib/services/base";

export const catalogueService: CatalogueService = {
  async getCatalogue() {
    try {
      const { data, error } = await supabase
        .from("tutors-connect-courses")
        .select("*")
        .order("visited_at", { ascending: false });

      if (error) {
        throw error;
      }

      const catalogue = data as Array<CatalogueEntry>;
      return catalogue;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  async getCatalogueCount() {
    try {
      const { count, error } = await supabase
        .from("tutors-connect-courses")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("Error fetching course count:", error);
      return 0;
    }
  },

  async getStudentCount() {
    try {
      const { count, error } = await supabase
        .from("tutors-connect-profiles")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("Error fetching course count:", error);
      return 0;
    }
  },

  async pruneCatalogue(fetchFunction: typeof fetch) {
    const catalogue = await this.getCatalogue();
    console.log(`Total courses: ${catalogue.length}`);
    const invalidIds: string[] = [];
    for (const course of catalogue) {
      try {
        const url = `https://${course.course_id}.netlify.app/tutors.json`;
        const response = await fetchFunction(url, { method: "HEAD" });
        if (!response.ok) {
          invalidIds.push(course.course_id);
        }
      } catch {
        invalidIds.push(course.course_id);
      }
    }
    console.log(`Invalid IDs: ${invalidIds.join(", ")}`);
    console.log(`Invalid count: ${invalidIds.length}`);

    if (invalidIds.length > 0) {
      await this.deleteCourses(invalidIds);
    }
  },

  async deleteCourses(courseIds: string[]) {
    try {
      const { error } = await supabase.from("tutors-connect-courses").delete().in("course_id", courseIds);

      if (error) {
        console.error("Error deleting courses:", error);
        throw error;
      }
      console.log(`Successfully deleted ${courseIds.length} courses`);
    } catch (error) {
      console.error("Error in deleteCourses:", error);
      throw error;
    }
  }
};
