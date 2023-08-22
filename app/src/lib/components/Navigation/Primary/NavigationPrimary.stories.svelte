<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import {
    NavigationPrimary,
    NavigationPrimaryTitle,
    NavigationPrimaryButton,
    NavigationPrimaryUser
  } from "$lib/components";
</script>

<Meta title="Tutors/Navigation/Primary" component={NavigationPrimary} />

<Story name="Default">
  <NavigationPrimary>
    <svelte:fragment slot="lead">
      <NavigationPrimaryTitle title="Tutors" image="https://tutors.dev/logo.svg" />
    </svelte:fragment>
    <svelte:fragment slot="trail">
      <NavigationPrimaryUser
        onlineStatus
        usersOnline="3"
        avatar="https://avatars.githubusercontent.com/u/76656637?v=4"
        name="Jordan Harrison"
      />
      <NavigationPrimaryButton href="#" label="Go Somewhere" />
    </svelte:fragment>
  </NavigationPrimary>
</Story>
