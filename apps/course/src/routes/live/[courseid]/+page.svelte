<script lang="ts">
  import { onMount } from "svelte";
  import { StudentCardDeck, StudentCardDeck2 } from "tutors-ui";
  import type { PageData } from "./$types";
  import { child, get, getDatabase, onValue, ref, off } from "firebase/database";
  import type { StudentLoEvent } from "tutors-reader-lib/src/types/metrics-types";
  import { decrypt, isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { readObj, sanitise } from "tutors-reader-lib/src/utils/firebase-utils";
  import { goto } from "$app/navigation";
  import { studentsOnline2, studentsOnlineList2 } from "tutors-reader-lib/src/stores/stores";

  export let data: PageData;

  const students = new Map<string, StudentLoEvent>();
  let los: StudentLoEvent[] = [];

  let users = 0;
  let visits = 0;

  async function visitUpdate(courseId: string) {
    const db = getDatabase();
    const lo = await (await get(child(ref(db), `all-course-access/${courseId}/lo`))).val();
    if (lo) {
      const userId = decrypt(lo.tutorsTimeId);
      if (userId) {
        const user = await readObj(`${courseId}/users/${sanitise(userId)}`);
        if (user) {
          const event: StudentLoEvent = {
            studentName: user.name,
            studentImg: user.picture,
            courseTitle: lo.courseTitle,
            loTitle: lo.title,
            loImage: lo.img,
            loRoute: lo.subRoute
          };
          const studentUpdate = students.get(userId);
          if (!studentUpdate) {
            students.set(userId, event);
            los.push(event);
          } else {
            studentUpdate.studentName = event.studentName;
            studentUpdate.studentImg = event.studentImg;
            studentUpdate.courseTitle = event.courseTitle;
            studentUpdate.loTitle = event.loTitle;
            studentUpdate.loImage = event.loImage;
            studentUpdate.loRoute = event.loRoute;
          }
          users = los.length;
          visits++;
          studentsOnlineList2.set([...los]);
          studentsOnline2.set(los.length);
        }
      }
    }
  }

  let firstUpdate = true;
  onMount(async () => {
    if (!isAuthenticated()) {
      goto("/");
    }
    const db = getDatabase();
    const statusRef = ref(db, `all-course-access/${data.course.id}/visits`);
    onValue(statusRef, async () => {
      if (!firstUpdate) {
        await visitUpdate(data.course.id);
      }
      firstUpdate = false;
    });
  });
</script>

<svelte:head>
  <title>{data.course.lo.title} Live Students online Now</title>
</svelte:head>
<!-- <StudentCardDeck los="{los}" /> -->
<StudentCardDeck2 />
