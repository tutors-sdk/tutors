import type { Meta, StoryObj } from "@storybook/svelte";

import Footers from "./Footer.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
  title: "Legacy/Molecules/Footers",
  component: Footers,
  tags: ["autodocs"]
} satisfies Meta<Footers>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const footers: Story = {};
