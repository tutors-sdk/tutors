import * as echarts from "echarts/core";
import { GraphicComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { backgroundPattern } from "./tutors-charts-background-url";

echarts.use([GraphicComponent, CanvasRenderer]);
const bgPatternImg = new Image();
bgPatternImg.src = backgroundPattern;

export function tutorsAnalyticsLogo(logoText: string) {
  return {
    backgroundColor: {
      image: bgPatternImg,
      repeat: "repeat"
    },
    graphic: {
      elements: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: logoText,
            fontSize: 80,
            fontWeight: "bold",
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: "transparent",
            stroke: "#0BE0C0",
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 3000,
            loop: true,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: "transparent",
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: "transparent"
                }
              },
              {
                percent: 1,
                style: {
                  fill: "black"
                }
              }
            ]
          }
        }
      ]
    }
  };
}
