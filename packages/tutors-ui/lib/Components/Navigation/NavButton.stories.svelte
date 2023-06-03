<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import NavButton from "./NavButton.svelte";
</script>

<Meta title="Components/Navigation" component={NavButton} />

<Template let:args>
  <div class="flex">
    <NavButton {...args} />
  </div>
</Template>

<Story name="NavButton" args={{href: '#', icon: 'mdi:home', iconColor: 'primary-500', text: 'Home'}} />