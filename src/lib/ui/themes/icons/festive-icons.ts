import type { IconLib } from "$lib/services/models/lo-types";

export const FestiveIcons: IconLib = {
  // Home Icon
  programHome: { type: "tabler:christmas-ball", color: "success" },

  // companion Icons
  slack: { type: "logos:slack-icon", color: "error" },
  moodle: { type: "academicons:moodle", color: "warning" },
  youtube: { type: "fa:youtube", color: "error" },
  video: { type: "fluent:video-clip-24-filled", color: "error" },
  zoom: { type: "fluent:video-24-filled", color: "primary" },
  teams: { type: "logos:microsoft-teams", color: "bg-base-content" },

  // LoTypes icons
  course: { type: "fxemoji:present", color: "primary" },
  topic: { type: "twemoji:christmas-tree", color: "secondary" },
  unit: { type: "fxemoji:fatherchristmas", color: "tertiary" },
  side: { type: "fxemoji:fatherchristmas", color: "success" },
  talk: { type: "fluent:presenter-24-filled", color: "warning" },
  reference: { type: "fluent:document-copy-24-filled", color: "surface" },
  lab: { type: "fluent:beaker-24-filled", color: "error" },
  note: { type: "fluent:notepad-16-regular", color: "success" },
  archive: { type: "fluent:archive-24-filled", color: "error" },
  web: { type: "noto:star", color: "primary" },
  github: { type: "mdi:github", color: "warning" },
  panelvideo: { type: "fluent:video-clip-24-regular", color: "error" },
  paneltalk: { type: "fluent:presenter-24-filled", color: "primary" },
  panelnote: { type: "fluent:notepad-16-regular", color: "warning" },

  // pdf reader icons
  left: { type: "fluent:ios-arrow-left-24-filled", color: "success" },
  right: { type: "fluent:ios-arrow-right-24-filled", color: "success" },
  print: { type: "fluent:print-24-filled", color: "success" },
  rotate: { type: "fluent:arrow-rotate-clockwise-24-filled", color: "success" },
  download: { type: "fluent:arrow-download-24-filled", color: "success" },
  fullScreen: { type: "fluent:arrow-expand-24-filled", color: "success" },

  // tutors time icons
  online: { type: "fluent:presence-available-24-filled", color: "success" },
  offline: { type: "fluent:presence-available-24-regular", color: "error" },
  tutorsTime: { type: "fluent:clock-alarm-24-filled", color: "primary" },
  timeExport: { type: "fluent:save-arrow-right-24-filled", color: "success" },
  live: { type: "fluent:people-community-24-filled", color: "success" },

  // app icons
  search: { type: "fluent:search-24-filled", color: "primary" },
  tutors: { type: "fa-solid:chalkboard-teacher", color: "bg-base-content" },
  logout: { type: "fluent:sign-out-24-filled", color: "error" },
  lightMode: { type: "fluent:paint-brush-24-filled", color: "warning" },
  light: { type: "fluent:weather-sunny-32-filled", color: "warning" },
  dark: { type: "fluent:weather-moon-48-filled", color: "warning" },
  toc: { type: "fluent:line-horizontal-3-20-filled", color: "bg-base-content" },
  compacted: { type: "fluent:re-order-dots-vertical-24-filled", color: "success" },
  expanded: { type: "fluent:re-order-dots-horizontal-24-filled", color: "success" },
  courseinfo: { type: "fluent:info-28-regular", color: "bg-base-content" },
  calendar: { type: "fluent:calendar-ltr-12-regular", color: "bg-base-content" },
  appSettings: { type: "fluent:settings-24-filled", color: "primary" },
  listOnline: { type: "fluent:people-list-24-filled", color: "primary" },
  edit: { type: "typcn:edit", color: "primary" },
  info: { type: "fluent:info-28-regular", color: "primary" },
  close: { type: "fluent:add-square-32-regular", color: "primary" },
  default: { type: "fluent:re-order-dots-vertical-24-filled", color: "error" }
};
