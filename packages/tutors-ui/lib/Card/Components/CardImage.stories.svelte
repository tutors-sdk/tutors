<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import CardImage from "./CardImage.svelte";
</script>

<Meta title="Tutors UI/Card/Components" component={CardImage} />

<Template let:args>
  <CardImage {...args}>
  </CardImage>
</Template>

<Story name="CardImage" args={{image: 'https://picsum.photos/400'}} />