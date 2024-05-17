<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Terms from "./terms.svelte";
  import Login from "./login.svelte";
  import { getIcon } from "$lib/ui/themes/styles/icon-lib";

  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);

  let showProgress = false;
  onMount(async () => {
    if (data.session) {
      window.location.href = "/dashboard";
    }
  });

  async function handleSignIn() {
    showProgress = true;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${$page.url.origin}/auth/callback`
      }
    });
  }
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    <div class="card w-4/5 !bg-surface-50 dark:!bg-surface-700 border-y-8 border-{getIcon('note').colour}-500 m-2">
      <header class="card-header flex flex-row items-center justify-between p-3">
        <div class="flex-auto text-center !text-black dark:!text-white">Tutors Sign In</div>
      </header>
      <footer class="card-footer">
        <Login {handleSignIn} />
      </footer>
    </div>
    <div class="card w-4/5 !bg-surface-50 dark:!bg-surface-700 border-y-8 border-{getIcon('topic').colour}-500 m-2">
      <footer class="card-footer mt-4">
        <article class="mx-auto prose dark:prose-invert max-w-none w-[80%]">
          <Terms />
        </article>
      </footer>
    </div>
  </div>
</div>
