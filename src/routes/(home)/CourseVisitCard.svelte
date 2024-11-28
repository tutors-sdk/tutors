<script>
  import Iconify from "@iconify/svelte";

  let { courseVisit, deleteCourse, starUnstarCourse } = $props(); // Using prop rune syntax
</script>

<div
  class="to-accent-50 dark:to-accent-900 card card-hover from-primary-50 dark:from-primary-900 m-2 border bg-gradient-to-l p-2"
>
  <div class="flex justify-between">
    <section class="p-4">
      <p class="line-clamp-1 font-bold">{courseVisit.title}</p>
      <p class="line-clamp-1">{courseVisit.credits}</p>
      <p class="line-clamp-1">
        Last Accessed: {courseVisit.lastVisit?.slice(0, 10)}
        {courseVisit.lastVisit.slice(11, 19)}
      </p>
      <p>Visits: {courseVisit.visits}</p>
    </section>
    <section class="content-center">
      {#if courseVisit.icon}
        <Iconify icon={courseVisit.icon.type} color={courseVisit.icon.color} height="96" />
      {:else}
        <img class="h-20" src={courseVisit.image} alt={courseVisit.title} />
      {/if}
    </section>
  </div>
  <footer class="card-footer p-0">
    <div class="flex w-full">
      <a
        class="variant-filled-primary btn hover:preset-tonal m-0 w-2/3 rounded-t-none rounded-br-none"
        href={"/course/" + courseVisit.id}>Visit Course</a
      >
      <button
        class="variant-filled-error btn hover:preset-tonal m-0 w-1/3 rounded-t-none rounded-bl-none"
        onclick={() => deleteCourse(courseVisit.id)}>Delete</button
      >
      <button
        class="variant-filled-error btn hover:preset-tonal m-0 w-1/3 rounded-t-none rounded-bl-none"
        onclick={() => starUnstarCourse(courseVisit.id)}
      >
        <Iconify icon={courseVisit.favourite ? "openmoji:star" : "openmoji:black-star"} width="36" height="36" />
      </button>
    </div>
  </footer>
</div>
