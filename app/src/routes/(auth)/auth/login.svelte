<script lang="ts">
  import Icon from "@iconify/svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";

  let showProgress = false;
  export let handleSignIn: () => Promise<void>;

  async function handleSignInWithProgress() {
    showProgress = true;
    await handleSignIn();
  }
</script>

<div class="flex items-center justify-center overflow-auto h-full">
  <div class="card mx-8 my-4 flex w-full flex-wrap justify-items-center p-4 shadow-xl lg:w-full">
    <button type="button" class="btn variant-filled w-full" on:click={handleSignInWithProgress}>
      {#if showProgress}
        <ProgressRadial width="w-8" stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
      {:else}
        <span><Icon icon="mdi:github" /></span>
        <span>Sign in with GitHub</span>
      {/if}
    </button>
  </div>
</div>
