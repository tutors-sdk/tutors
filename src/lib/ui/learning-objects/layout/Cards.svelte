<script lang="ts">
  import { onMount } from "svelte";
  import { currentCourse } from "$lib/stores";
  import Card from "./Card.svelte";
  import type { Lo } from "$lib/services/models/lo-types";
  import { setShowHide } from "$lib/services/models/lo-utils";

  export let los: Lo[] = [];
  export let border: boolean = false;
  export let inSidebar: boolean = false;
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
        setShowHide(lo, false);
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

{#if los.length > 0}
    <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 {border ? bordered : unbordered}">
        <div class="{ 
                    los.length > 4 && !inSidebar 
                    ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                    : los.length > 3 && !inSidebar 
                    ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : los.length > 2 && !inSidebar 
                    ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : los.length > 1 && !inSidebar 
                    ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2' 
                    : 'flex justify-center flex-wrap mx-auto'
                  }">
            {#key refresh}
                {#each los as lo}
                    {#if !lo.hide}
                        <div class="flex justify-center">
                            <Card {lo} />
                        </div>
                    {/if}
                {/each}
            {/key}
        </div>
    </div>
{/if}
