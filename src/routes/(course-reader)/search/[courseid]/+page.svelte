<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { searchOpen } from "$lib/runes.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  onMount(() => {
    searchOpen.value = true;
    goto(`/course/${data.course.courseId}`, { replaceState: true });
  });
</script>
