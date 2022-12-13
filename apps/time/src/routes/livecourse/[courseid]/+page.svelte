<script lang="ts">
  import { onMount } from "svelte";
  import { StudentCardDeck } from "tutors-ui";
  import type { PageData } from "./$types";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import { child, get, getDatabase, onValue, ref, off } from "firebase/database";
  import type { StudentLoEvent } from "tutors-reader-lib/src/types/metrics-types";
  import { decrypt, isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { readObj, sanitise } from "tutors-reader-lib/src/utils/firebase-utils";

  export let data: PageData;

  const students = new Map<string, StudentLoEvent>();
  let los: StudentLoEvent[] = [];

  let users = 0;
  let visits = 0;

  let title = `${data.course.lo.title} Module Activity`;
  const activeSince = new Date().toLocaleTimeString();
  const subTitle = `Connected at : ${activeSince}`;

  async function visitUpdate(courseId: string) {
    const db = getDatabase();
    const usage = await (await get(child(ref(db), `all-course-access/${courseId}`))).val();
    if (usage.lo) {
      const userId = decrypt(usage.lo.tutorsTimeId);
      if (userId) {
        const user = await readObj(`${courseId}/users/${sanitise(userId)}`);
        if (user) {
          const event: StudentLoEvent = {
            studentName: user.name,
            studentImg: user.picture,
            loTitle: usage.lo.title,
            loImage: usage.lo.img,
            loRoute: usage.lo.subRoute
          };
          const studentUpdate = students.get(userId);
          if (!studentUpdate) {
            students.set(userId, event);
            los.push(event);
          } else {
            studentUpdate.studentName = event.studentName;
            studentUpdate.studentImg = event.studentImg;
            studentUpdate.loTitle = event.loTitle;
            studentUpdate.loImage = event.loImage;
            studentUpdate.loRoute = event.loRoute;
          }
          los = [...los];
          users = los.length;
          visits++;
        }
      }
    }
  }

  onMount(async () => {
    const db = getDatabase();
    const statusRef = ref(db, `all-course-access/${data.course.id}/visits`);
    onValue(statusRef, async () => {
      await visitUpdate(data.course.id);
    });
  });
</script>

<svelte:head>
  <title>{data.course.lo.title} Live Students online Now</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar title="{title}" subTitle="{subTitle}" visits="{visits}" users="{users}" />
</div>
<StudentCardDeck los="{los}" />
