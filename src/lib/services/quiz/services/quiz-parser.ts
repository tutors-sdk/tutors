import type { QuizQuestion, QuestionType } from "../types";

export interface ParsedQuiz {
  title: string;
  timeLimit: number | null;
  questions: QuizQuestion[];
}

export function parseQuizMarkdown(source: string): ParsedQuiz | null {
  const sections = source.split(/^---$/m).map((s) => s.trim()).filter(Boolean);
  if (sections.length === 0) return null;

  const headerSection = sections[0];
  const title = extractField(headerSection, "title") ?? "Untitled Quiz";
  const timeLimitStr = extractField(headerSection, "time_limit");
  const timeLimit = timeLimitStr ? parseInt(timeLimitStr, 10) : null;

  const hasQuestionFields = headerSection.includes("type:") && headerSection.includes("text:");
  const questionSections = hasQuestionFields ? sections : sections.slice(1);

  const questions: QuizQuestion[] = [];
  for (let i = 0; i < questionSections.length; i++) {
    const section = questionSections[i];
    const question = parseQuestionSection(section, i);
    if (question) {
      questions.push(question);
    }
  }

  if (questions.length === 0) return null;

  return { title, timeLimit, questions };
}

function parseQuestionSection(section: string, index: number): QuizQuestion | null {
  const typeStr = extractField(section, "type");
  const text = extractField(section, "text");
  const correctStr = extractField(section, "correct");

  if (!text) return null;

  const type: QuestionType = typeStr === "true-false" ? "true-false" : "multiple-choice";

  let options: string[];
  if (type === "true-false") {
    options = ["True", "False"];
  } else {
    options = extractListField(section, "options");
    if (options.length < 2) return null;
  }

  let correctIndex = 0;
  if (correctStr !== null) {
    if (type === "true-false") {
      correctIndex = correctStr.toLowerCase() === "false" || correctStr === "1" ? 1 : 0;
    } else {
      correctIndex = parseInt(correctStr, 10) || 0;
    }
  }

  return {
    id: `q${index + 1}`,
    type,
    text,
    options,
    correctIndex: Math.min(correctIndex, options.length - 1)
  };
}

function extractField(section: string, key: string): string | null {
  const regex = new RegExp(`^${key}:\\s*(.+)$`, "mi");
  const match = section.match(regex);
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}

function extractListField(section: string, key: string): string[] {
  const lines = section.split("\n");
  const items: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith(`${key}:`)) {
      inList = true;
      continue;
    }
    if (inList) {
      if (trimmed.startsWith("- ")) {
        items.push(trimmed.slice(2).trim().replace(/^["']|["']$/g, ""));
      } else if (trimmed && !trimmed.includes(":")) {
        items.push(trimmed.replace(/^["']|["']$/g, ""));
      } else {
        inList = false;
      }
    }
  }

  return items;
}
