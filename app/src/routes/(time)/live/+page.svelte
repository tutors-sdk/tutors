<script lang="ts">
  import "../../../app.postcss";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { presenceService } from "$lib/services/presence";
  import TutorsPresence from "$lib/ui/time/TutorsPresence.svelte";
  import { coursesOnline } from "$lib/stores";
  import Metric from "$lib/ui/time/Metric.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  presenceService.startGlobalPresenceService();
</script>

<TutorsShell {session} {supabase} title="Tutors Live Stream">
  <div slot="header" class="hidden md:inline-block">
    <Metric value={$coursesOnline} title="Active Modules" />
  </div>
  <TutorsPresence />
</TutorsShell>
