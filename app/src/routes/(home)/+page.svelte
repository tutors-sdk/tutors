<script lang="ts">
  import "../../app.postcss";
  import "iconify-icon";
  import TutorsNavigator from "$lib/ui/navigators/TutorsNavigator.svelte";
  import TutorsLinks from "./TutorsLinks.svelte";
  import TutorsValues from "./TutorsValues.svelte";
  import TutorsCredits from "./TutorsCredits.svelte";
</script>

<TutorsNavigator>
  <TutorsLinks />
  <TutorsValues />
  <TutorsCredits />
</TutorsNavigator>
