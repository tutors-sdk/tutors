<script lang="ts">
  interface Props {
    title?: string;
    subtitle?: string;
  }
  let { title = "", subtitle = "" }: Props = $props();
</script>

<div class="flex items-center">
  <div class="inline-flex">
    <img src="/logo.svg" alt={title} class="w-12 bg-none" />
  </div>
  <div class="ml-4 flex-nowrap">
    <h2 class="mr-4 hidden font-bold md:inline-block {subtitle ? 'text-lg' : 'text-2xl'}">
      {title}
    </h2>
    <div class="hidden md:block">
      <p class="text-sm font-bold">{subtitle}</p>
    </div>
  </div>
</div>
