<script lang="ts">
  import { onMount } from "svelte";
  import { currentCourse } from "$lib/stores";
  import { Card } from "$lib/ui/legacy";
  import type { Lo } from "$lib/services/models/lo-types";

  export let los: Lo[] = [];
  export let border: boolean = false;
  let bordered = "border-[1px] border-surface-200-700-token";
  let unbordered = "";

  let pinBuffer = "";
  let ignorePin = "";
  let refresh = true;

  function keypressInput(e: { key: string }) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      los.forEach((lo) => {
        lo.hide = false;
      });
      refresh = !refresh;
    }
  }

  onMount(async () => {
    if ($currentCourse?.properties.ignorepin) {
      ignorePin = $currentCourse.properties.ignorepin.toString();
      window.addEventListener("keydown", keypressInput);
    }
  });
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 {border ? bordered : unbordered}">
  <div class="flex flex-wrap justify-center">
    {#key refresh}
      {#each los as lo}
        {#if !lo.hide}
          <Card {lo} />
        {/if}
      {/each}
    {/key}
  </div>
</div>
