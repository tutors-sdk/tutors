<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconNavBar } from "$lib/services/models/lo-types";

  export let nav: IconNavBar;
</script>

<div class="flex-auto">
  {#each nav?.bar as i}
    <Icon type={i.type} link={i.link} target={i.target} tip={i.tip} />
  {/each}
</div>
