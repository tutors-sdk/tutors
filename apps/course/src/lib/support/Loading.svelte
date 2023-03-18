<script lang="js">

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);
</script>

{#if !hide}
  <div class="mt-28 flex flex-col items-center justify-center">
    <br />
    <span class="text-lg">Loading...</span>
  </div>
{/if}
