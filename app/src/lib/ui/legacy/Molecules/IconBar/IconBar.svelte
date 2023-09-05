<script lang="ts">
  import { Icon } from "$lib/ui/legacy";
  import type { IconNavBar } from "$lib/services/models/lo-types";

  export let nav: IconNavBar;
</script>

<div class="flex-auto">
  {#each nav?.bar as i}
    <a class="btn btn-sm" href={i.link} target={i.target} title={i.tip}>
      <Icon type={i.icon} />
    </a>
  {/each}
</div>
