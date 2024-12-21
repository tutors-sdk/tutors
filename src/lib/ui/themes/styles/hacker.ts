import type { Theme } from '@skeletonlabs/skeleton/themes';

const hacker = {
  name: "hacker",
  properties: {
    // Typography
    "--type-scale-factor": "1.067",
    "--type-scale-1": "calc(0.75rem * var(--type-scale-factor))",
    "--type-scale-2": "calc(0.875rem * var(--type-scale-factor))",
    "--type-scale-3": "calc(1rem * var(--type-scale-factor))",
    "--type-scale-4": "calc(1.125rem * var(--type-scale-factor))",
    "--type-scale-5": "calc(1.25rem * var(--type-scale-factor))",
    "--type-scale-6": "calc(1.5rem * var(--type-scale-factor))",
    "--type-scale-7": "calc(1.875rem * var(--type-scale-factor))",
    "--type-scale-8": "calc(2.25rem * var(--type-scale-factor))",
    "--type-scale-9": "calc(3rem * var(--type-scale-factor))",
    "--type-scale-10": "calc(3.75rem * var(--type-scale-factor))",
    "--type-scale-11": "calc(4.5rem * var(--type-scale-factor))",
    "--type-scale-12": "calc(6rem * var(--type-scale-factor))",
    "--type-scale-13": "calc(8rem * var(--type-scale-factor))",

    // Font settings
    "--base-font-family": "'JetBrains Mono', 'Fira Code', monospace",
    "--base-font-size": "inherit",
    "--base-line-height": "1.6",
    "--base-font-weight": "normal",
    "--base-font-style": "normal",
    "--base-letter-spacing": "0.02em",

    // Colors for light mode
    "--color-primary-50": "0 77 0",     // Dark green for light mode
    "--color-primary-100": "0 92 0",
    "--color-primary-200": "0 107 0",
    "--color-primary-300": "0 122 0",
    "--color-primary-400": "0 137 0",
    "--color-primary-500": "0 153 0",    // Matrix green (darker for light mode)
    "--color-primary-600": "0 168 0",
    "--color-primary-700": "0 183 0",
    "--color-primary-800": "0 198 0",
    "--color-primary-900": "0 214 0",
    "--color-primary-950": "0 229 0",

    // Surface colors (light greys for light mode)
    "--color-surface-50": "255 255 255",  // White
    "--color-surface-100": "240 240 240",
    "--color-surface-200": "225 225 225",
    "--color-surface-300": "210 210 210",
    "--color-surface-400": "195 195 195",
    "--color-surface-500": "180 180 180",
    "--color-surface-600": "165 165 165",
    "--color-surface-700": "150 150 150",
    "--color-surface-800": "135 135 135",
    "--color-surface-900": "120 120 120",
    "--color-surface-950": "105 105 105",

    // Error colors (cyber red)
    "--color-error-50": "255 100 100",
    "--color-error-100": "255 80 80",
    "--color-error-200": "255 60 60",
    "--color-error-300": "255 40 40",
    "--color-error-400": "255 20 20",
    "--color-error-500": "255 0 0",
    "--color-error-600": "235 0 0",
    "--color-error-700": "215 0 0",
    "--color-error-800": "195 0 0",
    "--color-error-900": "175 0 0",
    "--color-error-950": "155 0 0",

    // Base colors for light/dark modes
    "--base-font-color": "var(--color-surface-950)",      // Dark grey in light mode
    "--base-font-color-dark": "var(--color-primary-400)", // Light green in dark mode

    // Heading styles
    "--heading-font-family": "'JetBrains Mono', monospace",
    "--heading-font-weight": "bold",
    "--heading-font-style": "normal",
    "--heading-letter-spacing": "0.05em",
    "--heading-font-color": "var(--color-primary-500)",   // Matrix green in light mode
    "--heading-font-color-dark": "var(--color-primary-400)", // Light green in dark mode

    // Link styles
    "--anchor-font-color": "var(--color-primary-600)",    // Slightly lighter green for links
    "--anchor-font-color-dark": "var(--color-primary-300)", // Brighter green in dark mode
    "--anchor-font-family": "inherit",
    "--anchor-font-size": "inherit",
    "--anchor-font-weight": "inherit",
    "--anchor-text-decoration": "none",
    "--anchor-text-decoration-hover": "underline",

    // Layout
    "--space-scale-factor": "1",
    "--radii-default": "4px",
    "--radii-container": "8px",
    "--border-width-default": "1px",
    "--divide-width-default": "1px",
    "--outline-width-default": "1px"
  },
  metadata: {
    version: "3.0.0"
  }
} satisfies Theme;

export default hacker;
