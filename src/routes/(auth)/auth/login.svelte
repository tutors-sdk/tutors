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

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
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
