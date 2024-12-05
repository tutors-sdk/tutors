<script lang="ts">
  import "../app.postcss";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { setDisplayMode, setTheme } from "$lib/ui/themes/theme-controller";
  import { currentTheme } from "$lib/runes";
  import { makeItSnow, makeItStopSnowing } from "./snow.ts";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }

  onMount(async () => {
    if (browser) {
      setDisplayMode(localStorage.modeCurrent);
      setTheme(localStorage.theme);
    }
  });

  $effect(() => {
    console.log(currentTheme.value);
    if (currentTheme.value === "festive") {
      makeItSnow();
    } else {
      makeItStopSnowing();
    }
  });
</script>

{@render children()}
