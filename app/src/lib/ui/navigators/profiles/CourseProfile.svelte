<script lang="ts">
  import { popup } from "@skeletonlabs/skeleton";
  import type { Session } from "@supabase/supabase-js";
  import CourseProfileButton from "./CourseProfileButton.svelte";
  import { currentCourse, studentsOnline } from "$lib/stores";
  import CourseProfileMenu from "./CourseProfileMenu.svelte";
  export let session: Session;
  export let status: boolean;
  export let handleSignOut: () => void;
  export let handleClick: () => void;
  export let onlineDrawerOpen: () => void;
</script>

<button use:popup={{ event: "click", target: "avatar" }}>
  <CourseProfileButton {session} onlineStatus={status} usersOnline={$studentsOnline.toString()} />
</button>
<CourseProfileMenu
  {session}
  onlineStatus={status}
  usersOnline={$studentsOnline.toString()}
  currentCourseId={$currentCourse?.courseId}
  currentCourseUrl={$currentCourse?.courseUrl}
  {handleClick}
  {handleSignOut}
  {onlineDrawerOpen}
/>
