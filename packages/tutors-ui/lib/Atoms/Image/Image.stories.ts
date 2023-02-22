import type { Meta, StoryObj } from "@storybook/svelte";

import Image from "./Image.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
  title: "Tutors/Atoms/Image",
  component: Image,
  tags: ["autodocs"]
} satisfies Meta<Image>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const image: Story = {};
