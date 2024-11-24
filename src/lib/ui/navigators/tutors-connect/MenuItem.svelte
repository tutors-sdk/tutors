<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  interface Props {
    type: string;
    link: string;
    text: string;
  }
  let { type, link, text }: Props = $props();
</script>

<li>
  <a href={link} class="flex items-center">
    <Icon {type} />
    <div class="ml-2">{text}</div>
  </a>
</li>
