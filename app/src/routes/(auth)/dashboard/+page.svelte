<script lang="ts">
  import { onMount } from "svelte";
  import Welcome from "./Welcome.svelte";
  import CourseList from "./CourseList.svelte";

  export let data;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(async () => {
    if (localStorage.isAuthenticating && localStorage.course_url) {
      localStorage.removeItem("isAuthenticating");
      window.location.href = "/course/" + localStorage.course_url;
    }
  });
</script>

<Welcome {session} />

<CourseList courses={data.courses} {supabase} {session} />
