<script lang="ts">
  import "../../../../app.postcss";
  import TimeNavigator from "$lib/ui/navigators/TimeNavigator.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);
</script>

<TimeNavigator subTitle={"Students Online Now"} {supabase} {session}>
  <slot />
</TimeNavigator>
