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

<div class="flex flex-wrap">
  {#each themes as theme}
    <div
      class="rounded-box bg-base-100 border-base-content/5 text-base-content not-prose grid gap-3 border p-6 w-5/12 m-4"
      data-theme={theme}
    >
      <div class="navbar bg-neutral text-neutral-content rounded-box">
        <div class="flex-none">
          <button class="btn btn-square btn-ghost"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              /></svg
            ></button
          >
        </div>
        <div class="flex-1">
          <button class="btn btn-ghost text-xl normal-case">{theme}</button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
        <button class="btn">Default</button>
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-accent">Accent</button>
        <button class="btn btn-info">Info</button>
        <button class="btn btn-success">Success</button>
        <button class="btn btn-warning">Warning</button>
        <button class="btn btn-error">Error</button>
      </div>
      <div class="flex flex-col gap-3">
        <div class="alert">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-info h-6 w-6 flex-shrink-0"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            > <span>12 unread messages. Tap to see.</span>
          </div>
        </div>
        <div class="alert alert-info">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="h-6 w-6 flex-shrink-0 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            > <span>New software update available.</span>
          </div>
        </div>
        <div class="alert alert-success">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 flex-shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            > <span>Your purchase has been confirmed!</span>
          </div>
        </div>
        <div class="alert alert-warning">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 flex-shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              /></svg
            > <span>Warning: Invalid email address!</span>
          </div>
        </div>
        <div class="alert alert-error">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 flex-shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            > <span>Error! Task failed successfully.</span>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
