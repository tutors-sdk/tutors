<script lang="ts">
  import StudentCardDeck from "$lib/ui/time/StudentCardDeck.svelte";
  import type { PageData } from "./$types";
  import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import type { StudentLoEvent } from "$lib/services/types/metrics";

  const toastStore = getToastStore();
  export let data: PageData;

  function update(kind: string, event: StudentLoEvent) {
    let style = "";
    let msg = "";
    if (kind === "enter") {
      style = "bg-primary-100 dark:bg-primary-900";
      msg = `${event.studentName} has opened ${event.courseTitle}`;
    } else if (kind == "update") {
      style = "bg-accent-100 dark:bg-accent-900";
      msg = `${event.studentName} is visiting ${event.loTitle}`;
    } else if (kind == "leave") {
      style = "bg-tertiary-500 dark:bg-tertiary-900";
      msg = `${event.studentName} has left  ${event.courseTitle}`;
    }
    const t: ToastSettings = {
      message: msg,
      autohide: true,
      classes: style,
      timeout: 5000
    };
    toastStore.trigger(t);
  }

  onMount(async () => {
    // presenceService.startListening("live", update);
  });
</script>

<svelte:head>
  <title>{data.course.title} Students online now :</title>
</svelte:head>
<StudentCardDeck />
