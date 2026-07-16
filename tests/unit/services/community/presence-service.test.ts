import { describe, it, expect, vi } from "vitest";

vi.mock("partysocket", () => {
  return { default: vi.fn() };
});

vi.mock("$lib/services/community/utils/supabase-client", () => ({
  upsertTutorsConnectLatestLo: vi.fn(),
  supabase: {}
}));

import { refreshLoRecord } from "$lib/services/community/services/presence.svelte";
import { createLoRecord } from "../../../fixtures/lo-factory";
import { assertValid, isValid } from "../../../contracts/validators";
import { LoRecordSchema } from "../../../contracts/schemas";

describe("refreshLoRecord", () => {
  it("updates loRoute with tutors.dev prefix", () => {
    const loEvent = createLoRecord();
    const nextLoEvent = createLoRecord({ loRoute: "/topic/test-course/topic-02" });

    refreshLoRecord(loEvent, nextLoEvent);

    expect(loEvent.loRoute).toBe("https://tutors.dev/topic/test-course/topic-02");
  });

  it("updates title, type, and user", () => {
    const loEvent = createLoRecord();
    const newUser = {
      fullName: "New User",
      avatar: "https://avatars.example.com/2.png",
      id: "newuser2",
      sentiment: "fine"
    };
    const nextLoEvent = createLoRecord({
      title: "Updated Title",
      type: "note",
      user: newUser
    });

    refreshLoRecord(loEvent, nextLoEvent);

    expect(loEvent.title).toBe("Updated Title");
    expect(loEvent.type).toBe("note");
    expect(loEvent.user).toEqual(newUser);
  });

  it("sets icon and clears img when nextLoEvent has icon", () => {
    const loEvent = createLoRecord({ img: "https://example.com/old.png" });
    const nextLoEvent = createLoRecord({
      icon: { type: "fas fa-book", color: "red" },
      img: undefined
    });

    refreshLoRecord(loEvent, nextLoEvent);

    expect(loEvent.icon).toEqual({ type: "fas fa-book", color: "red" });
    expect(loEvent.img).toBeUndefined();
  });

  it("sets img and clears icon when nextLoEvent has no icon", () => {
    const loEvent = createLoRecord({ icon: { type: "fas fa-old", color: "blue" } });
    const nextLoEvent = createLoRecord({
      img: "https://example.com/new.png",
      icon: undefined
    });

    refreshLoRecord(loEvent, nextLoEvent);

    expect(loEvent.img).toBe("https://example.com/new.png");
    expect(loEvent.icon).toBeUndefined();
  });

  it("produces a valid LoRecord after mutation", () => {
    const loEvent = createLoRecord();
    const nextLoEvent = createLoRecord({
      loRoute: "/lab/test-course/lab-02",
      title: "Lab 2",
      type: "lab",
      img: "https://example.com/lab2.png"
    });

    refreshLoRecord(loEvent, nextLoEvent);

    // loRoute now has the tutors.dev prefix, which is still a valid string
    expect(isValid(LoRecordSchema, loEvent)).toBe(true);
    assertValid(LoRecordSchema, loEvent);
  });
});
