import type { Meta, StoryObj } from "@storybook/svelte";

import Icon from "./Icon.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
  title: "Legacy/Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "slack",
        "moodle",
        "youtube",
        "video",
        "zoom",
        "teams",
        "course",
        "topic",
        "unit",
        "talk",
        "reference",
        "lab",
        "archive",
        "web",
        "github",
        "panelvideo",
        "paneltalk",
        "note",
        "left",
        "right",
        "print",
        "rotate",
        "download",
        "fullScreen",
        "online",
        "offline",
        "tutorsTime",
        "timeExport",
        "live",
        "search",
        "tutors",
        "logout",
        "dark",
        "toc",
        "compacted",
        "expanded",
        "courseinfo",
        "calendar",
        "appSettings",
        "listOnline"
      ]
    },
    width: {
      control: { type: "select" },
      options: ["20", "40", "60", "80", "100"]
    },
    height: {
      control: { type: "select" },
      options: ["20", "40", "60", "80", "100"]
    }
  }
} satisfies Meta<Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const icon: Story = {
  args: {
    type: "dark",
    width: "40",
    height: "40"
  }
};
