<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconNavBar } from "../types/icon-types";

  export let nav: IconNavBar;
</script>

<div class="flex-auto">
  {#each nav.bar as i}
    <button class="btn btn-sm">
      <a href={i.link} target={i.target}>
        <Icon type={i.icon} />
      </a>
    </button>
  {/each}
</div>
