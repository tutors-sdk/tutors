<script>
  export let colour;
  export let href;
  export let size;
  export let target;
</script>

{#if href}
  <a class="btn btn-{size} btn-{colour}" {href} {target}><slot /></a>
{/if}
{#if !href}
  <button class="btn btn-{size} btn-{colour}" on:click><slot /></button>
{/if}
