<script lang="ts">
  interface Props {
    data: any;
  }
  let { data }: Props = $props();
</script>

<div class="container mx-auto mt-2 items-center justify-between lg:flex">
  <div class="mx-4">
    <div class="prose dark:prose-invert">
      {@html data.page}
    </div>
  </div>
</div>
