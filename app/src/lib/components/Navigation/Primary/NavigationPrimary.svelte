<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
</script>

<AppBar
  background="bg-surface-100-800-token"
  shadow="none"
  class="h-20 justify-center border-b-[1px] border-surface-200 dark:border-surface-700"
>
  <svelte:fragment slot="lead">
    <slot name="lead" />
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="trail">
    <slot name="trail" />
  </svelte:fragment>
</AppBar>
