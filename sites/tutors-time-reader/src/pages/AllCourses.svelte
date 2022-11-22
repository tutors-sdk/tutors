<script lang="ts">
  import { CourseCardDeck } from "tutors-ui";
  import { fetchAllCourseAccess, deleteObj } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getCourseSummary, isValidCourseName, type CourseSummary } from "tutors-reader-lib/src/utils/course-utils";
  import NavBar from "../navigators/NavBar.svelte";

  let los: CourseSummary[] = [];
  $: tickerTape = "";
  $: modules = 0;
  let visits = 0;

  void getAllCourses();

  async function populate(allCourseAccess: any[]) {
    let courseId = "";
    for (let i = 0; i < allCourseAccess.length; i++) {
      try {
        courseId = allCourseAccess[i].courseId;
        const courseSummary = await getCourseSummary(courseId);
        courseSummary.visits = allCourseAccess[i].visits;
        courseSummary.count = allCourseAccess[i].count;
        visits += courseSummary.visits;
        if (!courseSummary.isPrivate) {
          modules++;
          tickerTape = `${courseSummary.title}`;
          los.push(courseSummary);
          los = [...los];
          los.sort((lo1: CourseSummary, lo2: CourseSummary) => lo1.title.localeCompare(lo2.title));
        }
      } catch (error: any) {
        deleteObj("all-course-access", courseId);
        console.log(`invalid course ${courseId} : ${error.message}`);
      }
    }
  }

  async function getAllCourses() {
    let allCourseAccess = await fetchAllCourseAccess();
    const invalidCourses = allCourseAccess.filter((usage) => !isValidCourseName(usage.courseId));
    invalidCourses.forEach((course) => {
      deleteObj("all-course-access", course.courseId);
    });
    allCourseAccess = allCourseAccess.filter((usage) => isValidCourseName(usage.courseId));
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 50);
    await populate(allCourseAccess);
  }
</script>

<svelte:head>
  <title>Tutors Modules</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar title="Tutors Module Ecosystem" subTitle={tickerTape} {modules} {visits} />
</div>
<CourseCardDeck {los} />
