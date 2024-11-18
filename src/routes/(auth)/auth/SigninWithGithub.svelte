<script lang="ts">
  import { getIcon } from "$lib/ui/themes/styles/icon-lib.svelte";
  import Icon from "@iconify/svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import Terms from "./Terms.svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";

  let showProgress = $state(false);
  interface Props {
    redirect?: string;
  }

  let { redirect = "" }: Props = $props();

  async function handleSignInWithProgress() {
    showProgress = true;
    tutorsConnectService.connect(redirect);
  }
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    <div class="card w-4/5 border-y-8 !bg-surface-50 dark:!bg-surface-700 border-{getIcon('note').color}-500 m-2">
      <header class="card-header flex flex-row items-center justify-between p-3">
        <div class="flex-auto text-center !text-black dark:!text-white">Tutors Sign In</div>
      </header>
      <footer class="card-footer">
        <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
          <div class="flex flex-wrap justify-center">
            <button type="button" class="variant-filled btn w-full" onclick={handleSignInWithProgress}>
              {#if showProgress}
                <ProgressRadial width="w-8" stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
              {:else}
                <span><Icon icon="mdi:github" /></span>
                <span>Sign in with GitHub</span>
              {/if}
            </button>
          </div>
        </div>
      </footer>
    </div>
    <div class="card w-4/5 border-y-8 !bg-surface-50 dark:!bg-surface-700 border-{getIcon('topic').color}-500 m-2">
      <footer class="card-footer mt-4">
        <article class="prose mx-auto w-[80%] max-w-none dark:prose-invert">
          <Terms />
        </article>
      </footer>
    </div>
  </div>
</div>
