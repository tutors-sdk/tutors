import type { Meta, StoryObj } from "@storybook/svelte";
import Title from "./NavigationPrimaryTitle.svelte";

const meta: Meta = {
  title: "Tutors/Navigation/Primary/Title",
  component: Title,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    image: { control: "text" },
    icon: { control: "text" },
    iconColour: { control: "text" }
  }
} satisfies Meta<Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Tutors",
    image: "https://tutors.dev/logo.svg"
  }
};

export const CourseExampleImage: Story = {
  args: {
    title: "Higher Diploma in Computer Science 2021",
    subtitle: "Department of Computing & Mathematics",
    image: "https://wit-hdip-comp-sci-2021.netlify.app//course.png"
  }
};

export const CourseExampleIcon: Story = {
  args: {
    title: "Web Development",
    subtitle: "Department of Computing & Mathematics",
    icon: "ri:file-code-fill",
    iconColour: "603980"
  }
};
