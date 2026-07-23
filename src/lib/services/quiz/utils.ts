import { PUBLIC_ANON_MODE } from "$env/static/public";
import type { Course } from "@tutors/tutors-model-lib";
import { tutorsId } from "$lib/runes.svelte";

export function isLecturer(course: Course | null, login: string | undefined): boolean {
  if (!course) return false;
  // In anon mode, everyone is treated as a lecturer for local testing
  if (PUBLIC_ANON_MODE === "TRUE") return true;
  if (!login) return false;
  const lecturers = course.properties?.lecturers;
  if (!lecturers) return false;
  return lecturers
    .split(",")
    .map((s: string) => s.trim().toLowerCase())
    .includes(login.toLowerCase());
}

export function isQuizEnabled(course: Course | null): boolean {
  if (!course) return false;
  if (PUBLIC_ANON_MODE === "TRUE") return true;
  return !!course.properties?.lecturers;
}

export function getQuizUserId(): string {
  if (tutorsId.value?.login) return tutorsId.value.login;
  if (typeof window !== "undefined") {
    if (!window.localStorage.quizAnonId) {
      window.localStorage.quizAnonId = "anon-" + Math.random().toString(36).slice(2, 10);
    }
    return window.localStorage.quizAnonId;
  }
  return "anon";
}

export function getQuizUserName(): string {
  return tutorsId.value?.name ?? "Anonymous";
}

export function getQuizUserAvatar(): string {
  return tutorsId.value?.image ?? "https://tutors.dev/logo.svg";
}
