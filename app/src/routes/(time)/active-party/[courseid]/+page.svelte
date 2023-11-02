<script lang="ts">
  import { onMount } from "svelte";
  import PartySocket from "partysocket";
  import type { LoEvent } from "$lib/services/party-kit";
  import StudentCard from "./StudentCard.svelte";

  export let data: any;

  $: ({ supabase, session } = data);

  const partyKitCourse = new PartySocket({
    host: "https://tutors-party.edeleastar.partykit.dev",
    room: "courseid"
  });

  const students = new Map<string, LoEvent>();
  let los: LoEvent[] = [];

  onMount(async () => {
    partyKitCourse.room = data.course.courseId;
    partyKitCourse.addEventListener("message", (event) => {
      try {
        const lo = JSON.parse(event.data);
        let studentEvent = students.get(lo.user.id);
        if (!studentEvent) {
          los.push(lo);
          students.set(lo.user.id, lo);
        } else {
          studentEvent.loRoute = `https://tutors.dev${lo.loRoute}`;
          studentEvent.title = lo.title;
          if (lo.icon) {
            studentEvent.icon = lo.icon;
            studentEvent.img = undefined;
          } else {
            studentEvent.img = lo.img;
            studentEvent.icon = undefined;
          }
        }
        los = [...los];
      } catch (e) {
        console.log(e);
      }
    });
  });
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    {#each los as lo}
      <StudentCard {lo} />
    {/each}
  </div>
</div>
