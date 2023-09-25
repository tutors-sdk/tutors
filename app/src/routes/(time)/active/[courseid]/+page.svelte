<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { studentsOnlineList } from "./stores";
  import StudentCard from "./StudentCard.svelte";

  export let data: PageData;

  onMount(async () => {});
</script>

<div class="flex flex-wrap justify-center">
  {#each $studentsOnlineList as studentLo}
    <StudentCard lo={studentLo} />
  {/each}
</div>
