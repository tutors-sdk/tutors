<script lang="ts">
  import { currentCourse, portfolio } from "tutors-reader-lib/src/stores/stores";
  import { onDestroy, onMount } from "svelte";

  onMount(() => {
    portfolio.set(true);
  });
  onDestroy(() => {
    portfolio.set(false);
  });
</script>

<div class="container mx-auto mt-8">
  <div class="navbar rounded-box bg-neutral text-neutral-content mb-2 justify-center p-4 shadow-lg">
    <div class="flex-1">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
        x="0px"
        y="0px"
        height="40px"
        viewBox="0 0 54.5 39.4"
        style="enable-background:new 0 0 54.5 39.4;"
        xml:space="preserve"
      >
        <defs />
        <g>
          <path
            fill="#37919B"
            d="M51.5,0H3C1.4,0,0,1.4,0,3v33.3c0,1.7,1.4,3,3,3h48.5c1.7,0,3-1.4,3-3V3C54.5,1.4,53.1,0,51.5,0z M50,34.8H4.5
		V4.5H50V34.8z"
          />
          <g>
            <rect fill="#37919B" x="29" y="26.5" width="12.1" height="4.2" />
            <g>
              <path fill="#37919B" d="M13.4,13.5V8.7h19.1v4.8H26v17.2h-5.9V13.5H13.4z" />
            </g>
          </g>
        </g>
      </svg>
      <div class="mx-2 hidden flex-1 px-2 lg:block">
        <p class="text-lg font-bold">Tutors Reader</p>
        <p class="text-sm font-bold">Tutors Open Source Project</p>
      </div>
    </div>
    <a href="https://tutors.dev">
      <div class="btn btn-ghost rounded-2xl">Tutors.dev</div>
    </a>
  </div>
  <div class="rounded-box bg-base-200 mb-2 p-20">
    <div class="text-center">
      <p class="text-4xl font-bold">Oops!</p>
      <br />
      <p class="text-lg">Access to this course is restricted.</p>
      {#if $currentCourse}
        <p class="text-lg">Please contact {$currentCourse?.lo.properties.credits} for permission</p>
      {/if}
    </div>
  </div>
</div>
