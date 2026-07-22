<script lang="ts">
  import { themeService } from "$lib/services/themes";
  import Icon from "@iconify/svelte";
  import { Portal, Tooltip } from "@skeletonlabs/skeleton-svelte";

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
    ariaLabel?: string;
  }

  let { type = "", icon = "", color = "", link = "", target = "", width = "", height = "20", tip = $bindable(""), text = "", ariaLabel = "" }: Props = $props();

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
      <a class="btn btn-sm" {target} href={link} aria-label={ariaLabel || tip || undefined} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
        <Icon icon={themeService.getIcon(type).type} color={legacyIconColour(themeService.getIcon(type).color)} {width} {height} aria-hidden="true" />
        {text}
      </a>
    {:else}
      <Icon icon={themeService.getIcon(type).type} color={legacyIconColour(themeService.getIcon(type).color)} {width} {height} />
    {/if}
  {:else if link}
    <a {target} href={link} aria-label={ariaLabel || tip || undefined} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
      <Icon {icon} {color} {width} {height} aria-hidden="true" />
    </a>
  {:else}
    <Icon {icon} {color} {width} {height} />
  {/if}
{/snippet}

{#snippet tooltipTrigger(attrs)}
  <span {...attrs}>
    {@render displayIcon()}
  </span>
{/snippet}

{#if tip}
  <Tooltip>
    <Tooltip.Trigger element={tooltipTrigger} />
    <Portal>
      <Tooltip.Positioner>
        <Tooltip.Content class="card bg-surface-100-900 z-9999 max-w-md p-2 shadow-xl">
          {tip}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Portal>
  </Tooltip>
{:else}
  {@render displayIcon()}
{/if}
