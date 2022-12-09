<script lang="js">
  import { BarLoader } from "svelte-loading-spinners";

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);
</script>

{#if !hide}
  <div class="mt-28 flex flex-col items-center justify-center">
    <BarLoader size="100" color="#37919B" unit="px" />
    <br />
    <span class="text-lg">Loading...</span>
  </div>
{/if}
