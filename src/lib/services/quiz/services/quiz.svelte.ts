import { supabase } from "$lib/services/community/utils/supabase-client";
import { PUBLIC_ANON_MODE } from "$env/static/public";
import type { Quiz, QuizQuestion, QuizResponse, QuizSession, QuestionAnalytics, QuizSource, QuizStatus, SessionStatus } from "../types";

function useSupabase(): boolean {
  return PUBLIC_ANON_MODE !== "TRUE" && typeof supabase !== "undefined";
}

// --- In-memory store for local/anon development ---

const memQuizzes: Quiz[] = [];
const memSessions: QuizSession[] = [];
const memResponses: QuizResponse[] = [];
let memIdCounter = 1;

function genId(): string {
  return `local-${memIdCounter++}-${Date.now().toString(36)}`;
}

// --- Column mapping (Supabase only) ---

function toQuizRow(quiz: Partial<Quiz>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (quiz.courseId !== undefined) row.course_id = quiz.courseId;
  if (quiz.title !== undefined) row.title = quiz.title;
  if (quiz.questions !== undefined) row.questions = quiz.questions;
  if (quiz.createdBy !== undefined) row.created_by = quiz.createdBy;
  if (quiz.source !== undefined) row.source = quiz.source;
  if (quiz.timeLimit !== undefined) row.time_limit = quiz.timeLimit;
  if (quiz.status !== undefined) row.status = quiz.status;
  return row;
}

function fromQuizRow(row: Record<string, unknown>): Quiz {
  return {
    id: row.id as string,
    courseId: row.course_id as string,
    title: row.title as string,
    questions: row.questions as QuizQuestion[],
    createdBy: row.created_by as string,
    source: row.source as QuizSource,
    timeLimit: (row.time_limit as number) ?? null,
    status: row.status as QuizStatus,
    createdAt: row.created_at as string
  };
}

function fromSessionRow(row: Record<string, unknown>): QuizSession {
  return {
    id: row.id as string,
    quizId: row.quiz_id as string,
    courseId: row.course_id as string,
    lecturerId: row.lecturer_id as string,
    status: row.status as SessionStatus,
    currentQuestion: row.current_question as number,
    startedAt: row.started_at as string,
    endedAt: (row.ended_at as string) ?? null
  };
}

function fromResponseRow(row: Record<string, unknown>): QuizResponse {
  return {
    id: row.id as string,
    quizId: row.quiz_id as string,
    sessionId: (row.session_id as string) ?? null,
    questionId: row.question_id as string,
    studentId: row.student_id as string,
    selectedIndex: row.selected_index as number,
    isCorrect: row.is_correct as boolean,
    responseTimeMs: row.response_time_ms as number,
    submittedAt: row.submitted_at as string
  };
}

// --- Cross-tab seeding for in-memory mode ---

export function seedRemoteSession(session: QuizSession): void {
  if (!memSessions.find((s) => s.id === session.id)) {
    memSessions.push(session);
  }
}

export function seedRemoteQuiz(quiz: Quiz): void {
  if (!memQuizzes.find((q) => q.id === quiz.id)) {
    memQuizzes.push(quiz);
  }
}

// --- Quiz CRUD ---

export async function createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Promise<Quiz | null> {
  if (!useSupabase()) {
    const newQuiz: Quiz = {
      ...quiz,
      id: genId(),
      createdAt: new Date().toISOString()
    };
    memQuizzes.push(newQuiz);
    return newQuiz;
  }

  const { data, error } = await supabase
    .from("tutors_quizzes")
    .insert(toQuizRow(quiz))
    .select()
    .single();

  if (error) {
    console.error("createQuiz failed:", error);
    return null;
  }
  return fromQuizRow(data);
}

export async function updateQuiz(id: string, updates: Partial<Pick<Quiz, "title" | "questions" | "timeLimit" | "status">>): Promise<void> {
  if (!useSupabase()) {
    const quiz = memQuizzes.find((q) => q.id === id);
    if (quiz) Object.assign(quiz, updates);
    return;
  }

  const row: Record<string, unknown> = {};
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.questions !== undefined) row.questions = updates.questions;
  if (updates.timeLimit !== undefined) row.time_limit = updates.timeLimit;
  if (updates.status !== undefined) row.status = updates.status;

  const { error } = await supabase
    .from("tutors_quizzes")
    .update(row)
    .eq("id", id);

  if (error) {
    console.error("updateQuiz failed:", error);
  }
}

export async function getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
  if (!useSupabase()) {
    return memQuizzes.filter((q) => q.courseId === courseId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const { data, error } = await supabase
    .from("tutors_quizzes")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getQuizzesByCourse failed:", error);
    return [];
  }
  return (data ?? []).map(fromQuizRow);
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  if (!useSupabase()) {
    return memQuizzes.find((q) => q.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("tutors_quizzes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getQuizById failed:", error);
    return null;
  }
  return data ? fromQuizRow(data) : null;
}

export async function publishQuiz(id: string): Promise<void> {
  await updateQuiz(id, { status: "published" });
}

export async function archiveQuiz(id: string): Promise<void> {
  await updateQuiz(id, { status: "archived" });
}

// --- Session management ---

export async function createSession(quizId: string, courseId: string, lecturerId: string): Promise<QuizSession | null> {
  if (!useSupabase()) {
    const session: QuizSession = {
      id: genId(),
      quizId,
      courseId,
      lecturerId,
      status: "waiting",
      currentQuestion: 0,
      startedAt: new Date().toISOString(),
      endedAt: null
    };
    memSessions.push(session);
    return session;
  }

  const { data, error } = await supabase
    .from("tutors_quiz_sessions")
    .insert({
      quiz_id: quizId,
      course_id: courseId,
      lecturer_id: lecturerId,
      status: "waiting",
      current_question: 0
    })
    .select()
    .single();

  if (error) {
    console.error("createSession failed:", error);
    return null;
  }
  return fromSessionRow(data);
}

export async function updateSessionStatus(sessionId: string, status: SessionStatus, currentQuestion?: number): Promise<void> {
  if (!useSupabase()) {
    const session = memSessions.find((s) => s.id === sessionId);
    if (session) {
      session.status = status;
      if (currentQuestion !== undefined) session.currentQuestion = currentQuestion;
      if (status === "completed") session.endedAt = new Date().toISOString();
    }
    return;
  }

  const row: Record<string, unknown> = { status };
  if (currentQuestion !== undefined) row.current_question = currentQuestion;
  if (status === "completed") row.ended_at = new Date().toISOString();

  const { error } = await supabase
    .from("tutors_quiz_sessions")
    .update(row)
    .eq("id", sessionId);

  if (error) {
    console.error("updateSessionStatus failed:", error);
  }
}

export async function getActiveSession(courseId: string): Promise<QuizSession | null> {
  if (!useSupabase()) {
    return memSessions.find(
      (s) => s.courseId === courseId && ["waiting", "active", "reviewing"].includes(s.status)
    ) ?? null;
  }

  const { data, error } = await supabase
    .from("tutors_quiz_sessions")
    .select("*")
    .eq("course_id", courseId)
    .in("status", ["waiting", "active", "reviewing"])
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getActiveSession failed:", error);
    return null;
  }
  return data ? fromSessionRow(data) : null;
}

export async function getSessionById(sessionId: string): Promise<QuizSession | null> {
  if (!useSupabase()) {
    return memSessions.find((s) => s.id === sessionId) ?? null;
  }

  const { data, error } = await supabase
    .from("tutors_quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("getSessionById failed:", error);
    return null;
  }
  return data ? fromSessionRow(data) : null;
}

export async function endSession(sessionId: string): Promise<void> {
  await updateSessionStatus(sessionId, "completed");
}

// --- Responses ---

export async function submitResponse(response: Omit<QuizResponse, "id" | "submittedAt">): Promise<void> {
  if (!useSupabase()) {
    const existing = memResponses.findIndex(
      (r) => r.quizId === response.quizId && r.questionId === response.questionId && r.studentId === response.studentId && r.sessionId === response.sessionId
    );
    const full: QuizResponse = { ...response, id: genId(), submittedAt: new Date().toISOString() };
    if (existing >= 0) {
      memResponses[existing] = full;
    } else {
      memResponses.push(full);
    }
    return;
  }

  const row: Record<string, unknown> = {
    quiz_id: response.quizId,
    question_id: response.questionId,
    student_id: response.studentId,
    selected_index: response.selectedIndex,
    is_correct: response.isCorrect,
    response_time_ms: response.responseTimeMs
  };
  if (response.sessionId) {
    row.session_id = response.sessionId;
  }

  const { error } = await supabase
    .from("tutors_quiz_responses")
    .upsert(row, {
      onConflict: response.sessionId
        ? "quiz_id,session_id,question_id,student_id"
        : "quiz_id,question_id,student_id"
    });

  if (error) {
    console.error("submitResponse failed:", error);
  }
}

export async function getResponsesForSession(sessionId: string): Promise<QuizResponse[]> {
  if (!useSupabase()) {
    return memResponses.filter((r) => r.sessionId === sessionId);
  }

  const { data, error } = await supabase
    .from("tutors_quiz_responses")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    console.error("getResponsesForSession failed:", error);
    return [];
  }
  return (data ?? []).map(fromResponseRow);
}

export async function getResponsesForQuestion(sessionId: string, questionId: string): Promise<QuizResponse[]> {
  if (!useSupabase()) {
    return memResponses.filter((r) => r.sessionId === sessionId && r.questionId === questionId);
  }

  const { data, error } = await supabase
    .from("tutors_quiz_responses")
    .select("*")
    .eq("session_id", sessionId)
    .eq("question_id", questionId);

  if (error) {
    console.error("getResponsesForQuestion failed:", error);
    return [];
  }
  return (data ?? []).map(fromResponseRow);
}

export async function getAsyncResponses(quizId: string, studentId: string): Promise<QuizResponse[]> {
  if (!useSupabase()) {
    return memResponses.filter((r) => r.quizId === quizId && r.studentId === studentId && r.sessionId === null);
  }

  const { data, error } = await supabase
    .from("tutors_quiz_responses")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("student_id", studentId)
    .is("session_id", null);

  if (error) {
    console.error("getAsyncResponses failed:", error);
    return [];
  }
  return (data ?? []).map(fromResponseRow);
}

export async function getResponsesForQuiz(quizId: string): Promise<QuizResponse[]> {
  if (!useSupabase()) {
    return memResponses.filter((r) => r.quizId === quizId);
  }

  const { data, error } = await supabase
    .from("tutors_quiz_responses")
    .select("*")
    .eq("quiz_id", quizId);

  if (error) {
    console.error("getResponsesForQuiz failed:", error);
    return [];
  }
  return (data ?? []).map(fromResponseRow);
}

// --- Analytics (pure computation) ---

export function computeQuestionAnalytics(responses: QuizResponse[], questions: QuizQuestion[]): QuestionAnalytics[] {
  return questions.map((question, index) => {
    const questionResponses = responses.filter((r) => r.questionId === question.id);
    const totalResponses = questionResponses.length;
    const correctCount = questionResponses.filter((r) => r.isCorrect).length;
    const times = questionResponses.map((r) => r.responseTimeMs);

    const distribution = new Array(question.options.length).fill(0);
    for (const r of questionResponses) {
      if (r.selectedIndex >= 0 && r.selectedIndex < distribution.length) {
        distribution[r.selectedIndex]++;
      }
    }

    return {
      questionIndex: index,
      questionId: question.id,
      totalResponses,
      correctCount,
      incorrectCount: totalResponses - correctCount,
      distribution,
      avgResponseTimeMs: totalResponses > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / totalResponses) : 0,
      fastestResponseMs: totalResponses > 0 ? Math.min(...times) : 0,
      slowestResponseMs: totalResponses > 0 ? Math.max(...times) : 0
    };
  });
}
