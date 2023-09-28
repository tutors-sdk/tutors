<script lang="ts">
  import Icon from "@iconify/svelte";
  import { ProgressBar, ProgressRadial } from "@skeletonlabs/skeleton";

  let showProgress = false;
  export let handleSignIn: () => Promise<void>;

  async function handleSignInWithProgress() {
    showProgress = true;
    await handleSignIn();
  }
</script>

<div class="flex items-center justify-center overflow-auto h-full">
  <div class="card m-8 flex w-full flex-wrap justify-items-center p-4 shadow-xl lg:w-full p-32">
    <button type="button" class="btn variant-filled w-full mb-12" on:click={handleSignInWithProgress}>
      <span><Icon icon="mdi:github" /></span>
      <span>Sign in with GitHub</span>
    </button>

    {#if showProgress}
      <ProgressBar />
    {/if}
  </div>
</div>
