<script lang="ts">
  import { fade, fly } from "svelte/transition";

  export let origin = "right-0 pl-10 ";
  export let direction = 1000;
  export let show;
  export let title = "";

  function closeWindow() {
    show.set(false);
  }
</script>

{#if $show}
  <nav transition:fly={{ x: -250, opacity: 1 }}>
    <div class="fixed z-50 inset-0 overflow-hidden" in:fly={{ x: direction, duration: 1000 }} out:fade>
      <div class="absolute inset-0 overflow-hidden">
        <section class="absolute inset-y-0 {origin} max-w-full flex" aria-labelledby="slide-over-heading">
          <div class="w-screen max-w-md">
            <div class="h-full flex flex-col py-6 bg-base-200 text-base-content bg-opacity-80 backdrop-blur shadow-xl overflow-y-scroll">
              <div class="px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 id="slide-over-heading" class="text-lg font-medium">{title}</h2>
                  <div class="ml-3 h-7 flex items-center">
                    <button on:click={() => closeWindow()} class="btn btn-circle bg-neutral-focus">
                      <span class="sr-only">Close panel</span>
                      <svg
                        class="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-6 relative flex-1 px-4 sm:px-6">
                <slot />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </nav>
{/if}
