
import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const festive: CustomThemeConfig = {
    name: "festive",
    properties: {
		// =~= Theme Properties =~=
        "--theme-font-family-base": "PlayfairDisplay, sans-serif",
        "--theme-font-family-heading": "PlayfairDisplay, sans-serif",
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #8b181d 
		"--color-primary-50": "238 220 221", // #eedcdd
		"--color-primary-100": "232 209 210", // #e8d1d2
        "--color-primary-200": "255 255 255", 
		"--color-primary-300": "209 163 165", // #d1a3a5
		"--color-primary-400": "174 93 97", // #ae5d61
		"--color-primary-500": "139 24 29", // #8b181d
		"--color-primary-600": "125 22 26", // #7d161a
		"--color-primary-700": "104 18 22", // #681216
		"--color-primary-800": "28 27 27",
		"--color-primary-900": "68 12 14", // #440c0e
		// secondary | #1f3102 
		"--color-secondary-50": "221 224 217", // #dde0d9
		"--color-secondary-100": "210 214 204", // #d2d6cc
		"--color-secondary-200": "199 204 192", // #c7ccc0
		"--color-secondary-300": "165 173 154", // #a5ad9a
		"--color-secondary-400": "98 111 78", // #626f4e
		"--color-secondary-500": "31 49 2", // #1f3102
		"--color-secondary-600": "28 44 2", // #1c2c02
		"--color-secondary-700": "23 37 2", // #172502
		"--color-secondary-800": "19 29 1", // #131d01
		"--color-secondary-900": "15 24 1", // #0f1801
		// tertiary | #ffffff 
		"--color-tertiary-50": "255 255 255", // #ffffff
		"--color-tertiary-100": "255 255 255", // #ffffff
		"--color-tertiary-200": "255 255 255", // #ffffff
		"--color-tertiary-300": "255 255 255", // #ffffff
		"--color-tertiary-400": "255 255 255", // #ffffff
		"--color-tertiary-500": "255 255 255", // #ffffff
		"--color-tertiary-600": "230 230 230", // #e6e6e6
		"--color-tertiary-700": "191 191 191", // #bfbfbf
		"--color-tertiary-800": "153 153 153", // #999999
		"--color-tertiary-900": "125 125 125", // #7d7d7d
		// success | #325632 
		"--color-success-50": "224 230 224", // #e0e6e0
		"--color-success-100": "214 221 214", // #d6ddd6
		"--color-success-200": "204 213 204", // #ccd5cc
		"--color-success-300": "173 187 173", // #adbbad
		"--color-success-400": "112 137 112", // #708970
		"--color-success-500": "50 86 50", // #325632
		"--color-success-600": "45 77 45", // #2d4d2d
		"--color-success-700": "38 65 38", // #264126
		"--color-success-800": "30 52 30", // #1e341e
		"--color-success-900": "25 42 25", // #192a19
		// warning | #ceac5c 
		"--color-warning-50": "248 243 231", // #f8f3e7
		"--color-warning-100": "245 238 222", // #f5eede
		"--color-warning-200": "243 234 214", // #f3ead6
		"--color-warning-300": "235 222 190", // #ebdebe
		"--color-warning-400": "221 197 141", // #ddc58d
		"--color-warning-500": "206 172 92", // #ceac5c
		"--color-warning-600": "185 155 83", // #b99b53
		"--color-warning-700": "155 129 69", // #9b8145
		"--color-warning-800": "124 103 55", // #7c6737
		"--color-warning-900": "101 84 45", // #65542d
        // error | #d81818 
		"--color-error-50": "249 220 220", // #f9dcdc
		"--color-error-100": "247 209 209", // #f7d1d1
		"--color-error-200": "245 197 197", // #f5c5c5
		"--color-error-300": "239 163 163", // #efa3a3
		"--color-error-400": "228 93 93", // #e45d5d
		"--color-error-500": "216 24 24", // #d81818
		"--color-error-600": "194 22 22", // #c21616
		"--color-error-700": "162 18 18", // #a21212
		"--color-error-800": "130 14 14", // #820e0e
		"--color-error-900": "106 12 12", // #6a0c0c
        // surface | #2a2e37
        "--color-surface-50": "255 255 255",
        "--color-surface-100": "224 230 224", //
        "--color-surface-200": "232 209 210", //
        "--color-surface-300": "162 169 184",
        "--color-surface-400": "77 84 101",
        "--color-surface-500": "42 46 55",
        "--color-surface-600": "104 18 22", //
        "--color-surface-700": "28 27 27",
        "--color-surface-800": "25 42 25", //
        "--color-surface-900": "28 27 27" // 
	}
}