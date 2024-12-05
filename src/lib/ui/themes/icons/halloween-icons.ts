import type { IconLib } from "$lib/services/models/lo-types";

export const HalloweenIconLib: IconLib = {
  // Home type
  programHome: { type: "cib:nodemon", color: "warning" },

  // companion types
  slack: { type: "fluent:chat-24-filled", color: "warning" },
  moodle: { type: "mdi:wizard-hat", color: "warning" },
  youtube: { type: "fluent:video-clip-24-filled", color: "warning" },
  video: { type: "fluent:video-clip-24-filled", color: "warning" },
  zoom: { type: "fluent:video-24-filled", color: "warning" },
  teams: { type: "logos:microsoft-teams", color: "bg-base-content" },

  // LoTypes types
  course: { type: "fa-solid:book-dead", color: "warning" },
  topic: { type: "ph:sword-duotone", color: "warning" },
  unit: { type: "type-park-outline:pumpkin", color: "warning" },
  side: { type: "type-park-outline:pumpkin", color: "warning" },
  talk: { type: "carbon:bat", color: "warning" },
  reference: { type: "emojione-monotone:skull", color: "warning" },
  lab: { type: "mdi:spider-thread", color: "warning" },
  archive: { type: "emojione-monotone:spider-web", color: "warning" },
  web: { type: "fluent:bookmark-24-regular", color: "warning" },
  github: { type: "fluent:code-circle-20-filled", color: "warning" },
  panelvideo: { type: "whh:wizard", color: "warning" },

  // pdf reader types
  left: { type: "fluent:ios-arrow-left-24-filled", color: "warning" },
  right: { type: "fluent:ios-arrow-right-24-filled", color: "warning" },
  print: { type: "fluent:print-24-filled", color: "warning" },
  rotate: { type: "fluent:arrow-rotate-clockwise-24-filled", color: "warning" },
  download: { type: "fluent:arrow-download-24-filled", color: "warning" },
  fullScreen: { type: "fluent:arrow-expand-24-filled", color: "warning" },

  // tutors time types
  tutorsTime: { type: "fluent:clock-alarm-24-filled", color: "warning" },
  timeExport: { type: "fluent:save-arrow-right-24-filled", color: "warning" },
  live: { type: "fluent:people-community-24-filled", color: "warning" },

  // app types
  search: { type: "uil:hunting", color: "warning" },
  tutors: { type: "fa-solid:chalkboard-teacher", color: "warning" },
  logout: { type: "fluent:sign-out-24-filled", color: "warning" },
  dark: { type: "uil:thunderstorm-moon", color: "warning" },
  toc: { type: "fluent:line-horizontal-3-20-filled", color: "warning" },
  compacted: { type: "mdi:coffin", color: "warning" },
  expanded: { type: "mdi:coffin", color: "warning" },
  edit: { type: "typcn:edit", color: "primary" },

  default: { type: "mdi:coffin", color: "warning" }
};
