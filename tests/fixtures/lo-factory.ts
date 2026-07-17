export function createLo(overrides: Record<string, any> = {}) {
  return {
    route: "/topic/test-course/topic-01",
    type: "topic",
    title: "Test Topic",
    shortTitle: "topic-01",
    summary: "A test topic",
    contentMd: "",
    contentHtml: "",
    img: "https://test-course.netlify.app/img/topic.png",
    video: "",
    hide: false,
    id: "topic-01",
    frontMatter: {},
    breadCrumbs: [],
    los: [],
    ...overrides
  };
}

export function createLabWithSteps(stepTitles: string[]) {
  return {
    type: "lab",
    title: "Test Lab",
    shortTitle: "lab-01",
    route: "/lab/test-course/lab-01",
    summary: "A test lab",
    contentMd: "",
    id: "lab-01",
    hide: false,
    video: "",
    frontMatter: {},
    los: stepTitles.map((title, i) => ({
      shortTitle: `Step${String(i + 1).padStart(2, "0")}`,
      title: `# ${title}`,
      contentMd: `Content for ${title}`,
      contentHtml: `<p>Content for ${title}</p>`,
      type: "step",
      id: `step-${i + 1}`
    }))
  };
}

export function createLoRecord(overrides: Record<string, any> = {}) {
  return {
    courseId: "test-course",
    courseUrl: "test-course.netlify.app",
    courseTitle: "Test Course",
    loRoute: "/lab/test-course/lab-01",
    title: "Lab 1",
    img: "https://test-course.netlify.app/img/lab.png",
    isPrivate: false,
    type: "lab",
    user: {
      fullName: "Test User",
      avatar: "https://avatars.example.com/1.png",
      id: "testuser1",
      sentiment: "neutral"
    },
    ...overrides
  };
}
