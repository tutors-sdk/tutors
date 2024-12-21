import type { IconLib } from "$lib/services/models/lo-types";

export const HackerIcons: IconLib = {
  // Home Icon
  programHome: { type: "vscode-icons:folder-src", color: "success" },

  // companion Icons
  slack: { type: "logos:slack-icon", color: "error" },
  moodle: { type: "academicons:moodle", color: "warning" },
  youtube: { type: "fa:youtube", color: "error" },
  video: { type: "vscode-icons:file-type-video", color: "error" },
  zoom: { type: "vscode-icons:file-type-video2", color: "primary" },
  teams: { type: "logos:microsoft-teams", color: "bg-base-content" },

  // LoTypes icons
  course: { type: "vscode-icons:folder-type-root", color: "primary" },
  topic: { type: "vscode-icons:folder-type-src", color: "secondary" },
  unit: { type: "vscode-icons:folder-type-module", color: "tertiary" },
  side: { type: "vscode-icons:folder-type-module", color: "success" },
  talk: { type: "vscode-icons:file-type-powerpoint2", color: "warning" },
  reference: { type: "vscode-icons:file-type-markdown", color: "surface" },
  lab: { type: "vscode-icons:file-type-testts", color: "error" },
  note: { type: "vscode-icons:file-type-text", color: "success" },
  archive: { type: "vscode-icons:file-type-zip", color: "error" },
  web: { type: "vscode-icons:file-type-html", color: "primary" },
  github: { type: "vscode-icons:file-type-git", color: "warning" },
  panelvideo: { type: "vscode-icons:file-type-video", color: "error" },
  paneltalk: { type: "vscode-icons:file-type-powerpoint", color: "primary" },
  panelnote: { type: "vscode-icons:file-type-text", color: "warning" },

  // pdf reader icons
  left: { type: "vscode-icons:folder-type-previous", color: "success" },
  right: { type: "vscode-icons:folder-type-next", color: "success" },
  print: { type: "vscode-icons:file-type-pdf2", color: "success" },
  rotate: { type: "vscode-icons:file-type-refresh", color: "success" },
  download: { type: "vscode-icons:file-type-download", color: "success" },
  fullScreen: { type: "vscode-icons:folder-type-expand", color: "success" },

  // tutors time icons
  online: { type: "vscode-icons:file-type-light-success", color: "success" },
  offline: { type: "vscode-icons:file-type-light-error", color: "error" },
  tutorsTime: { type: "vscode-icons:file-type-time", color: "primary" },
  timeExport: { type: "vscode-icons:file-type-excel2", color: "success" },
  live: { type: "vscode-icons:file-type-live", color: "success" },

  // app icons
  search: { type: "vscode-icons:file-type-search", color: "primary" },
  tutors: { type: "vscode-icons:file-type-teaching", color: "primary" },
  calendar: { type: "vscode-icons:file-type-calendar", color: "warning" },
  logout: { type: "vscode-icons:file-type-exit", color: "error" },
  login: { type: "vscode-icons:file-type-key", color: "success" },
  help: { type: "vscode-icons:file-type-help", color: "info" },
  settings: { type: "vscode-icons:file-type-settings", color: "warning" }
};
