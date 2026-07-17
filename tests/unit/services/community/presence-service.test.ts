vi.mock("partysocket", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      send: vi.fn(),
      addEventListener: vi.fn(),
      close: vi.fn()
    }))
  };
});

vi.mock("$lib/services/community/utils/supabase-client", () => ({
  upsertTutorsConnectLatestLo: vi.fn()
}));

vi.mock("$lib/runes.svelte", () => {
  const rune = <T>(initial: T) => {
    let value = initial;
    return {
      get value() { return value; },
      set value(v: T) { value = v; }
    };
  };
  return {
    rune,
    tutorsId: rune(null),
    currentLo: rune(null),
    currentCourse: rune(null),
    currentLabStepIndex: rune(0),
    adobeLoaded: rune(false),
    animationDelay: rune(200),
    courseProtocol: rune("https://"),
    hideMainNavigator: rune(false)
  };
});

const { refreshLoRecord } = await import("$lib/services/community/services/presence.svelte");

describe("refreshLoRecord", () => {
  it("updates loRoute with tutors.dev prefix", () => {
    const existing: any = {
      courseId: "c1",
      courseUrl: "c1.netlify.app",
      courseTitle: "Course 1",
      loRoute: "/lab/c1/lab-01",
      title: "Lab 1",
      img: "img1.png",
      isPrivate: false,
      type: "lab",
      user: { fullName: "User", avatar: "a.png", id: "u1", sentiment: "neutral" }
    };

    const next: any = {
      courseId: "c1",
      courseUrl: "c1.netlify.app",
      courseTitle: "Course 1",
      loRoute: "/talk/c1/talk-01",
      title: "Talk 1",
      img: "img2.png",
      isPrivate: false,
      type: "talk",
      user: { fullName: "User", avatar: "a.png", id: "u1", sentiment: "fine" }
    };

    refreshLoRecord(existing, next);
    expect(existing.loRoute).toBe("https://tutors.dev/talk/c1/talk-01");
  });

  it("updates title and type", () => {
    const existing: any = {
      loRoute: "/a", title: "Old", type: "lab",
      user: null, img: "x.png"
    };
    const next: any = {
      loRoute: "/b", title: "New", type: "talk",
      user: { fullName: "U", avatar: "a.png", id: "u1", sentiment: "neutral" },
      img: "y.png"
    };

    refreshLoRecord(existing, next);
    expect(existing.title).toBe("New");
    expect(existing.type).toBe("talk");
  });

  it("updates user reference", () => {
    const existing: any = { loRoute: "/a", title: "X", type: "lab", user: null, img: "x.png" };
    const newUser = { fullName: "New User", avatar: "new.png", id: "u2", sentiment: "delighted" };
    const next: any = { loRoute: "/b", title: "Y", type: "lab", user: newUser, img: "x.png" };

    refreshLoRecord(existing, next);
    expect(existing.user).toBe(newUser);
  });

  it("sets icon and clears img when next has icon", () => {
    const existing: any = { loRoute: "/a", title: "X", type: "lab", user: null, img: "x.png" };
    const icon = { type: "fluent", color: "primary" };
    const next: any = { loRoute: "/b", title: "Y", type: "lab", user: null, icon, img: undefined };

    refreshLoRecord(existing, next);
    expect(existing.icon).toBe(icon);
    expect(existing.img).toBeUndefined();
  });

  it("sets img and clears icon when next has no icon", () => {
    const existing: any = {
      loRoute: "/a", title: "X", type: "lab", user: null,
      icon: { type: "fluent", color: "primary" }
    };
    const next: any = { loRoute: "/b", title: "Y", type: "lab", user: null, img: "new.png" };

    refreshLoRecord(existing, next);
    expect(existing.img).toBe("new.png");
    expect(existing.icon).toBeUndefined();
  });
});
