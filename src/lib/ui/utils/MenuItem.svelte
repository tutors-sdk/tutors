<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  interface Props {
    type: string;
    text: string;
    link?: string;
    targetStr?: string;
    onClick?: () => void;
    isActive?: boolean; 
  }
  let { type, link, text, targetStr, onClick, isActive = false}: Props = $props();
</script>

<li class="option !p-0">
  {#if link}
    <a href={link} class="btn flex w-full justify-between group {isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:preset-tonal'}" target={targetStr}>
      <div class="ml-2">{text}</div>
      <Icon {type} />
    </a>
  {:else}
    <button class="btn flex w-full justify-between group {isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:preset-tonal'}" onclick={onClick}>
      <div class="ml-2">{text}</div>
      <Icon {type} />
    </button>
  {/if}
</li>
