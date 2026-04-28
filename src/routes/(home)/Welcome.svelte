<script lang="ts">
  import { tutorsId } from "$lib/runes.svelte";
</script>

{#if tutorsId.value?.name}
  <p class="text-sm font-semibold tracking-wide uppercase opacity-70">Welcome back</p>
  <h2 class="mt-1 text-2xl leading-tight font-bold sm:text-3xl">
    {tutorsId.value?.name}
  </h2>
  <p class="text-sm opacity-70">
    Signed in as <span class="font-medium">{tutorsId.value?.login}</span>
  </p>
{:else}
  <p class="text-sm font-semibold tracking-wide uppercase opacity-70">Welcome to Tutors</p>
  <h2 class="mt-1 text-2xl leading-tight font-bold sm:text-3xl">
    Learn at your own pace.
  </h2>
  <p class="mt-1 max-w-md text-sm opacity-80">
    Open a course to start reading, or sign in to keep track of your progress and favourites across devices.
  </p>
{/if}
