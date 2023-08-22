<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import NavigationPrimary from "./NavigationPrimary.svelte";
  import NavigationPrimaryTitle from "./Title/NavigationPrimaryTitle.svelte";
  import NavigationPrimaryButton from "./Button/NavigationPrimaryButton.svelte";
</script>

<Meta title="Tutors/Navigation/Primary" component={NavigationPrimary} />

<Story name="Default">
  <NavigationPrimary>
    <svelte:fragment slot="lead">
      <NavigationPrimaryTitle title="Tutors" image="https://tutors.dev/logo.svg" />
    </svelte:fragment>
    <svelte:fragment slot="trail">
      <NavigationPrimaryButton href="#" label="Sign in" />
    </svelte:fragment>
  </NavigationPrimary>
</Story>
