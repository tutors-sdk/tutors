<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import Card from "./Card.svelte";
</script>

<Meta title="Components/Card" component={Card} />

<Template let:args>
  <Card {...args}>
  </Card>
</Template>

<Story name="Card" args={{href: '#', target: '_blank', width: 'w-96', type: 'primary'}} />