<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import NavLink from "./NavLink.svelte";
</script>

<Meta title="Components/Navigation" component={NavLink} />

<Template let:args>
  <div class="flex">
    <NavLink {...args} />
  </div>
</Template>

<Story name="NavLink" args={{href: '#', icon: 'mdi:home', iconColor: 'primary-500', text: 'Home'}} />