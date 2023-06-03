import type { Meta, StoryObj } from "@storybook/svelte";

import Metric from "./Metric.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
  title: "Legacy/Atoms/Metric",
  component: Metric,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "text" }
    },
    title: {
      control: { type: "text" },
      options: ["title"]
    }
  }
} satisfies Meta<Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const metric: Story = {
  args: {
    value: 50,
    title: "title"
  }
};
