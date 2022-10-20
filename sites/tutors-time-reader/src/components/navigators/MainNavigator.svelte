<script lang="ts">
  import TitleCard from "./support/TitleCard.svelte";
  import { currentCourse } from "../../stores";
  import DarkMode from "./support/ThemeSwitch.svelte";
  import TutorsIcon from "./support/TutorsIcon.svelte";
  import { fly } from "svelte/transition";
  import ClockCard from "../cards/ClockCard.svelte";
  import LoggedinStudentCard from "../cards/LoggedinStudentCard.svelte";
  import Compact from "./support/Compact.svelte";
  import OnlineStudents from "./support/OnlineStudents.svelte";
</script>

{#if $currentCourse}
  <div class="header-container">
    <div in:fly={{ y: -100, duration: 1000 }} out:fly={{ y: -100, duration: 500 }} class="navbar">
      <LoggedinStudentCard />
      <TitleCard />
      <OnlineStudents />
      <TutorsIcon />
      <Compact />
      <DarkMode />
      <div class="h-28">
        <ClockCard />
      </div>
    </div>
  </div>
{/if}
