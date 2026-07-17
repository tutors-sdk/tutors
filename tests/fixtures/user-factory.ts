import { TutorsIdSchema, LoUserSchema } from "../contracts/schemas";

let counter = 0;

export function createTutorsId(overrides: Record<string, any> = {}) {
  counter++;
  const user = {
    name: `Test User ${counter}`,
    login: `testuser${counter}`,
    email: `testuser${counter}@example.com`,
    image: `https://avatars.example.com/${counter}.png`,
    share: "true",
    sentiment: "neutral",
    ...overrides
  };
  TutorsIdSchema.parse(user);
  return user;
}

export function createLoUser(overrides: Record<string, any> = {}) {
  counter++;
  const user = {
    fullName: `Test User ${counter}`,
    avatar: `https://avatars.example.com/${counter}.png`,
    id: `testuser${counter}`,
    sentiment: "neutral",
    ...overrides
  };
  LoUserSchema.parse(user);
  return user;
}

export function resetUserCounter() {
  counter = 0;
}
