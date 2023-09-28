<script lang="ts">
  import { getIcon } from "./themes/themes";
  import Icon from "@iconify/svelte";
  import { popup, type PopupSettings } from "@skeletonlabs/skeleton";

  export let type: string = "";
  export let icon: string = "";
  export let color: string = "";
  export let link: string = "";
  export let target: string = "";
  export let width: string = "";
  export let height: string = "20";
  export let tip: string = "";

  let elementId = "id" + Math.random().toString(16).slice(2);

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

  const popupHover: PopupSettings = {
    event: "hover",
    target: elementId,
    placement: "bottom"
  };
</script>

<span class="[&>*]:pointer-events-none" use:popup={popupHover}>
  {#if type}
    {#if link}
      <a {target} href={link}>
        <Icon icon={getIcon(type).icon} color={legacyIconColour(getIcon(type).colour)} {width} {height} />
      </a>
    {:else}
      <Icon icon={getIcon(type).icon} color={legacyIconColour(getIcon(type).colour)} {width} {height} />
    {/if}
  {:else if link}
    <a {target} href={link} use:popup={popupHover}>
      <Icon {icon} {color} {width} {height} />
    </a>
  {:else}
    <Icon {icon} {color} {width} {height} />
  {/if}
</span>
{#if tip}
  <div class="card p-2 variant-filled-surface" data-popup={elementId}>
    <p>{tip}</p>
    <div class="arrow variant-filled-surface" />
  </div>
{/if}
