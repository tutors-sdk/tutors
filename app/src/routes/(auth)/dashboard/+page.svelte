<script lang="ts">
  import { courseService } from "$lib/services/course";
  import type { Course } from "$lib/services/models/course";
  import { getToastStore, ProgressRadial, type ToastSettings } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();

  export let data;
  let newCourseInput = "";
  let addCourseForm: HTMLFormElement;
  let loading = false;

  $: displayedCourseList = data.courses[0].course_list.courses;

  const handleAddCourse = async () => {
    try {
      loading = true;

      const course: Course | undefined = await courseService.readCourse(newCourseInput, fetch);

      const { data: userCourseList, error } = await data.supabase
        .from("accessed_courses")
        .select(`course_list`)
        .eq("id", data.session.user.id);

      const existingCourse = userCourseList[0].course_list.courses.find(
        (course) => course.id === newCourseInput
      );

      if (existingCourse) {
        showErrorMessage("This course already exists in your list!");
      } else {
        const courseList = userCourseList[0].course_list;

        courseList.courses.push({
          id: course.id,
          name: course.lo.title,
          last_accessed: new Date().toISOString(),
          visits: 1
        });

        displayedCourseList = [...courseList.courses];

        const { error } = await data.supabase
          .from("accessed_courses")
          .update({ course_list: courseList })
          .eq("id", data.session.user.id);

        if (error) {
          showErrorMessage("Error adding course");
        } else {
          showSuccessMessage("Course added successfully");
          addCourseForm.reset();
        }
      }

      if (error) {
        showErrorMessage("Error adding course");
      }
    } catch (e) {
      showErrorMessage("This course does not exist");
    } finally {
      loading = false;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      loading = true;

      const { data: userCourseList, error } = await data.supabase
        .from("accessed_courses")
        .select(`course_list`)
        .eq("id", data.session.user.id);

      const courseList = userCourseList[0].course_list;

      const courseIndex = courseList.courses.findIndex((course) => course.id === courseId);

      if (courseIndex !== -1) {
        courseList.courses.splice(courseIndex, 1);
        displayedCourseList = [...courseList.courses];

        const { error } = await data.supabase
          .from("accessed_courses")
          .update({ course_list: courseList })
          .eq("id", data.session.user.id);

        if (error) {
          showErrorMessage("Error deleting course");
        } else {
          displayedCourseList.splice(courseIndex, 1);
          showSuccessMessage("Course deleted successfully");
        }
      } else {
        showErrorMessage("Course not found in your list");
      }
    } catch (e) {
      showErrorMessage("An error occurred while deleting the course");
    } finally {
      loading = false;
    }
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

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex mx-auto py-24 px-8">
    <p class="text-3xl font-bold">Welcome, {data.session.user.user_metadata.name}!</p>
  </div>
</div>

<div class="container card mx-auto p-8 my-4">
  <p class="text-2xl font-bold pb-4">Add a course</p>
  <form on:submit|preventDefault={handleAddCourse} bind:this={addCourseForm}>
    <div class="grid grid-cols-4">
      <input
        class="input col-span-3"
        title="Input (text)"
        type="text"
        placeholder="Insert course ID here"
        bind:value={newCourseInput}
      />
      {#if loading}
        <button class="btn variant-filled-primary ml-4"><ProgressRadial width="w-6" /></button>
      {:else}
        <input class="btn variant-filled-primary ml-4" type="submit" value="Add" />
      {/if}
    </div>
  </form>
</div>

<div class="container card mx-auto p-8">
  <p class="text-2xl font-bold pb-4">Your previously accessed courses</p>
  <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#if data.courses && data.courses[0]}
      {#each displayedCourseList as course}
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
              <a
                class="btn rounded-t-none rounded-br-none m-0 variant-filled-primary w-2/3"
                href={"/course/" + course.id}>Visit Course</a
              >
              <button
                class="btn rounded-t-none rounded-bl-none m-0 variant-filled-error w-1/3"
                on:click={() => handleDeleteCourse(course.id)}>Delete</button
              >
            </div>
          </footer>
        </div>
      {/each}
    {:else}
      <p class="text-lg">No courses found</p>
    {/if}
  </div>
</div>
