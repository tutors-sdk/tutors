<script lang="ts">
  import { browser } from "$app/environment";
  import { PUBLIC_ANON_MODE } from "$env/static/public";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import { isLecturer } from "$lib/services/quiz";
  import QuizLiveHost from "$lib/ui/quiz/QuizLiveHost.svelte";
  import QuizLiveStudent from "$lib/ui/quiz/QuizLiveStudent.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";

  interface Props {
    data: { course: any; lo: any; sessionId: string };
  }
  let { data }: Props = $props();

  const isHost = $derived(
    (browser && sessionStorage.getItem("quizHostSession") === data.sessionId) ||
    (PUBLIC_ANON_MODE !== "TRUE" && isLecturer(currentCourse.value, tutorsId.value?.login))
  );
</script>

<svelte:head>
  <title>Live Quiz</title>
</svelte:head>

<SecondaryNavigator lo={data?.lo} parentCourse={data.lo?.parentCourse?.properties?.parent} />

{#if isHost}
  <QuizLiveHost sessionId={data.sessionId} />
{:else}
  <QuizLiveStudent sessionId={data.sessionId} />
{/if}
