<script lang="ts">
  import "../../../app.postcss";
  import PartySocket from "partysocket";
  import LiveCourseCard from "./LiveCourseCard.svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import type { LoEvent } from "$lib/services/party-kit";

  const partyKit = new PartySocket({
    host: "https://tutors-party.edeleastar.partykit.dev",
    room: "tutors-all-course-access"
  });

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let los: LoEvent[] = [];
  let courses = new Map<string, LoEvent>();

  partyKit.addEventListener("message", (event) => {
    try {
      const lo = JSON.parse(event.data);
      let courseEvent = courses.get(lo.courseId);
      if (!courseEvent) {
        los.push(lo);
        courses.set(lo.courseId, lo);
      } else {
        courseEvent.loRoute = `https://tutors.dev${lo.loRoute}`;
        courseEvent.title = lo.title;
        if (lo.icon) {
          courseEvent.icon = lo.icon;
          courseEvent.img = undefined;
        } else {
          courseEvent.img = lo.img;
          courseEvent.icon = undefined;
        }
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
