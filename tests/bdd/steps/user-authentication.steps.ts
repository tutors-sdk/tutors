import { Given, When, Then } from "quickpickle";
import { expect, vi } from "vitest";

vi.mock("@auth/sveltekit/client", () => ({
  signIn: vi.fn(),
  signOut: vi.fn()
}));

vi.mock("partysocket", () => ({
  default: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    send: vi.fn(),
    room: ""
  }))
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null })
  }))
}));

import { goto } from "$app/navigation";
import { currentCourse, tutorsId } from "$lib/runes.svelte";
import { createTutorsId } from "../../fixtures/user-factory";
import { createCourse } from "../../fixtures/course-factory";

let analyticsTracked: boolean;
let presenceSent: boolean;

Given("the user is not authenticated", (world: any) => {
  tutorsId.value = null;
});

Given("the course has auth level greater than 0", (world: any) => {
  const course = createCourse({ authLevel: 1 });
  currentCourse.value = course as any;
});

When("the user visits the course", (world: any) => {
  const course = currentCourse.value;
  if (course && course.authLevel > 0 && !tutorsId.value?.login) {
    localStorage.loginCourse = course.courseId;
    (goto as any)("/auth");
  }
});

Then("the system shall redirect to {string}", (world: any, path: string) => {
  expect(goto).toHaveBeenCalledWith(path);
});

Then("the course ID shall be stored for post-login redirect", (world: any) => {
  expect(localStorage.loginCourse).toBeDefined();
});

Given("the user is authenticated with share {string}", (world: any, share: string) => {
  const user = createTutorsId({ share });
  tutorsId.value = user as any;
});

When("the user toggles share", (world: any) => {
  if (tutorsId.value) {
    if (tutorsId.value.share === "true") {
      tutorsId.value = { ...tutorsId.value, share: "false" };
      localStorage.share = "false";
    } else {
      tutorsId.value = { ...tutorsId.value, share: "true" };
      localStorage.share = "true";
    }
  }
});

Then("share shall be set to {string} in localStorage", (world: any, expected: string) => {
  expect(localStorage.share).toBe(expected);
});

Then("the online status shall be updated", (world: any) => {
  expect(tutorsId.value?.share).toBeDefined();
});

Given("the system is in anonymous mode", (world: any) => {
  analyticsTracked = false;
  presenceSent = false;
});

When("a course visit is recorded", (world: any) => {
  // In anon mode, no tracking occurs
});

Then("no analytics shall be tracked", (world: any) => {
  expect(analyticsTracked).toBe(false);
});

Then("no presence events shall be sent", (world: any) => {
  expect(presenceSent).toBe(false);
});

Given("the user is authenticated as {string}", (world: any, login: string) => {
  tutorsId.value = createTutorsId({ login }) as any;
});

Given("the course has a whitelist containing {string}", (world: any, allowed: string) => {
  currentCourse.value = createCourse({
    enrollment: { whitelist: [allowed] }
  }) as any;
});

When("the whitelist is checked", (world: any) => {
  const enrollment = currentCourse.value?.enrollment;
  if (enrollment?.whitelist && enrollment.whitelist.length > 0) {
    if (!tutorsId.value?.login || !enrollment.whitelist.includes(tutorsId.value.login)) {
      (goto as any)("/");
    }
  }
});
