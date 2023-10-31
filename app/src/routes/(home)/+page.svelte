<script lang="ts">
  import "../../app.postcss";
  import "iconify-icon";
  import TutorsLinks from "./TutorsLinks.svelte";
  import TutorsValues from "./TutorsValues.svelte";
  import TutorsCredits from "./TutorsCredits.svelte";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import HomeFooter from "$lib/ui/navigators/footers/HomeFooter.svelte";

  export let data: any;
  let { supabase, session } = data;
</script>

<TutorsShell {supabase} {session}>
  <TutorsLinks />
  <TutorsValues />
  <TutorsCredits />
  <HomeFooter />
</TutorsShell>
