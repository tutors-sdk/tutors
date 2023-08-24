<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import { NavigationPrimaryButton } from "$lib/components";
</script>

<Meta title="Tutors/Navigation/Primary/Button" component={NavigationPrimaryButton} />

<Template let:args>
  <NavigationPrimaryButton {...args} />
</Template>

<Story name="Default" args={{ href: "#", label: "default" }} />

<Story name="Link">
  <NavigationPrimaryButton href="#" label="Link" />
</Story>

<Story name="Button">
  <NavigationPrimaryButton label="Button" on:click={() => alert("Clicked")} />
</Story>
