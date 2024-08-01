import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import type { Course } from "$lib/services/models/lo-types";
import { backgroundPattern, textureBackground } from "../../charts/tutors-charts-background-url";
import type { Session } from "@supabase/supabase-js";
import { filterByType } from "$lib/services/models/lo-utils";
import { piechart } from "../../charts/piechart";
import type { DrilledDownData } from "$lib/services/types/supabase-metrics";
import { BasePieChart } from "./base-pie-chart";
echarts.use([TooltipComponent, LegendComponent, PieChart, BarChart, GridComponent, CanvasRenderer, LabelLayout]);

const bgTexture = textureBackground;
const bgPatternSrc = backgroundPattern;

const piePatternImg = new Image();
piePatternImg.src = bgTexture;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

export class LabPieChart extends BasePieChart<number> {
  labs: string[];

  constructor(course: Course, session: Session) {
    super(course, session);
    this.labs = [];
  }

  renderChart() {
    super.renderChart(); // Initialize and set up click handlers

    this.titleTimesMap.clear();
    this.totalTimesMap.clear();

    let labs = filterByType(this.course.los, "lab");
    let steps = filterByType(this.course.los, "step");

    const allLabSteps = [...labs, ...steps];

    allLabSteps.forEach((lo) => {
      const timeActive = lo.learningRecords?.get(this.session.user.user_metadata.user_name)?.timeActive || 0;
      this.updateMaps(lo, timeActive, (lo) => (lo.type === "lab" ? lo.title : lo.parentLo!.title));
    });

    const singleUserInnerData = Array.from(this.titleTimesMap.entries()).map(([title, timeActive]) => ({
      name: title,
      value: timeActive
    }));

    const singleUserOuterData: DrilledDownData[] = [];
    this.totalTimesMap.forEach((steps, title) => {
      steps.forEach((step) => {
        if (step.type !== undefined) {
          singleUserOuterData.push({
            name: step.name,
            value: step.value,
            type: step.type
          });
        }
      });
    });

    const option = piechart(bgPatternImg, [], singleUserInnerData, singleUserOuterData);
    super.setOption(option);
  }
}
