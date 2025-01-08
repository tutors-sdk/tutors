/* eslint-disable @typescript-eslint/ban-ts-comment */
import { browser } from "$app/environment";
import { themeService } from "$lib/services/themes";
import { snow } from "./snow";

export async function makeItSnow() {
  if (themeService.lightMode.value === "light") {
    snow.background.color = "#ffffff"; // White background for light mode
    snow.particles.color.value = "#e8d1d2"; // Red snowflakes in light mode
  } else {
    snow.background.color = "#000000"; // Black background for dark mode
    snow.particles.color.value = "#ffffff"; // White snowflakes in dark mode
  }

  // @ts-expect-error
  // eslint-disable-next-line no-undef
  await loadSnowPreset(tsParticles);
  // @ts-expect-error
  // eslint-disable-next-line no-undef
  tsParticles.load({
    id: "tsparticles",
    options: {
      //preset: "snow",
      ...snow,
      fullScreen: {
        enable: true,
        zIndex: -1 // Set z-index here
      }
    }
  });
}

export async function makeItStopSnowing() {
  const element = document.getElementById("tsparticles");
  if (element) {
    element.remove();
  }
}
