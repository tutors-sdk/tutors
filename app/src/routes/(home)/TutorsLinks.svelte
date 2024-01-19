<script lang="ts">
    import { modeCurrent } from "@skeletonlabs/skeleton";
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex justify-center items-center mx-auto py-32">
    <div class="lg:w-1/2 mx-4">
      <h1 class="font-bold !text-5xl inline-block my-4">
        An
        <span class="font-bold !text-5xl inline-block bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone">Open Learning </span>
        Web Toolkit
      </h1>
      <p class="font-bold !text-lg my-4">
        A collection of open source components & services supporting the creation of transformative learning experiences using open web standards.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div class="mx-auto">
          <a class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all w-60" href="/course/reference-course" target="_blank" rel="noreferrer"> Demo </a>
        </div>
        <div class="mx-auto">
          <a class="btn btn-xl bg-surface-100-800-token font-bold hover:scale-105 transition-all w-60" href="/course/tutors-reference-manual" target="_blank" rel="noreferrer"
          >Documentation</a
          >
        </div>
        <div class="mx-auto sm:order-4">
          <a class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all w-60" href="/gallery" target="_blank" rel="noreferrer">Gallery</a>
        </div>
        <div class="mx-auto sm:order-3">
          <a class="btn btn-xl bg-surface-100-800-token font-bold hover:scale-105 transition-all w-60" href="/live" target="_blank" rel="noreferrer"> Live </a>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-1/2">
      <img src={$modeCurrent ? "/tutors-reader-light.png" : "/tutors-reader-dark.png"} alt="tutors reader screenshot" />
    </div>
  </div>
</div>