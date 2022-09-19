<script lang="ts">
  import { revealSidebar } from "../../../stores";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
</script>

<button on:click={() => revealSidebar.set(true)}>
  <Icon type="toc" toolTip="Contents" button="true" tipPos="tooltip-bottom"/>
</button>
