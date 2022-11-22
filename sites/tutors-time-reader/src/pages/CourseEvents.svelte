<script lang="ts">
  import { CourseCardDeck } from "tutors-ui";
  import { getCourseSummary, type CourseSummary } from "tutors-reader-lib/src/utils/course-utils";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { child, get, getDatabase, onValue, ref } from "firebase/database";
  import NavBar from "../navigators/NavBar.svelte";

  let los: CourseSummary[] = [];
  let courses = new Map<string, CourseSummary>();
  let modules = 0;
  let title = "Tutors Module Activity";
  $: subTitle = "Connecting ...";
  let activeSince = "";
  let visits = 0;
  const tutorsTimeIds = new Set();
  let users = 0;

  const db = getDatabase();

  let countDown = 20;
  let canUpdate = false;
  let timer = setInterval(function () {
    activeSince = new Date().toLocaleTimeString();
    subTitle = `Connecting in ${countDown} seconds`;
    countDown--;
    if (countDown == 0) {
      clearInterval(timer);
      activeSince = new Date().toLocaleTimeString();
      subTitle = `Connected at : ${activeSince}`;
      canUpdate = true;
    }
  }, 1000);

  void startListening();

  function updateNmrUsers(courseSummary: CourseSummary) {
    if (courseSummary.currentLo.tutorsTimeId) {
      tutorsTimeIds.add(courseSummary.currentLo.tutorsTimeId);
      users = tutorsTimeIds.size;
    }
  }

  function updateCourseSummary(courseSummary: CourseSummary) {
    courseSummary.route = `https://reader.tutors.dev${courseSummary.currentLo?.subRoute}`;
    courseSummary.img = courseSummary.currentLo?.img;
    if (courseSummary.currentLo.icon) {
      courseSummary.icon = courseSummary.currentLo.icon;
    } else {
      courseSummary.icon = null;
    }
  }
  async function visitUpdate(courseId: string) {
    let courseSummary = courses.get(courseId);
    if (!courseSummary) {
      courseSummary = await getCourseSummary(courseId);
      if (courseSummary.isPrivate) return;
      courses.set(courseId, courseSummary);
      los.push(courseSummary);
    }
    const usage = await (await get(child(ref(db), `all-course-access/${courseId}`))).val();
    if (usage.lo) {
      courseSummary.currentLo = usage.lo;
      courseSummary.count = usage.count;
      courseSummary.visits = usage.visits;
      updateCourseSummary(courseSummary);
      updateNmrUsers(courseSummary);
      los = [...los];
      modules = los.length;
      subTitle = `Active since : ${activeSince}`;
    }
  }

  async function startListening() {
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess.forEach((courseAccess) => {
      const courseId = courseAccess.courseId;
      const statusRef = ref(db, `all-course-access/${courseId}/visits`);
      onValue(statusRef, async () => {
        if (canUpdate) {
          await visitUpdate(courseId);
          visits++;
        }
      });
    });
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar {title} {subTitle} {modules} {visits} {users} />
</div>
<CourseCardDeck {los} />
