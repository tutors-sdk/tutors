<script lang="js">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);
</script>

{#if !hide}
  <div class="mt-28 flex flex-col items-center justify-center">
    <br />
    <ProgressRadial
      stroke={100}
      meter="stroke-primary-500"
      track="stroke-primary-500/30"
      width="w-20"
    />
  </div>
{/if}
