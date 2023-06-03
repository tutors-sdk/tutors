<script lang="ts">
  import Iconify from '@iconify/svelte';
  export let href: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let iconColor: string | undefined = undefined;
  export let text: string | undefined = undefined;
</script>

<a class="btn btn-sm" href={href} target={target}>
  {#if icon}
    <Iconify icon={icon} class='text-{iconColor}' width='20px' />
  {/if}
  <span class="hidden md:block text-sm font-bold">{text}</span>
</a>