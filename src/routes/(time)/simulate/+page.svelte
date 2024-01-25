<script lang="ts">
  import "../../../app.postcss";
  import { beforeUpdate } from "svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { goto } from "$app/navigation";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { startDataGeneratorService, stopDataGeneratorService } from "./data-generator";
  import { allStudentsOnlineList } from "./presence-simulator";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";

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
      stopDataGeneratorService();
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
  <div slot="header" class="hidden md:inline-block">
    <SlideToggle name="slider-label" checked on:click={simulate}>{simulatorTxt}</SlideToggle>
  </div>
  <div class="flex flex-wrap justify-center">
    {#each $allStudentsOnlineList as lo}
      <StudentCard {lo} />
    {/each}
  </div>
</TutorsShell>
