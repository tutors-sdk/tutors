<script lang="ts">
  import Icon from "@iconify/svelte";
  import { getIcon } from "../styles/icon-lib.svelte";
  import { Tooltip } from "@skeletonlabs/skeleton-svelte";

  interface Props {
    type?: string;
    icon?: string;
    color?: string;
    link?: string;
    target?: string;
    width?: string;
    height?: string;
    tip?: string;
    text?: string;
  }

  let {
    type = "",
    icon = "",
    color = "",
    link = "",
    target = "",
    width = "",
    height = "20",
    tip = $bindable(""),
    text = ""
  }: Props = $props();

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

{#snippet displayIcon()}
  {#if type}
    {#if link}
      <a class="btn btn-sm" {target} href={link}>
        <Icon icon={getIcon(type).type} color={legacyIconColour(getIcon(type).color)} {width} {height} />
        {text}
      </a>
    {:else}
      <Icon icon={getIcon(type).type} color={legacyIconColour(getIcon(type).color)} {width} {height} />
    {/if}
  {:else if link}
    <a {target} href={link}>
      <Icon {icon} {color} {width} {height} />
    </a>
  {:else}
    <Icon {icon} {color} {width} {height} />
  {/if}
{/snippet}

{#if tip}
  <Tooltip
    positioning={{ placement: "top" }}
    triggerBase="underline"
    contentBase="card preset-filled p-4 text-sm"
    openDelay={400}
  >
    {#snippet trigger()}
      {@render displayIcon()}
    {/snippet}
    {#snippet content()}
      {tip}
    {/snippet}
  </Tooltip>
{:else}
  {@render displayIcon()}
{/if}
