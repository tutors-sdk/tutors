import { supabase } from "./profiles/supabase-client";
import type { CatalogueEntry, CatalogueService } from "./types.svelte";

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
  }
};
