/**
 * Navigation icon with link and tooltip
 */
export type IconNav = {
  link: string;
  type: string;
  tip: string;
  target: string;
};

/**
 * Collection of navigation icons
 */
export type IconNavBar = {
  show: boolean;
  bar: IconNav[];
};

/**
 * Icon definition with type and color
 */
export type IconType = {
  type: string;
  color: string;
};
