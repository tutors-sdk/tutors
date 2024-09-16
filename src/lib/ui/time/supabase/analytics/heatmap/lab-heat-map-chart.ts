import { BaseHeatMapChart } from "./base-heat-map";
import { filterByType } from "$lib/services/models/lo-utils";
import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";

export class LabHeatMapChart extends BaseHeatMapChart<number> {
  labs: Lo[];

  constructor(course: any, session: Session, userIds: string[], userNamesUseridsMap: Map<string, string>, multipleUsers: boolean) {
    super(course, session, userIds, userNamesUseridsMap, multipleUsers);
    let labs = filterByType(course.los, "lab");
    let steps = filterByType(course.los, "step");

    this.labs = [...labs, ...steps];
  }

  async populateAndRenderData() {
    if (this.multipleUsers) {
      await this.populateAndRenderUsersData(this.labs, this.userIds, "lab");
      this.prepareCombinedTopicData(this.labs, this.userIds, (lo) => (lo.type === "lab" ? lo.title : lo.parentLo!.title));
    } else {
      await this.populateAndRenderSingleUserData(this.session, this.labs, "lab");
    }
  }

  getTitleRecursively(lo: Lo) {
    // Base case: if the lo has a parentLo with type 'topic', return the parent's title
    if (lo.parentLo?.type === "lab") {
      return lo.parentLo.title;
    }

    // Default case: return the current lo's title
    return lo.title;
  }

  renderChart(container: HTMLElement) {
    super.renderChart(container, "Lab Activity: Per Student (click a cell to sort)");
  }
}
