export const icons = {
  'course': 'fluent:notebook-24-filled',
  'topic': 'fluent:bookmark-24-filled',
  'talk': 'fluent:presenter-24-filled',
  'paneltalk': 'fluent:presenter-24-filled',
  'reference': 'fluent:document-copy-24-filled',
  'lab': 'fluent:beaker-24-filled',
  'archive': 'fluent:archive-24-filled',
  'panelvideo': 'fluent:video-clip-24-regular',
  'video': 'fluent:video-clip-24-filled',
  'github': 'fluent:code-circle-20-filled',
  'moduleHome': 'fluent:home-24-filled',
  'web': 'fluent:bookmark-24-regular',
  'unit': 'fluent:dual-screen-group-24-filled',
  'side': 'fluent:dual-screen-group-24-filled',
  'note': 'fluent:notepad-16-regular',
  'panelnote': 'fluent:notepad-16-regular',
  'moodle': 'fluent:hat-graduation-24-filled',
  'slack': 'fluent:chat-24-filled',
  'youtube': 'fluent:video-clip-24-filled',
  'zoom': 'fluent:video-24-filled',
  'teams': 'logos:microsoft-teams',
  'toc': "fluent:line-horizontal-3-20-filled",
  'info': "fluent:info-28-regular",
} as const;

export const colours = {
  'course': '#37919b',
  'topic': '#37919b',
  'talk': '#37919b',
  'reference': '#d27711',
  'lab': '#557927',
  'archive': '#37919b',
  'panelvideo': '#ba5150',
  'video': '#ba5150',
  'github': '#d27711',
  'moduleHome': '#37919b',
  'web': '#ba5150',
  'unit': '#557927',
  'note': '#d27711',
  'panelnote': '#d27711',
} as const;

export const backgroundColours = {
  'course': '#37919b',
  'topic': '#37919b',
  'talk': '#f4ecce',
  'reference': '#d27711',
  'lab': '#557927',
  'archive': '#37919b',
  'panelvideo': '#ba5150',
  'video': '#ba5150',
  'github': '#d27711',
  'moduleHome': '#37919b',
  'web': '#ba5150',
  'unit': '#557927',
  'side': '#557927',
  'note': '#d27711',
  'panelnote': '#d27711',
} as const;

export type IconType = keyof typeof icons;

export function getIconType(type: IconType): string {
  if (type in icons) {
    return icons[type];
  }
  // Fallback to a default icon if type doesn't exist
  return icons.course;
}

export const loColours = {
  "course"     : { border: "#37919b", background: "#37919b" },
  "topic"      : { border: "#53a878", background: "#d9eee0" },
  "talk"       : { border: "#cb9d00", background: "#f4ecce" },
  "paneltalk"  : { border: "#cb9d00", background: "#f4ecce" },
  "reference"  : { border: "#37919b", background: "#37919b" },
  "lab"        : { border: "#d00034", background: "#fac5c8" },
  "archive"    : { border: "#d00034", background: "#fac5c8" },
  "panelvideo" : { border: "#ff0032", background: "#ff0032" },
  "video"      : { border: "#ff0032", background: "#ff0032" },
  "github"     : { border: "#cb9d00", background: "#f4ecce" },
  "moduleHome" : { border: "#37919b", background: "#37919b" },
  "web"        : { border: "#008c8f", background: "#d6e9e9" },
  "unit"       : { border: "#37919b", background: "#37919b" },
  "side"       : { border: "#37919b", background: "#37919b" },
  "note"       : { border: "#53a878", background: "#d9eee0" },
  "panelnote"  : { border: "#37919b", background: "#37919b" },
  "moodle"     : { border: "#37919b", background: "#37919b" },
  "slack"      : { border: "#37919b", background: "#37919b" },
  "youtube"    : { border: "#37919b", background: "#37919b" },
  "zoom"       : { border: "#37919b", background: "#37919b" },
  "teams"      : { border: "#37919b", background: "#37919b" },
  "toc"        : { border: "#37919b", background: "#37919b" },  
  "info"       : { border: "#37919b", background: "#37919b" },
}

export function loBorderColour(type: IconType): string {
  return loColours[type].border;
}

export function loBackgroundColour(type: IconType): string {
  return loColours[type].background;
}
  