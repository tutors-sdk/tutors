<script lang="ts">
  import { getIcon } from "./themes";
  import Icon from "@iconify/svelte";

  export let type: string = "";
  export let icon: string = "";
  export let color: string = "";
  export let link: string = "";
  export let target: string = "";
  export let width: string = "";
  export let height: string = "20";

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
    <a target="{target}" href="{link}">
      <Icon icon="{getIcon(type).icon}" color="{legacyIconColour(getIcon(type).colour)}" width="{width}" height="{height}" />
    </a>
  {:else}
    <Icon icon="{getIcon(type).icon}" color="{legacyIconColour(getIcon(type).colour)}" width="{width}" height="{height}" />
  {/if}
{:else}
  {#if link}
    <a target="{target}" href="{link}">
      <Icon icon="{icon}" color="{color}" width="{width}" height="{height}" />
    </a>
  {:else}
    <Icon icon="{icon}" color="{color}" width="{width}" height="{height}" />
  {/if}
{/if}