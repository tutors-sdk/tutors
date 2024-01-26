<script lang="ts">
  import "../../../app.postcss";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { allStudentsOnlineList, partykitGateway } from "./partykit-gateway";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";
  import { presenceServiceSimulator } from "./presence-simulator";

  export let data: any;
  let { supabase, session } = data;

  // simulation stopped by default
  let simulator: boolean = false;
  let simulatorTxt = "Simulator Stopped";

  // these are the course that will be used in the simulation
  const courses = [
    "reference-course",
    "wit-hdip-comp-sci-2024-web-dev-1",
    "wit-hdip-comp-sci-2024-programming",
    "wit-hdip-comp-sci-databases-2023",
    "wit-hdip-comp-sci-2023-comp-sys",
    "full-stack-1-2023",
    "wit-hdip-comp-sci-2022-mobile-app-dev",
    "adv-full-stack-oth-2023.netlify.app",
    "fsf21.netlify.app",
    "web-design-for-ecommerce",
    "classic-design-patterns",
    "iot-protocols-2022",
    "netfor"
  ];

  // initialise the generator, wih the courses above + a max of 16 students
  presenceServiceSimulator.initialise(courses, 16);
  // Initialise partykit listener
  partykitGateway.startListentingForEvents();

  // toggle simulator
  function simulate() {
    simulator = !simulator;
    if (simulator) {
      simulatorTxt = "Simulator Started";
      presenceServiceSimulator.start(4000);
    } else {
      simulatorTxt = "Simulator Stopped";
      presenceServiceSimulator.stop();
    }
  }
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
