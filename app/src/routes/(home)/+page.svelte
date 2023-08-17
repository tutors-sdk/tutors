<script lang="ts">
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import "iconify-icon";
  import DeveloperExperience from "$lib/home/DeveloperExperience.svelte";
  import EducatorExperience from "$lib/home/EducatorExperience.svelte";
  import LearnerExperience from "$lib/home/LearnerExperience.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    if (localStorage.isAuthenticating && localStorage.course_url) {
      localStorage.removeItem("isAuthenticating");
      window.location.href = "/course/" + localStorage.course_url;
    }
  });
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex justify-center items-center mx-auto py-32">
    <div class="lg:w-1/2 mx-4">
      <h1 class="font-bold !text-5xl inline-block my-4">
        An <span
          class="font-bold !text-5xl inline-block bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone"
          >Open Learning</span
        >
        Web Toolkit
      </h1>
      <p class="font-bold !text-lg my-4">
        A collection of open source components & services supporting the creation of transformative
        learning experiences using open web standards.
      </p>
      <div class="space-x-4 space-y-4">
        <a
          class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all w-64"
          href="https://reader.tutors.dev/course/reference-course"
          target="_blank"
          rel="noreferrer">View Demo</a
        >
        <a
          class="btn btn-xl bg-surface-100-800-token font-bold hover:scale-105 transition-all w-64"
          href="https://reader.tutors.dev/course/tutors-reference-manual"
          target="_blank"
          rel="noreferrer">Documentation</a
        >
      </div>
      <div class="space-x-4 space-y-4">
        <a
          class="btn btn-xl bg-surface-100-800-token font-bold hover:scale-105 transition-all w-64"
          href="https://time.tutors.dev/catalogue"
          target="_blank"
          rel="noreferrer">Catalogue</a
        >
        <a
          class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all w-64"
          href="https://time.tutors.dev/live"
          target="_blank"
          rel="noreferrer">Live</a
        >
      </div>
    </div>
    <div class="w-full lg:w-1/2">
      <img
        src={$modeCurrent ? "/tutors-reader-light.png" : "/tutors-reader-dark.png"}
        alt="tutors reader screenshot"
      />
    </div>
  </div>
</div>
<div class="container py-20 mx-auto justify-center items-center">
  <div class="w-full m-4">
    <h2 class="font-bold !text-5xl inline-block my-4">
      The <span
        class="font-bold !text-5xl inline-block bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone"
        >Values</span
      > of the project
    </h2>
  </div>
  <div class="w-full lg:flex justify-center my-12">
    <LearnerExperience />
    <EducatorExperience />
    <DeveloperExperience />
  </div>
</div>
<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex justify-center items-center mx-auto py-20">
    <div class="w-full px-4">
      <h1 class="font-bold !text-5xl inline-block my-4">
        A fully <span
          class="font-bold !text-5xl inline-block bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone"
          >Open Source</span
        > project
      </h1>
      <p class="font-bold !text-lg my-4">
        Tutors is an open source project available for free under the MIT license on GitHub. It
        exists due to the hard work and dedication of all individuals who have contributed to
        project.
      </p>
      <a
        href="https://github.com/tutors-sdk/tutors/graphs/contributors"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://contrib.rocks/image?repo=tutors-sdk/tutors"
          alt="github contributors list"
        />
      </a>
      <div class="my-4">
        <a
          class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all"
          href="https://github.com/tutors-sdk/tutors"
          target="_blank"
          rel="noreferrer"><iconify-icon icon="mdi:github" />&nbsp; View Source Code</a
        >
      </div>
    </div>
  </div>
</div>
