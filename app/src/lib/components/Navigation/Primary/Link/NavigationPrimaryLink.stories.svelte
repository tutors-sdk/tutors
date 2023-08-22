<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import NavigationPrimaryLink from "./NavigationPrimaryLink.svelte";
</script>

<Meta title="Tutors/Navigation/Primary/Link" component={NavigationPrimaryLink} />

<Template let:args>
  <NavigationPrimaryLink {...args} />
</Template>

<Story
  name="Default"
  args={{
    href: "#",
    label: "Your Label"
  }}
/>
