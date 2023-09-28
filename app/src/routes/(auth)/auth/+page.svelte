<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Terms from "./terms.svelte";
  import Login from "./login.svelte";

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

<div class="container mx-auto">
  <div class="flex flex-col">
    <Login {handleSignIn} />
    <div class="order-last lg:order-first">
      <Terms />
    </div>
  </div>
</div>
