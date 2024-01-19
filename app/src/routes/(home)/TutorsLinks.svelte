<script lang="ts">
    import { modeCurrent } from "@skeletonlabs/skeleton";
    import Links from "$lib/ui/navigators/Links.svelte";
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
      <Links/>
    </div>
    <div class="w-full lg:w-1/2">
      <img src={$modeCurrent ? "/tutors-reader-light.png" : "/tutors-reader-dark.png"} alt="tutors reader screenshot" />
    </div>
  </div>
</div>