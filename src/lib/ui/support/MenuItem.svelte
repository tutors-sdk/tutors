<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  interface Props {
    type: string;
    text: string;
    link?: string;
    targetStr?: string;
    onClick?: () => void;
  }
  let { type, link, text, targetStr, onClick }: Props = $props();
</script>

<li class="option !p-0 hover:preset-tonal">
  {#if link}
    <a href={link} class="btn flex w-full justify-between" target={targetStr}>
      <div class="ml-2">{text}</div>
      <Icon {type} />
    </a>
  {:else}
    <button class="btn flex w-full justify-between" onclick={onClick}>
      <div class="ml-2">{text}</div>
      <Icon {type} />
    </button>
  {/if}
</li>
