<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { presenceService } from "$lib/services/community";
  import { toaster } from "$lib/stores/toaster";
  import { seedRemoteSession, seedRemoteQuiz } from "$lib/services/quiz";
  import type { QuizLiveStartedNotification } from "$lib/services/quiz/types";

  let broadcastChannel: BroadcastChannel | null = null;

  function handleQuizStarted(notification: QuizLiveStartedNotification) {
    if (notification.session) seedRemoteSession(notification.session);
    if (notification.quiz) seedRemoteQuiz(notification.quiz);

    toaster.create({
      title: `Live Quiz: ${notification.quizTitle}`,
      description: `${notification.lecturerName} started a live quiz`,
      type: "info",
      duration: 15000,
      meta: {
        actionUrl: `/quiz/${notification.courseId}/live/${notification.sessionId}`,
        actionLabel: "Join Quiz"
      }
    });
  }

  onMount(() => {
    presenceService.onQuizStarted = handleQuizStarted;

    try {
      broadcastChannel = new BroadcastChannel("tutors-quiz-notifications");
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === "quiz:live-started") {
          handleQuizStarted(event.data);
        }
      };
    } catch { /* BroadcastChannel unavailable */ }
  });

  onDestroy(() => {
    if (presenceService.onQuizStarted === handleQuizStarted) {
      presenceService.onQuizStarted = undefined;
    }
    broadcastChannel?.close();
    broadcastChannel = null;
  });
</script>
