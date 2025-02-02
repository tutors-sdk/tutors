import type { CardStyleType, LayoutType } from "$lib/services/themes";

type CardStyles = Record<LayoutType, Record<CardStyleType, string>>;

export interface CardStyleConfig {
  heading: CardStyles;
  dimensions: CardStyles;
  image: CardStyles;
  icon: CardStyles;
  iconHeight: CardStyles;
  text: CardStyles;
  avatar: CardStyles;
  container: CardStyles;
}

export const cardStyles: CardStyleConfig = {
  heading: {
    expanded: {
      portrait: "!text-lg font-medium",
      landscape: "!text-lg font-semibold",
      circular: "!text-md font-semibold"
    },
    compacted: {
      portrait: "!text-xs font-medium",
      landscape: "!text-md font-medium",
      circular: "!text-sm font-medium"
    }
  },
  dimensions: {
    expanded: {
      portrait: "w-60 h-[23rem]",
      landscape: "w-[28rem] h-48",
      circular: "w-64 h-64"
    },
    compacted: {
      portrait: "w-36 h-[14rem]",
      landscape: "w-[20rem] h-32",
      circular: "w-48 h-48"
    }
  },
  image: {
    expanded: {
      portrait: "h-40",
      landscape: "w-48",
      circular: "w-32 h-32"
    },
    compacted: {
      portrait: "h-16",
      landscape: "w-32",
      circular: "w-24 h-24"
    }
  },
  icon: {
    expanded: {
      portrait: "160",
      landscape: "120",
      circular: "120"
    },
    compacted: {
      portrait: "60",
      landscape: "60",
      circular: "60"
    }
  },
  iconHeight: {
    expanded: {
      portrait: "30",
      landscape: "40",
      circular: "50"
    },
    compacted: {
      portrait: "20",
      landscape: "20",
      circular: "20"
    }
  },
  text: {
    expanded: {
      portrait: "prose line-clamp-3 leading-6 dark:prose-invert",
      landscape: "prose line-clamp-3 leading-6 dark:prose-invert",
      circular: "prose line-clamp-3 leading-6 dark:prose-invert"
    },
    compacted: {
      portrait: "line-clamp-2 text-xs",
      landscape: "line-clamp-2 text-xs",
      circular: "line-clamp-2 text-xs"
    }
  },
  avatar: {
    expanded: {
      portrait: "w-12",
      landscape: "w-12",
      circular: "w-12"
    },
    compacted: {
      portrait: "w-8",
      landscape: "w-8",
      circular: "w-8"
    }
  },
  container: {
    expanded: {
      portrait: "border-y-8 flex flex-col",
      landscape: "border-l-8 flex",
      circular: "rounded-full border-4 flex flex-col"
    },
    compacted: {
      portrait: "border-y-8 flex flex-col",
      landscape: "border-l-8 flex",
      circular: "rounded-full border-4 flex flex-col"
    }
  }
};
