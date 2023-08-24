<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import { NavigationPrimaryUser } from "$lib/components";
</script>

<Meta title="Tutors/Navigation/Primary/User" component={NavigationPrimaryUser} />

<Template let:args>
  <NavigationPrimaryUser {...args} />
</Template>

<Story
  name="Default"
  args={{
    onlineStatus: true,
    usersOnline: "3",
    avatar: "https://avatars.githubusercontent.com/u/76656637?v=4",
    name: "Jordan Harrison"
  }}
/>
