<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import NavTitle from "./NavTitle.svelte";
</script>

<Meta title="Tutors UI/Navigation" component={NavTitle} />

<Template let:args>
  <div class="flex">
    <NavTitle {...args} />
  </div>
</Template>

<Story name="NavTitle" args={{image: 'https://picsum.photos/400', title: 'Title Here', subtitle: 'Subtitle Here'}} />