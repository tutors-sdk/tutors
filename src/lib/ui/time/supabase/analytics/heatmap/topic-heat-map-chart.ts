import { BaseHeatMapChart } from "./base-heat-map";
import { getCompositeValues, getSimpleTypesValues } from "$lib/services/utils/supabase-utils";
import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";

export class TopicHeatMapChart extends BaseHeatMapChart<number> {
  topics: Lo[];

  constructor(course: Course, session: Session, userIds: string[], userNamesUseridsMap: Map<string, string>, multipleUsers: boolean) {
    super(course, session, userIds, userNamesUseridsMap, multipleUsers);
    this.topics = getCompositeValues(course.los).concat(getSimpleTypesValues(course.los));
  }

  async populateAndRenderData() {
    if (this.multipleUsers) {
      await this.populateAndRenderUsersData(this.topics, this.userIds, "topic");
      this.prepareCombinedTopicData(this.topics, this.userIds, (lo) =>
        lo.parentTopic?.type === "topic" ? lo.parentTopic.title : lo.parentLo?.parentTopic?.type === "topic" ? lo.parentLo?.parentTopic?.title : lo.title
      );
    } else {
      await this.populateAndRenderSingleUserData(this.session, this.topics, "topic");
    }
  }

  renderChart(container: HTMLElement) {
    super.renderChart(container, "Topic Activity: Per Student (click a cell to sort)");
  }
}
