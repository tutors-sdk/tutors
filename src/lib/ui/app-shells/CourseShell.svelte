<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton";
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import { transitionKey } from "$lib/runes";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";
  import MainNavigator from "../navigators/MainNavigator.svelte";
  import Sidebars from "../navigators/sidebars/Sidebars.svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();
</script>

<AppShell class="h-screen">
  <Sidebars />
  {#snippet header()}
    <MainNavigator />
    <SecondaryNavigator />
  {/snippet}

  {#key transitionKey.value}
    <div id="app" class="h-full">
      <div id="top"></div>
      <div class="mx-auto my-4">
        <div in:fade={{ duration: 300, delay: 200 }}>
          {@render children()}
        </div>
      </div>
    </div>
  {/key}

  {#snippet pageFooter()}
    <Footer />
  {/snippet}
</AppShell>
