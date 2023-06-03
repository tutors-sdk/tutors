<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import CardHeader from "./CardHeader.svelte";
</script>

<Meta title="Components/Card" component={CardHeader} />

<Template let:args>
  <CardHeader {...args}>
  </CardHeader>
</Template>

<Story name="CardHeader" args={{title: 'Card Title', type: 'talk', video: '#'}} />