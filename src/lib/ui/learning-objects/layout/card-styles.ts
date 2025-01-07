import type { CardStyleType, LayoutType } from "$lib/services/types.svelte";

type CardStyles = Record<LayoutType, Record<CardStyleType, string>>;

export const headdingTextStyles: CardStyles = {
  expanded: {
    portrait: "!text-lg font-medium",
    landscape: "!text-lg font-semibold",
    circular: "!text-lg font-semibold"
  },
  compacted: {
    portrait: "!text-xs font-medium",
    landscape: "!text-md font-medium",
    circular: "!text-sm font-medium"
  }
};

export const cardDimensionStyles: CardStyles = {
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
};

export const imageSizeStyles: CardStyles = {
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
};

export const iconSizeStyles: CardStyles = {
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
};

export const iconHeightStyles: CardStyles = {
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
};

export const textSizeStyles: CardStyles = {
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
};

export const avatarWidthStyles: CardStyles = {
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
};

export const cardContainerStyles: CardStyles = {
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
};
