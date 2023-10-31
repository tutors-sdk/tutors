import type { Meta, StoryObj } from "@storybook/svelte";
import Example from "./Example.svelte";

const meta = {
  title: "Tutors/Example",
  component: Example,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["btn-sm", "btn-md", "btn-lg"]
    }
  }
} satisfies Meta<Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    label: "Example"
  }
};

export const Large: Story = {
  args: {
    size: "btn-lg",
    label: "Example"
  }
};

export const Small: Story = {
  args: {
    size: "btn-sm",
    label: "Example"
  }
};
