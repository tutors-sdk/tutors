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

<li>
  <a href={link} class="flex items-center hover:preset-tonal" target={targetStr} onclick={onClick}>
    <Icon {type} />
    <div class="ml-2">{text}</div>
  </a>
</li>
