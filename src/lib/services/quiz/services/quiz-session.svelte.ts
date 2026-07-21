import PartySocket from "partysocket";
import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { rune } from "$lib/runes.svelte";
import type {
  QuizMessage,
  QuizQuestionMessage,
  QuizAnswerMessage,
  QuizRevealMessage,
  QuizJoinMessage
} from "../types";

const partyKitServer = PUBLIC_party_kit_main_room;

export interface QuizParticipant {
  id: string;
  name: string;
  avatar: string;
}

export const quizSessionState = {
  participants: rune<Map<string, QuizParticipant>>(new Map()),
  participantCount: rune(0),
  currentQuestion: rune<QuizQuestionMessage | null>(null),
  answers: rune<QuizAnswerMessage[]>([]),
  revealData: rune<QuizRevealMessage | null>(null),
  sessionEnded: rune(false),
  isConnected: rune(false),

  socket: null as PartySocket | null,
  broadcastChannel: null as BroadcastChannel | null,

  connect(courseId: string, sessionId: string) {
    this.reset();

    const channelName = `quiz-session-${courseId}-${sessionId}`;
    try {
      this.broadcastChannel = new BroadcastChannel(channelName);
      this.broadcastChannel.onmessage = (event) => {
        if (event.data) this.handleMessage({ data: JSON.stringify(event.data) } as MessageEvent);
      };
      this.isConnected.value = true;
    } catch { /* BroadcastChannel unavailable */ }

    if (partyKitServer === "XXX") return;

    this.socket = new PartySocket({
      host: partyKitServer,
      room: `quiz-${courseId}-${sessionId}`
    });
    this.socket.addEventListener("message", this.handleMessage.bind(this));
    this.isConnected.value = true;
  },

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.isConnected.value = false;
  },

  reset() {
    this.participants.value = new Map();
    this.participantCount.value = 0;
    this.currentQuestion.value = null;
    this.answers.value = [];
    this.revealData.value = null;
    this.sessionEnded.value = false;
  },

  sendMessage(msg: QuizMessage) {
    if (this.socket) {
      this.socket.send(JSON.stringify(msg));
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(JSON.parse(JSON.stringify(msg)));
      } catch { /* BroadcastChannel send failed */ }
    }
  },

  // Lecturer actions
  pushQuestion(questionIndex: number, text: string, options: string[], questionType: "multiple-choice" | "true-false", timeLimit: number | null) {
    this.answers.value = [];
    this.revealData.value = null;
    const msg: QuizQuestionMessage = {
      type: "quiz:question",
      questionIndex,
      text,
      options,
      questionType,
      timeLimit
    };
    this.currentQuestion.value = msg;
    this.sendMessage(msg);
  },

  revealAnswer(questionIndex: number, correctIndex: number, distribution: number[]) {
    const msg: QuizRevealMessage = {
      type: "quiz:reveal",
      questionIndex,
      correctIndex,
      distribution
    };
    this.revealData.value = msg;
    this.sendMessage(msg);
  },

  endQuiz() {
    this.sendMessage({ type: "quiz:end" });
    this.sessionEnded.value = true;
  },

  // Student actions
  joinSession(studentId: string, studentName: string, avatar: string) {
    const msg: QuizJoinMessage = {
      type: "quiz:join",
      studentId,
      studentName,
      avatar
    };
    this.sendMessage(msg);
  },

  submitAnswer(studentId: string, questionIndex: number, selectedIndex: number, responseTimeMs: number) {
    const msg: QuizAnswerMessage = {
      type: "quiz:answer",
      studentId,
      questionIndex,
      selectedIndex,
      responseTimeMs
    };
    this.sendMessage(msg);
  },

  handleMessage(event: MessageEvent) {
    const msg: QuizMessage = JSON.parse(event.data);

    switch (msg.type) {
      case "quiz:join": {
        const participant: QuizParticipant = {
          id: msg.studentId,
          name: msg.studentName,
          avatar: msg.avatar
        };
        this.participants.value.set(msg.studentId, participant);
        this.participants.value = new Map(this.participants.value);
        this.participantCount.value = this.participants.value.size;
        if (typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem("quizHostSession") &&
          this.currentQuestion.value) {
          this.sendMessage(this.currentQuestion.value);
        }
        break;
      }

      case "quiz:question":
        this.currentQuestion.value = msg;
        this.answers.value = [];
        this.revealData.value = null;
        break;

      case "quiz:answer":
        this.answers.value = [...this.answers.value, msg];
        break;

      case "quiz:reveal":
        this.revealData.value = msg;
        break;

      case "quiz:end":
        this.sessionEnded.value = true;
        break;

      case "quiz:participant-count":
        this.participantCount.value = msg.count;
        break;
    }
  }
};
