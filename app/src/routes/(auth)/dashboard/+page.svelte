<script lang="ts">
  import { courseService } from "$lib/services/course";
  import type { Course } from "$lib/services/models/lo-types";
  import { Accordion, AccordionItem, getToastStore, getModalStore, ProgressRadial, type ToastSettings, type ModalSettings } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  export let data;
  let newCourseInput = "";
  let addCourseForm: HTMLFormElement;
  let loading = false;

  $: displayedCourseList = data.courses[0] ? data.courses[0].course_list.courses : [];

  const handleAddCourse = async () => {
    try {
      loading = true;

      const course = await courseService.readCourse(newCourseInput, fetch);

      const { data: userCourseList, error: selectError } = await data.supabase.from("accessed_courses").select(`course_list`).eq("id", data.session.user.id);

      if (!userCourseList || userCourseList.length === 0) {
        const { error: insertError } = await data.supabase.from("accessed_courses").insert([
          {
            id: data.session.user.id,
            course_list: {
              courses: [
                {
                  id: course.courseId,
                  name: course.title,
                  last_accessed: new Date().toISOString(),
                  visits: 1
                }
              ]
            }
          }
        ]);

        if (insertError) {
          showErrorMessage("Error adding course");
        } else {
          const newCourse = {
            id: course.courseId,
            name: course.title,
            last_accessed: new Date().toISOString(),
            visits: 1
          };

          displayedCourseList = displayedCourseList.concat(newCourse);
          showSuccessMessage("Course added successfully");
          addCourseForm.reset();
        }
      } else {
        const existingCourse = userCourseList[0].course_list.courses.find((userCourse) => userCourse.id === course.courseId);

        if (existingCourse) {
          showErrorMessage("This course already exists in your list!");
        } else {
          const courseList = userCourseList[0].course_list;
          courseList.courses.push({
            id: course.courseId,
            name: course.title,
            last_accessed: new Date().toISOString(),
            visits: 1
          });

          const { error: updateError } = await data.supabase.from("accessed_courses").update({ course_list: courseList }).eq("id", data.session.user.id);

          if (updateError) {
            showErrorMessage("Error adding course");
          } else {
            displayedCourseList = courseList.courses;
            showSuccessMessage("Course added successfully");
            addCourseForm.reset();
          }
        }
      }
    } catch (e) {
      showErrorMessage("Error adding course");
    } finally {
      loading = false;
    }
  };

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
            const { data: userCourseList, error } = await data.supabase.from("accessed_courses").select(`course_list`).eq("id", data.session.user.id);

            if (error) {
              showErrorMessage("Error fetching user course list");
              return;
            }

            const courseList = userCourseList[0].course_list;

            const courseIndex = courseList.courses.findIndex((course) => course.id === courseId);

            if (courseIndex !== -1) {
              courseList.courses.splice(courseIndex, 1);
              const { error } = await data.supabase.from("accessed_courses").update({ course_list: courseList }).eq("id", data.session.user.id);

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

  onMount(async () => {
    if (localStorage.isAuthenticating && localStorage.course_url) {
      localStorage.removeItem("isAuthenticating");
      window.location.href = "/course/" + localStorage.course_url;
    }
  });
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex mx-auto py-24 px-8">
    <p class="text-3xl font-bold">Welcome, {data.session.user.user_metadata.name !== undefined ? data.session.user.user_metadata.name : data.session.user.user_metadata.user_name}!</p>
  </div>
</div>

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

<div class="container card mx-auto p-4">
  <Accordion>
    <AccordionItem>
      <svelte:fragment slot="summary">
        <p class="text-2xl font-bold">Add a course</p>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <form on:submit|preventDefault={handleAddCourse} bind:this={addCourseForm}>
          <div class="grid grid-cols-4">
            <input class="input col-span-3" title="Input (text)" type="text" placeholder="Insert course ID here" bind:value={newCourseInput} />
            {#if loading}
              <button class="btn variant-filled-primary ml-4">
                <ProgressRadial width="w-6" />
              </button>
            {:else}
              <input class="btn variant-filled-primary ml-4" type="submit" value="Add" />
            {/if}
          </div>
        </form>
      </svelte:fragment>
    </AccordionItem>
  </Accordion>
</div>
