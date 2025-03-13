<script lang="ts">
  import Icon from "@iconify/svelte";

  import { Tooltip } from "@skeletonlabs/skeleton-svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";

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

  let { type = "", icon = "", color = "", link = "", target = "", width = "", height = "20", tip = $bindable(""), text = "" }: Props = $props();

  if (target === "_blank") {
    tip = `${tip} (opens in a new Window)`;
  }

  const colorMap: Record<string, string> = {
    primary: "var(--color-primary-500)",
    secondary: "var(--color-secondary-500)",
    tertiary: "var(--color-tertiary-500)",
    info: "var(--color-primary-500)",
    success: "var(--color-success-500)",
    warning: "var(--color-warning-500)",
    error: "var(--color-error-500)",
    surface: "var(--color-surface-500)"
  };

  function legacyIconColour(colourInput: string) {
    return colorMap[colourInput] || "var(--color-primary-500)";
  }
</script>

{#snippet displayIcon()}
  {#if type}
    {#if link}
      <a class="btn btn-sm" {target} href={link}>
        <Icon icon={themeService.getIcon(type).type} color={legacyIconColour(themeService.getIcon(type).color)} {width} {height} />
        {text}
      </a>
    {:else}
      <Icon icon={themeService.getIcon(type).type} color={legacyIconColour(themeService.getIcon(type).color)} {width} {height} />
    {/if}
  {:else if link}
    <a {target} href={link}>
      {color}
      <Icon {icon} {color} {width} {height} />
    </a>
  {:else}
    <Icon {icon} {color} {width} {height} />
  {/if}
{/snippet}

{#if tip}
  <Tooltip positioning={{ placement: "top" }} triggerBase="underline" contentBase="card preset-filled p-4 text-sm z-10 " openDelay={2000}>
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
