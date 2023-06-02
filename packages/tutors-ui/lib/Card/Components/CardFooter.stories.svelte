<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import CardFooter from "./CardFooter.svelte";
</script>

<Meta title="Tutors UI/Card/Components" component={CardFooter} />

<Template let:args>
  <CardFooter {...args}>
  </CardFooter>
</Template>

<Story name="CardFooter" args={{summary: 'Card summary goes here'}} />