<script lang="ts">
  export let href: string;
  export let target: string | undefined = undefined;
  export let type: string;
  export let width: string;
</script>

<a href={href} target={target} class="card p-2 block !bg-surface-50 dark:!bg-surface-700 border-y-8 border-{type}-500 m-2 {width} transition-all hover:scale-105">
  <slot />
</a>
