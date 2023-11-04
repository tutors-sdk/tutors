<script lang="ts">
  import "../../../../app.postcss";
  import { beforeUpdate, onMount } from "svelte";
  import { startPresenceService } from "$lib/services/presence";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { goto } from "$app/navigation";
  import CoursePresence from "$lib/ui/time/CoursePresence.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  beforeUpdate(() => {
    if (!session?.user) {
      goto("/auth");
    }
  });

  onMount(async () => {
    startPresenceService(data.course);
  });
</script>

<TutorsShell subTitle={data.course.title} {supabase} {session}>
  <slot>
    <CoursePresence />
  </slot>
</TutorsShell>
