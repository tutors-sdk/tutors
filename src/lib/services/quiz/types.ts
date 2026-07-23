export type QuestionType = "multiple-choice" | "true-false";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctIndex: number;
}

export type QuizSource = "course" | "dynamic";
export type QuizStatus = "draft" | "published" | "archived";

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  createdBy: string;
  source: QuizSource;
  timeLimit: number | null;
  status: QuizStatus;
  createdAt: string;
}

export type SessionStatus = "waiting" | "active" | "reviewing" | "completed";

export interface QuizSession {
  id: string;
  quizId: string;
  courseId: string;
  lecturerId: string;
  status: SessionStatus;
  currentQuestion: number;
  startedAt: string;
  endedAt: string | null;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  sessionId: string | null;
  questionId: string;
  studentId: string;
  selectedIndex: number;
  isCorrect: boolean;
  responseTimeMs: number;
  submittedAt: string;
}

export interface QuizJoinMessage {
  type: "quiz:join";
  studentId: string;
  studentName: string;
  avatar: string;
}

export interface QuizQuestionMessage {
  type: "quiz:question";
  questionIndex: number;
  text: string;
  options: string[];
  questionType: QuestionType;
  timeLimit: number | null;
}

export interface QuizAnswerMessage {
  type: "quiz:answer";
  studentId: string;
  questionIndex: number;
  selectedIndex: number;
  responseTimeMs: number;
}

export interface QuizRevealMessage {
  type: "quiz:reveal";
  questionIndex: number;
  correctIndex: number;
  distribution: number[];
}

export interface QuizEndMessage {
  type: "quiz:end";
}

export interface QuizParticipantCountMessage {
  type: "quiz:participant-count";
  count: number;
}

export type QuizMessage =
  | QuizJoinMessage
  | QuizQuestionMessage
  | QuizAnswerMessage
  | QuizRevealMessage
  | QuizEndMessage
  | QuizParticipantCountMessage;

export interface QuizLiveStartedNotification {
  type: "quiz:live-started";
  sessionId: string;
  quizTitle: string;
  courseId: string;
  lecturerName: string;
  quiz?: Quiz;
  session?: QuizSession;
}

export interface QuestionAnalytics {
  questionIndex: number;
  questionId: string;
  totalResponses: number;
  correctCount: number;
  incorrectCount: number;
  distribution: number[];
  avgResponseTimeMs: number;
  fastestResponseMs: number;
  slowestResponseMs: number;
}
