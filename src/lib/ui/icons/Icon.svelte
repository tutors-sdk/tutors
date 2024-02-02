<script lang="ts">
  import { getIcon } from "./themes/themes";
  import Icon from "@iconify/svelte";

  export let type = "";
  export let icon = "";
  export let color = "";
  export let link = "";
  export let target = "";
  export let width = "";
  export let height = "20";
  export let tip = "";
  export let text = "";

  if (target === "_blank") {
    tip = `${tip} (opens in a new Window)`;
  }

  function legacyIconColour(colourInput: string) {
    if (colourInput === "info") {
      return "rgba(var(--color-primary-500))";
    } else if (colourInput === "success") {
      return "rgba(var(--color-success-500))";
    } else if (colourInput === "warning") {
      return "rgba(var(--color-warning-500))";
    } else if (colourInput === "error") {
      return "rgba(var(--color-error-500))";
    } else {
      return "rgba(var(--color-primary-500))";
    }
  }
</script>

{#if type}
  {#if link}
    <a class="btn btn-sm" {target} href={link} title={tip}>
      <Icon icon={getIcon(type).icon} color={legacyIconColour(getIcon(type).colour)} {width} {height} />
      {text}
    </a>
  {:else}
    <Icon icon={getIcon(type).icon} color={legacyIconColour(getIcon(type).colour)} {width} {height} />
  {/if}
{:else if link}
  <a {target} href={link} title={tip}>
    <Icon {icon} {color} {width} {height} />
  </a>
{:else}
  <Icon {icon} {color} {width} {height} />
{/if}
