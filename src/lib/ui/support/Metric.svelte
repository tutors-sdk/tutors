<script lang="ts">
  interface Props {
    value?: number;
    title?: string;
  }
  let { value = 0, title = "" }: Props = $props();
</script>

{#if value}
  <span class="ml-12 mr-6">
    <span class="chip text-primary-100 bg-error-400">{value}</span>
    <div class="text-primary-500 hidden text-xs md:inline-block">{title}</div>
  </span>
{/if}
