<script lang="ts">
  import "../../../../app.postcss";
  import { beforeUpdate, onMount } from "svelte";
  import PartySocket from "partysocket";
  import { refreshLoEvent, type LoEvent } from "$lib/services/party-kit";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { goto } from "$app/navigation";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  beforeUpdate(() => {
    if (!session?.user) {
      goto("/auth");
    }
  });

  const loEventMap = new Map<string, LoEvent>();
  let los: LoEvent[] = [];

  onMount(async () => {
    const partyKitCourse = new PartySocket({
      host: "https://tutors-party.edeleastar.partykit.dev",
      room: data.course.courseId
    });
    partyKitCourse.addEventListener("message", (event) => {
      try {
        const nextLoEvent = JSON.parse(event.data);
        let loEvent = loEventMap.get(nextLoEvent.user.id);
        if (!loEvent) {
          los.push(nextLoEvent);
          loEventMap.set(nextLoEvent.user.id, nextLoEvent);
        } else {
          refreshLoEvent(loEvent, nextLoEvent);
        }
        los = [...los];
      } catch (e) {
        console.log(e);
      }
    });
  });
</script>

<TutorsShell subTitle={data.course.title} {supabase} {session}>
  <slot>
    <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
      <div class="flex flex-wrap justify-center">
        {#each los as lo}
          <StudentCard {lo} />
        {/each}
      </div>
    </div>
  </slot>
</TutorsShell>
