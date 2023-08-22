<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import NavigationPrimaryButton from "./NavigationPrimaryButton.svelte";
</script>

<Meta title="Tutors/Navigation/Primary/Button" component={NavigationPrimaryButton} />

<Template let:args>
  <NavigationPrimaryButton {...args} />
</Template>

<Story
  name="Default"
  args={{
    href: "#",
    label: "Your Label"
  }}
/>
