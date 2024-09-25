import { BaseHeatMapChart } from "./base-heat-map";
import { getCompositeValues, getSimpleTypesValues } from "$lib/services/utils/supabase-utils";
import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";

export class TopicHeatMapChart extends BaseHeatMapChart<number> {
  topics: Lo[];

  constructor(course: Course, session: Session, userIds: string[], userAvatarsUseridsMap: Map<string, [string, string]>, multipleUsers: boolean) {
    super(course, session, userIds, userAvatarsUseridsMap, multipleUsers);
    this.topics = getCompositeValues(course.los).concat(getSimpleTypesValues(course.los));
  }

  async populateAndRenderData() {
    if (this.multipleUsers) {
      await this.populateAndRenderUsersData(this.topics, this.userIds, "topic");
      this.prepareCombinedTopicData(this.topics, this.userIds, (lo) => (lo.parentLo?.type === "topic" ? lo.parentLo.title : lo.title));
    } else {
      await this.populateAndRenderSingleUserData(this.session, this.topics, "topic");
    }
  }

  getTitleRecursively(lo: Lo) {
    // Base case: if the lo has a parentLo with type 'topic', return the parent's title
    if (lo.parentLo?.type === "topic") {
      return lo.parentLo.title;
    }

    // Default case: return the current lo's title
    return lo.title;
  }

  renderChart(container: HTMLElement) {
    super.renderChart(container, "Topic Activity: Per Student (click a cell to sort)");
  }
}
