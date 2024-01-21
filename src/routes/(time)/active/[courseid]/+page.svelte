<script lang="ts">
  import "../../../../app.postcss";
  import { beforeUpdate } from "svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { goto } from "$app/navigation";
  import CoursePresence from "$lib/ui/time/CoursePresence.svelte";
  import Metric from "$lib/ui/time/Metric.svelte";
  import { studentsOnline } from "$lib/stores";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  beforeUpdate(() => {
    if (!session?.user) {
      goto("/auth");
    }
  });
</script>

<TutorsShell subTitle={data.course.title} {supabase} {session}>
  <div slot="header" class="hidden md:inline-block">
    <Metric value={$studentsOnline} title="Active Students" />
  </div>
  <CoursePresence />
</TutorsShell>
