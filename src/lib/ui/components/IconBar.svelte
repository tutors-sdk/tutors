<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconNavBar } from "$lib/services/base/lo-types";

  interface Props {
    nav: IconNavBar;
  }
  let { nav }: Props = $props();
</script>

<div class="flex items-center">
  {#each nav?.bar as i}
    <Icon type={i.type} link={i.link} target={i.target} tip={i.tip} />
  {/each}
</div>
