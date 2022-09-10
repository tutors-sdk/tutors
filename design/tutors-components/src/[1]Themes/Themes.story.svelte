<script lang="ts" context="module">
  import type { PageMeta } from "@vitebook/client";
  export const __pageMeta: PageMeta = {
    title: "Themes",
    description: "The themes used in the Tutors project",
  };
</script>

<script>
  import { Variant } from "@vitebook/client";
  let themes = [
    "tutors",
    "tutors-dark",
    "tutors-black",
    "tutors-dyslexia",
    "tutors-wireframe",
  ];
</script>

<div class="flex">
  {#each themes as theme}
    <div class="px-8 py-4">
      <div
        data-theme={theme}
        class="card bg-base-100 text-base-content mx-auto w-full max-w-xs flex-1 p-8"
      >
        <h3 class="text-lg font-bold">{theme}</h3>
        <div class="mt-2 flex flex-col space-y-2">
          <progress value="40" max="100" class="progress" />
          <div class="flex items-center justify-center space-x-2">
            <div class="btn btn-accent btn-square btn-sm">
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-4 w-4 stroke-current"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                /></svg
              >
            </div>
            <label aria-label="toggle" class="label"
              ><input type="checkbox" checked="checked" class="toggle" /></label
            >
            <label aria-label="Checkbox" class="label"
              ><input
                type="checkbox"
                checked="checked"
                class="checkbox"
              /></label
            >
          </div>
          <button class="btn btn-primary btn-block btn-sm">Primary</button>
          <button class="btn btn-secondary btn-block btn-sm">Secondary</button>
          <button class="btn btn-outline btn-block btn-sm">Outline</button>
        </div>
      </div>
    </div>
  {/each}
</div>
