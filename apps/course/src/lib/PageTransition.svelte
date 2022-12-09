<script>
  import { fly } from "svelte/transition";
  export let url = "";
  const pageTransitionDuration = 500;
</script>

{#key url}
  <div in:fly="{{ y: -50, duration: 250, delay: 300 }}" out:fly="{{ y: -50, duration: 250 }}">
    <slot />
  </div>
{/key}
