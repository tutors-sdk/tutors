<script lang="ts">
    import "../../../../app.postcss";
    import { beforeUpdate } from "svelte";
    import { goto } from "$app/navigation";
    import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
    import { currentCourse } from "$lib/stores";
  
    export let data: any;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
  
    beforeUpdate(() => {
      if (!session?.user) {
        goto("/auth");
      }
    });
  </script>
  
  <TutorsShell title={$currentCourse?.title} subTitle={"Tutors Time Data"} {supabase} {session}>
    <slot />
  </TutorsShell>