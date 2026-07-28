import { faker } from "@faker-js/faker";
import { dashboardAggregatorService } from "./dashboard-aggregator.svelte";

const MOCK_LOS = [
  { route: "/topic/topic-01-getting-started", title: "Getting Started with Python", type: "topic" },
  { route: "/talk/talk-1-welcome-to-python", title: "Welcome to Python", type: "talk" },
  { route: "/note/note-1-python-ecosystem", title: "The Python Ecosystem", type: "note" },
  { route: "/topic/topic-02-variables", title: "Variables and Data Types", type: "topic" },
  { route: "/lab/book-variables-practice", title: "Variables Practice Lab", type: "lab" },
  { route: "/topic/topic-04-control-flow", title: "Control Flow", type: "topic" },
  { route: "/lab/book-control-flow-lab", title: "Control Flow Lab", type: "lab" },
  { route: "/topic/topic-05-loops", title: "Loops", type: "topic" },
  { route: "/lab/book-loops-lab", title: "Loops Lab", type: "lab" },
  { route: "/topic/topic-06-functions", title: "Functions", type: "topic" },
  { route: "/lab/book-functions-lab", title: "Functions Lab", type: "lab" },
  { route: "/topic/topic-07-data-structures", title: "Data Structures", type: "topic" },
  { route: "/lab/book-data-structures-lab", title: "Data Structures Lab", type: "lab" },
  { route: "/topic/topic-10-oop", title: "Object-Oriented Programming", type: "topic" },
  { route: "/lab/book-oop-lab", title: "OOP Lab", type: "lab" }
];

type Behavior = "active" | "idle" | "away" | "thrasher" | "stuck";

interface MockStudent {
  id: string;
  fullName: string;
  avatar: string;
  behavior: Behavior;
  currentLoIndex: number;
  tickCount: number;
  thrashToggle: boolean;
}

const BEHAVIORS: Behavior[] = [
  "active", "active", "active", "active", "active",
  "idle", "idle",
  "away",
  "thrasher",
  "stuck"
];

let students: MockStudent[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;

function createStudents(): MockStudent[] {
  faker.seed(42);
  return BEHAVIORS.map((behavior, i) => ({
    id: faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, ""),
    fullName: faker.person.fullName(),
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    behavior,
    currentLoIndex: i % MOCK_LOS.length,
    tickCount: 0,
    thrashToggle: false
  }));
}

function buildPayload(student: MockStudent, courseId: string) {
  const lo = MOCK_LOS[student.currentLoIndex];
  let engagement: string;

  switch (student.behavior) {
    case "active":
    case "thrasher":
      engagement = "active";
      break;
    case "idle":
    case "stuck":
      engagement = student.tickCount < 5 ? "active" : "idle";
      break;
    case "away":
      engagement = student.tickCount < 3 ? "active" : "away";
      break;
    default:
      engagement = "active";
  }

  return {
    courseId,
    loRoute: lo.route,
    title: lo.title,
    type: lo.type,
    img: "",
    icon: null,
    isPrivate: 0,
    engagement,
    heartbeatTs: Date.now(),
    user: {
      id: student.id,
      fullName: student.fullName,
      avatar: student.avatar,
      sentiment: faker.helpers.arrayElement(["neutral", "positive", "negative"])
    }
  };
}

function tick(courseId: string) {
  for (const student of students) {
    student.tickCount++;

    switch (student.behavior) {
      case "active":
        if (student.tickCount % faker.number.int({ min: 3, max: 6 }) === 0) {
          student.currentLoIndex = (student.currentLoIndex + 1) % MOCK_LOS.length;
        }
        break;

      case "thrasher":
        if (student.tickCount % 2 === 0) {
          student.thrashToggle = !student.thrashToggle;
          student.currentLoIndex = student.thrashToggle ? 0 : 1;
        }
        break;

      case "away":
        if (student.tickCount % 8 !== 0) return;
        break;
    }

    dashboardAggregatorService.injectMessage(buildPayload(student, courseId));
  }
}

export function startMockSimulation(courseId: string) {
  stopMockSimulation();
  students = createStudents();
  dashboardAggregatorService.startMockListening();

  for (const student of students) {
    dashboardAggregatorService.injectMessage(buildPayload(student, courseId));
  }

  intervalId = setInterval(() => tick(courseId), 3000);
}

export function stopMockSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  students = [];
  dashboardAggregatorService.stopListening();
}
