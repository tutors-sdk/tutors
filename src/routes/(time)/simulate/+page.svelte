<script lang="ts">
  import "../../../app.postcss";
  import { beforeUpdate } from "svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { goto } from "$app/navigation";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { startDataGeneratorService } from "./data-generator";

  export let data: any;

  let simulator: boolean = false;
  let simulatorTxt = "Simulator OFF";

  function simulate() {
    simulator = !simulator;
    if (simulator) {
      simulatorTxt = "Simulator ON";
      startDataGeneratorService(data.allCourses);
    } else {
      simulatorTxt = "Simulator OFF";
    }
  }

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  beforeUpdate(() => {
    if (!session?.user) {
      goto("/auth");
    }
  });
</script>

<TutorsShell subTitle="Simulator" {supabase} {session}>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
    <div class="mx-auto">
      <SlideToggle name="slider-label" checked on:click={simulate}>{simulatorTxt}</SlideToggle>
    </div>
  </div>
</TutorsShell>
