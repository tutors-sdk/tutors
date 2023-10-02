<script lang="ts">
  import "../../app.postcss";
  import "iconify-icon";
  import TutorsLinks from "./TutorsLinks.svelte";
  import TutorsValues from "./TutorsValues.svelte";
  import TutorsCredits from "./TutorsCredits.svelte";
  import TutorsNavigator from "$lib/ui/navigators/TutorsNavigator.svelte";

  export let data: any;
  let { supabase, session } = data;
</script>

<TutorsNavigator {supabase} {session}>
  <TutorsLinks />
  <TutorsValues />
  <TutorsCredits />
</TutorsNavigator>
