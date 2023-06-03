<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import NavButton from "./NavButton.svelte";

  function alertUser() {
    alert('You clicked the button!');
  }
</script>

<Meta title="Components/Navigation" component={NavButton} />

<Template let:args>
  <div class="flex">
    <NavButton {...args} on:click={alertUser} />
  </div>
</Template>

<Story name="NavButton" args={{icon: 'mdi:home', iconColor: 'primary-500', text: 'Home'}} />