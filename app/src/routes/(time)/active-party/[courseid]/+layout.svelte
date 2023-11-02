<script lang="ts">
  import "../../../../app.postcss";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { beforeUpdate } from "svelte";
  import { goto } from "$app/navigation";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  beforeUpdate(() => {
    if (!session?.user) {
      goto("/auth");
    }
  });
</script>

<TutorsShell subTitle={"Students Online Now"} {supabase} {session}>
  <slot />
</TutorsShell>
