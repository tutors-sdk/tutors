import { FluentIconLib } from "./fluent-icons";

type ThemeIcon = {
  icon: string;
  colour: string;
};

type Theme = {};
let StandardIconLib = FluentIconLib;

export function setIconLib(iconLib: any) {
  StandardIconLib = iconLib;
}

export const themes = ["tutors", "tutors-dark", "tutors-black", "tutors-dyslexia", "tutors-wireframe"];

export const themeIcons = {
  tutors: FluentIconLib,
  "tutors-dark": FluentIconLib,
  "tutors-dyslexia": FluentIconLib,
  "tutors-black": FluentIconLib,
  "tutors-wireframe": FluentIconLib
};

export function getIcon(type: string): ThemeIcon {
  let icon = StandardIconLib.default;
  if (currentIconLib[type]) {
    icon = currentIconLib[type];
  } else {
    if (StandardIconLib[type]) {
      icon = StandardIconLib[type];
    }
  }
  return icon;
}

export const currentIconLib: any = StandardIconLib;

export function addIcon(type: string, icon: ThemeIcon) {
  StandardIconLib[type] = icon;
}
