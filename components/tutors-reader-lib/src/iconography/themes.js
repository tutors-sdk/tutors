import { FluentIconLib } from "tutors-reader-lib/src/iconography/support/fluent-icons";
let StandardIconLib = FluentIconLib;
export function setIconLib(iconLib) {
    StandardIconLib = iconLib;
}
export const themes = ["tutors", "tutors-dark", "tutors-black", "tutors-dyslexia", "tutors-wireframe"];
export const themeIcons = {
    "tutors": FluentIconLib,
    "tutors-dark": FluentIconLib,
    "tutors-dyslexia": FluentIconLib,
    "tutors-black": FluentIconLib,
    "tutors-wireframe": FluentIconLib,
};
export function getIcon(type) {
    let icon = StandardIconLib.default;
    if (currentIconLib[type]) {
        icon = currentIconLib[type];
    }
    else {
        if (StandardIconLib[type]) {
            icon = StandardIconLib[type];
        }
    }
    return icon;
}
export let currentIconLib = StandardIconLib;
// currentCourse.subscribe((course) => {
//   if (course && course.lo && course.lo.properties.iconset) {
//     currentIconLib = course.lo.properties.iconset;
//   } else {
//     currentIconLib = StandardIconLib;
//   }
// });
export function addIcon(type, icon) {
    StandardIconLib[type] = icon;
}
//# sourceMappingURL=themes.js.map