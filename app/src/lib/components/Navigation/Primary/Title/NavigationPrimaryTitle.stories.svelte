<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import { NavigationPrimaryTitle } from "$lib/components";
</script>

<Meta title="Tutors/Navigation/Primary/Title" component={NavigationPrimaryTitle} />

<Template let:args>
  <NavigationPrimaryTitle {...args} />
</Template>

<Story
  name="Default"
  args={{
    title: "Tutors",
    image: "https://tutors.dev/logo.svg"
  }}
/>

<Story
  name="Course Example Image"
  args={{
    title: "Higher Diploma in Computer Science 2021",
    subtitle: "Department of Computing & Mathematics",
    image: "https://wit-hdip-comp-sci-2021.netlify.app//course.png"
  }}
/>

<Story
  name="Course Example Icon"
  args={{
    title: "Web Development",
    subtitle: "Department of Computing & Mathematics",
    icon: "ri:file-code-fill",
    iconColour: "603980"
  }}
/>
