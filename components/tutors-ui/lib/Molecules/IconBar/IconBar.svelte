<script lang="ts">
  import Icon from '../../Atoms/Iconography/Icon.svelte';
  import type { IconNavBar } from 'tutors-reader-lib/src/types/icon-types';

  export let nav: IconNavBar;
</script>

<div class="flex-auto">
  {#each nav.bar as i}
    <a class="btn btn-sm" href="{i.link}" target="{i.target}" title="{i.tip}">
      <Icon type="{i.icon}" />
    </a>
  {/each}
</div>
