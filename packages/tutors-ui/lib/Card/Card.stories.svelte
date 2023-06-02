<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import Card from "../Components/Card/Card.svelte";
  import CardHeader from "../Components/Card/CardHeader.svelte";
  import CardImage from "../Components/Card/CardImage.svelte";
  import CardFooter from "../Components/Card/CardFooter.svelte";
</script>

<Meta title="Tutors UI/Card" />

<Story name="Card with Image">
  <Card href="#" target="_blank" type="primary" width="w-96">
    <CardHeader title="Card Title" type="talk" />
    <CardImage image="https://picsum.photos/400" />
    <CardFooter summary="Card Summary" />
  </Card>
</Story>