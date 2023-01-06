<script lang="ts">
  import { getIcon } from "./themes";
  import Icon from "@iconify/svelte";

  export let type = "default";
  export let link = "";
  export let target = "";
  export let width = 20;
  export let height = 20;

  function iconColour(colourInput: string) {
    if (colourInput === "info") {
      return "rgba(var(--color-primary-500))";
    } else if (colourInput === "success") {
      return "rgba(var(--color-accent-500))";
    } else if (colourInput === "warning") {
      return "rgba(var(--color-tertiary-500))";
    } else if (colourInput === "error") {
      return "rgba(var(--color-warning-500))";
    } else {
      return "rgba(var(--color-primary-500))";
    }
  }
</script>

{#if link}
  <a target="{target}" href="{link}">
    <Icon icon="{getIcon(type).icon}" color="{iconColour(getIcon(type).colour)}" width="{width}" height="{height}" />
  </a>
{:else}
  <Icon icon="{getIcon(type).icon}" color="{iconColour(getIcon(type).colour)}" width="{width}" height="{height}" />
{/if}
