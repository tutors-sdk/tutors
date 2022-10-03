<script lang="js">
  import { BarLoader } from "svelte-loading-spinners";
  import { viewDelay } from "../../components/animations";

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, viewDelay);
</script>

{#if !hide}
  <div class="mt-28 flex flex-col items-center justify-center">
    <BarLoader size="100" color="#37919B" unit="px" />
    <br />
    <span class="text-lg">Loading...</span>
  </div>
{/if}
