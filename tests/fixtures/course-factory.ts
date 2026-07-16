let counter = 0;

export function createCourse(overrides: Record<string, any> = {}) {
  counter++;
  return {
    courseId: `test-course-${counter}`,
    courseUrl: `test-course-${counter}.netlify.app`,
    title: `Test Course ${counter}`,
    img: `https://test-course-${counter}.netlify.app/img/course.png`,
    route: `/course/test-course-${counter}`,
    type: "course" as const,
    summary: "",
    contentMd: "",
    contentHtml: "",
    id: `test-course-${counter}`,
    los: [],
    loIndex: new Map(),
    topicIndex: new Map(),
    wallMap: new Map(),
    properties: { credits: "Test Author" },
    isPrivate: false,
    areLabStepsAutoNumbered: false,
    authLevel: 0,
    frontMatter: {},
    hide: false,
    video: "",
    videoids: { videoid: "", videoIds: [] },
    imgFile: "",
    isPortfolio: false,
    llm: 0,
    pdfOrientation: "landscape",
    areVideosHidden: false,
    hasEnrollment: false,
    hasCalendar: false,
    defaultPdfReader: "mozilla",
    footer: "",
    ignorePin: "",
    companions: { show: false, bar: [] },
    wallBar: { show: false, bar: [] },
    toc: [],
    panels: { panelVideos: [], panelTalks: [], panelNotes: [], panelPodcasts: [] },
    units: { units: [], sides: [], standardLos: [] },
    ...overrides
  };
}

export function createMinimalTutorsJson() {
  return {
    title: "Test Course",
    img: "https://{{COURSEURL}}/img/course.png",
    route: "/course/{{COURSEURL}}",
    type: "course" as const,
    summary: "A test course",
    contentMd: "",
    id: "test-course",
    hide: false,
    video: "",
    frontMatter: {},
    los: [
      {
        title: "Topic 1",
        type: "topic",
        shortTitle: "topic-01",
        route: "/topic/{{COURSEURL}}/topic-01",
        img: "https://{{COURSEURL}}/img/topic1.png",
        summary: "First topic",
        contentMd: "",
        contentHtml: "",
        id: "topic-01",
        hide: false,
        video: "",
        frontMatter: {},
        los: [
          {
            title: "Lab 1",
            type: "lab",
            shortTitle: "lab-01",
            route: "/lab/{{COURSEURL}}/topic-01/lab-01",
            summary: "First lab",
            contentMd: "",
            id: "lab-01",
            hide: false,
            video: "",
            frontMatter: {},
            los: [
              {
                shortTitle: "Step01",
                title: "# Introduction",
                contentMd: "## Welcome\nThis is step 1.",
                contentHtml: "<h2>Welcome</h2><p>This is step 1.</p>",
                type: "step",
                id: "step-01"
              },
              {
                shortTitle: "Step02",
                title: "# Exercise",
                contentMd: "## Task\nComplete this.",
                contentHtml: "<h2>Task</h2><p>Complete this.</p>",
                type: "step",
                id: "step-02"
              }
            ]
          },
          {
            title: "Talk 1",
            type: "talk",
            shortTitle: "talk-01",
            route: "/talk/{{COURSEURL}}/topic-01/talk-01",
            summary: "First talk",
            contentMd: "",
            id: "talk-01",
            hide: false,
            video: "",
            frontMatter: {},
            pdf: "https://{{COURSEURL}}/topic-01/talk-01/talk-01.pdf",
            los: []
          }
        ]
      }
    ],
    properties: {
      credits: "Test Author",
      icon: null,
      private: 0
    }
  };
}

export function resetCourseCounter() {
  counter = 0;
}
