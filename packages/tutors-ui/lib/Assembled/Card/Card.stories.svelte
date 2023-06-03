<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import { CodeBlock } from '@skeletonlabs/skeleton';

  import Card from "../../Components/Card/Card.svelte";
  import CardHeader from "../../Components/Card/CardHeader.svelte";
  import CardImage from "../../Components/Card/CardImage.svelte";
  import CardFooter from "../../Components/Card/CardFooter.svelte";
</script>

<Meta title="Tutors UI/Card" />

<Story name="Card with Image">
  <div class="flex">
  <Card href="#" target="_blank" type="primary" compact={false}>
    <CardHeader title="Card Title" type="talk" />
    <CardImage image="https://picsum.photos/400" />
    <CardFooter summary="Card Summary" />
  </Card>
  <Card href="#" target="_blank" type="primary" compact={false}>
    <CardHeader title="Card Title" type="talk" />
    <CardImage image="https://picsum.photos/400" />
    <CardFooter summary="Card Summary" />
  </Card>
  <Card href="#" target="_blank" type="primary" compact={false}>
    <CardHeader title="Card Title" type="talk" />
    <CardImage image="https://picsum.photos/400" />
    <CardFooter summary="Card Summary" />
  </Card>
  </div>

  <CodeBlock language="svelte" code={`
<Card href="#" target="_blank" type="primary" compact={false}>
  <CardHeader title="Card Title" type="talk" />
  <CardImage image="https://picsum.photos/400" />
  <CardFooter summary="Card Summary" />
</Card>`} />
</Story>

<Story name="Card with Icon">
  <div class="flex">
  <Card href="#" target="_blank" type="primary" compact={false}>
    <CardHeader title="Card Title" type="talk" />
    <CardImage icon="ic:twotone-webhook" iconColor="#ffc34d" />
    <CardFooter summary="Card Summary" />
  </Card>
  <Card href="#" target="_blank" type="primary" compact={false}>
    <CardHeader title="Card Title" type="talk" />
    <CardImage icon="ic:twotone-webhook" iconColor="#ffc34d" />
    <CardFooter summary="Card Summary" />
  </Card>
  <Card href="#" target="_blank" type="primary" compact={false}>
    <CardHeader title="Card Title" type="talk" />
    <CardImage icon="ic:twotone-webhook" iconColor="#ffc34d" />
    <CardFooter summary="Card Summary" />
  </Card>
  </div>

  <CodeBlock language="svelte" code={`
<Card href="#" target="_blank" type="primary" compact={false}>
  <CardHeader title="Card Title" type="talk" />
  <CardImage icon="ic:twotone-webhook" iconColor="#ffc34d" />
  <CardFooter summary="Card Summary" />
</Card>`} />
</Story>