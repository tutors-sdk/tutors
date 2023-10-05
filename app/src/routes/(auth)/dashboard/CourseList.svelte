<script lang="ts">
  import { getModalStore, getToastStore, type ModalSettings, type ToastSettings } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();
  const modalStore = getModalStore();
  export let courses: any;
  export let supabase: any;
  export let session: any;

  $: displayedCourseList = courses[0] ? courses[0].course_list.courses : [];

  const handleDeleteCourse = async (courseId) => {
    let loading = true;

    const modal: ModalSettings = {
      type: "confirm",
      // Data
      title: "Please Confirm",
      body: "Are you sure you want to delete the course?",
      response: async (r: boolean) => {
        if (r === true) {
          try {
            const { data: userCourseList, error } = await supabase.from("accessed_courses").select(`course_list`).eq("id", session.user.id);

            if (error) {
              showErrorMessage("Error fetching user course list");
              return;
            }

            const courseList = userCourseList[0].course_list;

            const courseIndex = courseList.courses.findIndex((course) => course.id === courseId);

            if (courseIndex !== -1) {
              courseList.courses.splice(courseIndex, 1);
              const { error } = await supabase.from("accessed_courses").update({ course_list: courseList }).eq("id", session.user.id);

              if (error) {
                showErrorMessage("Error deleting course");
              } else {
                showSuccessMessage("Course deleted successfully");
                displayedCourseList = courseList.courses;
              }
            } else {
              showErrorMessage("Course not found in your list");
            }
          } catch (e) {
            showErrorMessage("An error occurred while deleting the course");
          } finally {
            loading = false;
          }
        }
      }
    };

    modalStore.trigger(modal);
  };

  function showErrorMessage(message: string) {
    const t: ToastSettings = {
      message: message,
      background: "variant-filled-error"
    };
    toastStore.trigger(t);
  }

  function showSuccessMessage(message: string) {
    const t: ToastSettings = {
      message: message,
      background: "variant-filled-success"
    };
    toastStore.trigger(t);
  }
</script>

<div class="container card mx-auto p-8 my-4">
  <p class="text-2xl font-bold pb-4">Your previously accessed courses</p>
  <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#if displayedCourseList}
      {#each displayedCourseList.sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed)) as course}
        <div class="card !bg-surface-50 dark:!bg-surface-700 card-hover m-2">
          <a href={"/course/" + course.id}>
            <section class="p-4">
              <p class="font-bold">{course.name}</p>
              <p>
                Last Accessed: {course.last_accessed.slice(0, 10)}
                {course.last_accessed.slice(11, 19)}
              </p>
              <p>Visits: {course.visits}</p>
            </section>
          </a>
          <footer class="card-footer p-0">
            <div class="w-full flex">
              <a class="btn rounded-t-none rounded-br-none m-0 variant-filled-primary w-2/3" href={"/course/" + course.id}>Visit Course</a>
              <button class="btn rounded-t-none rounded-bl-none m-0 variant-filled-error w-1/3" on:click={() => handleDeleteCourse(course.id)}>Delete</button>
            </div>
          </footer>
        </div>
      {/each}
    {:else}
      <p class="text-lg">No courses found</p>
    {/if}
  </div>
</div>
