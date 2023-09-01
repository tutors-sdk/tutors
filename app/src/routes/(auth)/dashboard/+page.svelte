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
  <div class="flex flex-wrap">
    {#if data.courses && data.courses[0]}
      {#each displayedCourseList as course}
        <a
          class="card !bg-surface-50 dark:!bg-surface-700 card-hover w-full lg:w-96 m-2 p-4"
          href={"/course/" + course.id}
        >
          <div>
            <p class="font-bold">{course.name}</p>
            <p>
              Last Accessed: {course.last_accessed.slice(0, 10)}
              {course.last_accessed.slice(11, 19)}
            </p>
            <p>Visits: {course.visits}</p>
          </div>
        </a>
      {/each}
    {/if}
  </div>
</div>
