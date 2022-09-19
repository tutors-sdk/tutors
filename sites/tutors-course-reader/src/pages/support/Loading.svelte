<script lang="js">
  import { BarLoader } from "svelte-loading-spinners";
  import { viewDelay } from "../../components/animations";

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, viewDelay);
</script>

{#if !hide}
  <div class="flex flex-col justify-center items-center mt-28">
    <BarLoader size="100" color="#37919B" unit="px" />
    <br />
    <span class="text-lg">Loading...</span>
  </div>
{/if}
