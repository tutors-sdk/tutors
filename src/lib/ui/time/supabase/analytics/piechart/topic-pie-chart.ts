import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import type { Course, Lo } from "$lib/services/models/lo-types";
import { backgroundPattern, textureBackground } from "../../charts/tutors-charts-background-url";
import type { Session } from "@supabase/supabase-js";
import type { DrilledDownData } from "$lib/services/types/supabase-metrics";
import { BasePieChart } from "./base-pie-chart";
import { piechart } from "../../charts/piechart";
import { getCompositeValues, getSimpleTypesValues } from "$lib/services/utils/supabase-utils";

echarts.use([TooltipComponent, LegendComponent, PieChart, BarChart, GridComponent, CanvasRenderer, LabelLayout]);

const bgTexture = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTexture;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class TopicPieChart extends BasePieChart<number> {
  topics: string[];
  userIds: string[];
  multipleUsers: boolean;

  constructor(course: Course, session: Session, userIds: string[], multipleUsers: boolean) {
    super(course, session);
    this.topics = [];
    this.userIds = userIds;
    this.multipleUsers = multipleUsers;
  }

  getOuterPieDataForMultipleUsers(): DrilledDownData[] {
    const outerPieData: { value: number; name: string }[] = [];
    this.titleTimesMap.forEach((value, key) => {
      const existing = outerPieData.find((data) => data.name === key);
      if (existing) {
        existing.value += value;
      } else {
        value = Math.round(value / 2);
        outerPieData.push({ value, name: key });
      }
    });

    return outerPieData;
  }

  renderChart() {
    super.renderChart(); // Initialize and set up click handlers

    const allComposites = getCompositeValues(this.course.los);
    const allSimpleTypes = getSimpleTypesValues(this.course.los);
    const allTypes = [...allComposites, ...allSimpleTypes];

    allTypes.forEach((lo) => {
      if (this.multipleUsers) {
        this.userIds.forEach((userId) => {
          const timeActive = lo.learningRecords?.get(userId)?.timeActive || 0;
          this.updateMaps(lo, timeActive, (lo) =>
            lo.parentTopic?.type === "topic" ? lo.parentTopic.title : lo.parentLo?.parentTopic?.type === "topic" ? lo.parentLo?.parentTopic?.title : lo.title
          );
        });
      } else {
        const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;
        this.updateMaps(lo, timeActive, (lo) =>
          lo.parentTopic?.type === "topic" ? lo.parentTopic.title : lo.parentLo?.parentTopic?.type === "topic" ? lo.parentLo?.parentTopic?.title : lo.title
        );
      }
    });

    if (this.multipleUsers === false) {
      const singleUserInnerData = Array.from(this.titleTimesMap.entries()).map(([title, timeActive]) => ({
        name: title,
        value: Math.round(timeActive / 2)
      }));

      const option = piechart(bgPatternImg, [], singleUserInnerData, []);
      super.setOption(option);
    } else {
      const allUsersTopicActivity = this.getOuterPieDataForMultipleUsers();
      const option = piechart(bgPatternImg, allUsersTopicActivity, [], []);
      super.setOption(option);
    }
  }
}
