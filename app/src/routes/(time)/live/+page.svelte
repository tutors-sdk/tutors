<script lang="ts">
  import "../../../app.postcss";
  import PartySocket from "partysocket";
  import LiveCourseCard from "$lib/ui/time/LiveCourseCard.svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { refreshLoEvent, type LoEvent } from "$lib/services/presence";

  const partyKit = new PartySocket({
    host: "https://tutors-party.edeleastar.partykit.dev",
    room: "tutors-all-course-access"
  });

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let los: LoEvent[] = [];
  const loEventMap = new Map<string, LoEvent>();

  partyKit.addEventListener("message", (event) => {
    try {
      const nextLoEvent = JSON.parse(event.data);
      let loEvent = loEventMap.get(nextLoEvent.courseId);
      if (!loEvent) {
        los.push(nextLoEvent);
        loEventMap.set(nextLoEvent.courseId, nextLoEvent);
      } else {
        refreshLoEvent(loEvent, nextLoEvent);
      }
      los = [...los];
    } catch (e) {
      console.log(e);
    }
  });
</script>

<TutorsShell {session} {supabase} title="Tutors Live Stream">
  <div slot="header" class="hidden md:inline-block"></div>
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <LiveCourseCard {lo} />
      {/each}
    </div>
  </div>
</TutorsShell>
