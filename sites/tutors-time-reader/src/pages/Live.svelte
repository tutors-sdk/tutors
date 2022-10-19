<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import { currentLo, currentUser, live, studentsOnline } from "../stores";
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import StudentCard from "../components/cards/StudentCard.svelte";
  import { querystring } from "svelte-spa-router";
  import type { MetricsService } from "src/reader-lib/services/metrics-service";

  export let params: Record<string, string> = {};

  const cache: CourseService = getContext("cache");
  const metricsService: MetricsService = getContext("metrics");
  let students: StudentMetric[] = [];
  let course = cache.course;
  let title = "";
  let status = false;

  async function getCourse(url: string) {
    let id = $querystring;
    live.set(true);
    course = await cache.readCourse(url);
    metricsService.setCourse(course);
    await metricsService.subscribeToAllUsers();
    // noinspection TypeScriptValidateTypes
    currentLo.set({
      title: `Tutors Live: ${course.lo.title}`,
      type: "tutorsLive",
      parentLo: course.lo,
      img: course.lo.img,
    });
    title = `Tutors Live`;
    studentsOnline.set(0);
    metricsService.startListening(metricUpdate, metricDelete, undefined);
    const users = metricsService.getLiveUsers();
    users.forEach((user) => {
      metricUpdate(user, null, null, Date.now());
    });
    studentsOnline.set(metricsService.getLiveCount());
    const user = await metricsService.fetchUserById(id);
    currentUser.set(user);
    status = user.onlineStatus === "offline";

    return course;
  }

  onDestroy(() => {
    metricsService.stopListening();
  });

  function metricDelete(user: User) {
    let student = students.find((student) => student.nickname === user.nickname);
    let index = students.indexOf(student);
    if (index !== -1) {
      students.splice(index, 1);
    }
    students = [...students];
  }

  function compareStudents(student1: StudentMetric, student2: StudentMetric) {
    if (!student1.lab) {
      return -1;
    }
    if (student1.lab && student2.lab) {
      return student1.lab.title.localeCompare(student2.lab.title);
    }
  }

  function metricUpdate(user: User, topic: Topic, lab: Lo, time: number) {
    if (user.onlineStatus === "offline") return;
    let student = students.find((student) => student.nickname === user.nickname);
    if (!student) {
      student = {
        name: user.name,
        nickname: user.nickname,
        img: user.picture,
        topic: null,
        lab: null,
        time: time,
      };
      students.push(student);
    }
    student.time = time;
    if (topic) {
      student.topic = topic;
    }
    if (lab) {
      student.lab = lab;
    }
    students.sort(compareStudents);
    students = [...students];

    studentsOnline.set(metricsService.getLiveCount());
  }

  // function handleClick() {
  // analytics.setOnlineStatus(models, status);
  // }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#await getCourse(params.wild) then course}
  <div class="container mx-auto mt-4 mb-4 h-screen">
    <div class="col-span-6 wall-bg">
      {#each students as student}
        <StudentCard {student} />
      {/each}
    </div>
  </div>
{/await}
