<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import { tutorsConnectService } from "$lib/services/connect";
  import TutorsTerms from "./TutorsTerms.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";

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

<div class="bg-surface-100-800 mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    <div
      class="card w-4/5 border-y-8 bg-surface-50! dark:bg-surface-700! border-{themeService.getIcon('note')
        .color}-500 m-2"
    >
      <header class="card-header flex flex-row items-center justify-between p-3">
        <div class="flex-auto text-center text-black! dark:text-white!">Tutors Sign In</div>
      </header>
      <footer class="card-footer">
        {#if showProgress}
          <div class="flex w-full place-items-center justify-center p-4">
            <Progress value={null} meterAnimate="my-custom-animation" />
          </div>
        {:else}
          <div class="bg-surface-100-800 mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
            <div class="flex flex-wrap justify-center">
              <button
                type="button"
                class="btn w-full transform bg-primary-500 text-white transition-transform hover:scale-105 hover:bg-primary-600"
                onclick={handleSignInWithProgress}
              >
                <span><Icon icon="mdi:github" /></span>
                <span>Sign in with GitHub</span>
              </button>
            </div>
          </div>
        {/if}
      </footer>
    </div>
    <div
      class="card w-4/5 border-y-8 bg-surface-50! dark:bg-surface-700! border-{themeService.getIcon('topic')
        .color}-500 m-2"
    >
      <footer class="card-footer mt-4">
        <article class="prose mx-auto w-[80%] max-w-none dark:prose-invert">
          <TutorsTerms />
        </article>
      </footer>
    </div>
  </div>
</div>

<style>
  /*
		Note: The `:global` modifier is used to apply the
		animation to the progress bar because Svelte styles
		are scoped by default.
	*/
  :global(.my-custom-animation) {
    animation: my-custom-animation 2s ease-in-out infinite;
  }
  @keyframes my-custom-animation {
    0% {
      translate: -100%;
    }
    25% {
      scale: 1;
    }
    50% {
      scale: 0.25 1;
      translate: 50%;
    }
    75% {
      scale: 1;
    }
    100% {
      translate: 200%;
    }
  }
</style>
